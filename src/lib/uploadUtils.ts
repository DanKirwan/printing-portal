import { doc, getDoc, setDoc } from "firebase/firestore";
import { DBOrder, DBPart, getDB } from "./firebaseUtils";
import { Order, PartOrder } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { getBlob, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@src/main";

export const handleOrderUpload = async (order: Order): Promise<string> => {

    const { parts, ...rest } = order;

    const uuid = uuidv4();
    const dbOrder = { ...rest, parts: parts.map(convertToDBPart) };
    const orderUpload = await setDoc(doc(getDB().orders, uuid), Object.assign({}, dbOrder));
    for (var part of parts) {
        await uploadFile(part.file, uuid);
    }

    return uuid;

}

export const getOrder = async (uuid: string): Promise<Order> => {
    const order = await getDoc(doc(getDB().orders, uuid));
    const orderData = order.data();
    if (!orderData) throw `Could not find order with UUID: ${uuid}`;
    return convertOrder(orderData, uuid);
}

const getUploadPath = (uuid: string, fileName: string) => `${uuid}/${fileName}`;

const uploadFile = async (file: File, uuid: string) => {
    const storageRef = ref(storage, getUploadPath(uuid, file.name));
    const uploadTask = await uploadBytesResumable(storageRef, file);
    console.log(uploadTask)

}
const convertToDBPart = (part: PartOrder): DBPart => {
    const { file, ...rest } = part;
    return { ...rest, fileName: file.name };
}



const convertPart = async (part: DBPart, orderId: string): Promise<PartOrder> => {
    const { fileName, ...rest } = part;
    const storageRef = ref(storage, getUploadPath(orderId, fileName));

    const blob = await getBlob(storageRef);
    if (!blob) throw "Could not download requested file from server";
    const file = new File([blob], fileName);
    return { ...rest, file };
}


const convertOrder = async (order: DBOrder, uuid: string): Promise<Order> => {
    const { parts, ...rest } = order;
    const partPromises = order.parts.map(part => convertPart(part, uuid));
    const populatedParts = await Promise.all(partPromises);
    return { ...rest, parts: populatedParts };
}