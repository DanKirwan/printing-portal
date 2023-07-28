import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { DBOrder, DBPart, Order, PartOrder } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { FirebaseStorage, deleteObject, getBlob, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { DBCollections } from "./firebaseUtils";
import { orderBy, zip } from "lodash";


export const updateOrder = async (orderId: string, order: Order, db: DBCollections, storage: FirebaseStorage): Promise<string> => {
    const { parts, userId, ...rest } = order;
    const prevOrderSnapshot = await getDoc(doc(db.orders, orderId));
    const prevOrder = prevOrderSnapshot.data();
    if (!prevOrderSnapshot.exists || !prevOrder) throw new Error(`Cannot update order - order with id ${orderId} does not exist`);


    const dbOrder = { ...rest, parts: parts.map(convertToDBPart), userId };
    await setDoc(doc(db.orders, orderId), Object.assign({}, dbOrder));
    await deleteOrderFiles(orderId, prevOrder, storage);
    await uploadOrderFiles(orderId, order, userId, storage);

    return orderId;
}

const deleteOrderFiles = async (orderId: string, order: DBOrder, storage: FirebaseStorage) => {
    for (const part of order.parts) {
        const storageRef = ref(storage, getUploadPath(orderId, part.fileName, order.userId));
        await deleteObject(storageRef);
    }
}

export const uploadOrder = async (order: Order, userId: string | null, db: DBCollections, storage: FirebaseStorage): Promise<string> => {

    const { parts, ...rest } = order;

    const uuid = uuidv4();
    const dbOrder = { ...rest, parts: parts.map(convertToDBPart), userId };
    await setDoc(doc(db.orders, uuid), Object.assign({}, dbOrder));
    await uploadOrderFiles(uuid, order, userId, storage);

    return uuid;

}

const uploadOrderFiles = async (orderId: string, order: Order, userId: string | null, storage: FirebaseStorage): Promise<void> => {
    const { parts } = order;
    for (var part of parts) {
        await uploadFile(part.file, orderId, userId, storage);
    }
}

export const getOrder = async (uuid: string, db: DBCollections, storage: FirebaseStorage): Promise<Order> => {
    const order = await getDoc(doc(db.orders, uuid));
    const orderData = order.data();
    if (!orderData) throw `Could not find order with UUID: ${uuid}`;
    return convertOrder(orderData, uuid, storage);
}

// will update new part metadata if newPartMetadata is null
export const updateOrderMetadata = async (db: DBCollections, uuid: string, newOrder: Omit<Order, 'parts'>, newPartMetadata?: DBPart[],): Promise<void> => {
    const order = await getDoc(doc(db.orders, uuid));
    const orderData = order.data();
    if (!orderData) throw `Could not find order with UUID: ${uuid}`;
    const { userId, parts: oldParts } = orderData;

    const oldPartNames = oldParts.map(p => p.fileName).sort()
    const newPartNames = newPartMetadata?.map(p => p.fileName).sort();

    // Confirm all part names match
    if (newPartMetadata != null && !zip(oldPartNames, newPartNames).every(([a, b]) => a === b)) {
        throw new Error("Cannot update metadata - parts have changed");
    }
    const parts = newPartMetadata ?? oldParts;
    const newDBOrder: DBOrder = { ...newOrder, parts, userId };
    await updateDoc(doc(db.orders, uuid), Object.assign({}, newDBOrder));

}

export const deleteOrder = async (uuid: string, db: DBCollections): Promise<void> => {

    await deleteDoc(doc(db.orders, uuid));
    // TODO delete files too (Maybe delete entire folder?)
}

const getUploadPath = (uuid: string, fileName: string, userId: string | null) => `${userId ?? "anonymous"}/${uuid}/${fileName}`;

const uploadFile = async (file: File, uuid: string, userId: string | null, storage: FirebaseStorage) => {
    const storageRef = ref(storage, getUploadPath(uuid, file.name, userId));
    const uploadTask = await uploadBytesResumable(storageRef, file);
    console.log(uploadTask)

}
export const convertToDBPart = (part: PartOrder): DBPart => {
    const { file, ...rest } = part;
    return { ...rest, fileName: file.name };
}



const convertPart = async (part: DBPart, orderId: string, userId: string | null, storage: FirebaseStorage): Promise<PartOrder> => {
    const { fileName, ...rest } = part;
    const storageRef = ref(storage, getUploadPath(orderId, fileName, userId));

    const blob = await getBlob(storageRef);
    if (!blob) throw "Could not download requested file from server";
    const file = new File([blob], fileName);
    return { ...rest, file };
}


const convertOrder = async (order: DBOrder, uuid: string, storage: FirebaseStorage): Promise<Order> => {
    const { parts, ...rest } = order;
    const partPromises = order.parts.map(part => convertPart(part, uuid, order.userId, storage));
    const populatedParts = await Promise.all(partPromises);
    return { ...rest, parts: populatedParts };
}