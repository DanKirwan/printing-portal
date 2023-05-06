import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { DBOrder, DBPart, Order, PartOrder } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { FirebaseStorage, getBlob, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { uploadEmail } from "./emailUtils";
import { DBCollections } from "./firebaseUtils";


export const uploadOrder = async (order: Order, userId: string | null, db: DBCollections, storage: FirebaseStorage): Promise<string> => {

    const { parts, ...rest } = order;

    const uuid = uuidv4();
    const dbOrder = { ...rest, parts: parts.map(convertToDBPart), userId };
    await setDoc(doc(db.orders, uuid), Object.assign({}, dbOrder));
    for (var part of parts) {
        await uploadFile(part.file, uuid, userId, storage);
    }

    return uuid;

}

export const getOrder = async (uuid: string, db: DBCollections, storage: FirebaseStorage): Promise<Order> => {
    const order = await getDoc(doc(db.orders, uuid));
    const orderData = order.data();
    if (!orderData) throw `Could not find order with UUID: ${uuid}`;
    return convertOrder(orderData, uuid, storage);
}

export const updateOrder = async (uuid: string, newOrder: Omit<Order, 'parts'>, db: DBCollections): Promise<void> => {
    const order = await getDoc(doc(db.orders, uuid));
    const orderData = order.data();
    if (!orderData) throw `Could not find order with UUID: ${uuid}`;
    const { parts, userId } = orderData;

    const newDBOrder: DBOrder = { ...newOrder, parts, userId };
    await updateDoc(doc(db.orders, uuid), Object.assign({}, newDBOrder));

}

export const deleteOrder = async (uuid: string, db: DBCollections): Promise<void> => {
    await deleteDoc(doc(db.orders, uuid));
    // TODO delete files too
}

const getUploadPath = (uuid: string, fileName: string, userId: string | null) => `${userId ?? "anonymous"}/${uuid}/${fileName}`;

const uploadFile = async (file: File, uuid: string, userId: string | null, storage: FirebaseStorage) => {
    const storageRef = ref(storage, getUploadPath(uuid, file.name, userId));
    const uploadTask = await uploadBytesResumable(storageRef, file);
    console.log(uploadTask)

}
const convertToDBPart = (part: PartOrder): DBPart => {
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