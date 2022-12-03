import { doc, setDoc } from "firebase/firestore";
import { DBPart, getDB } from "./firebaseUtils";
import { Order, PartOrder } from "./types";
import { v4 as uuidv4 } from 'uuid';

export const handleOrderUpload = (order: Order) => {

    const { parts, ...rest } = order;

    const dbOrder = { ...rest, parts: parts.map(getDBPart) };
    setDoc(doc(getDB().users, uuidv4()), Object.assign({}, dbOrder));
}

const getDBPart = (part: PartOrder): DBPart => {
    const { file, ...rest } = part;
    return { ...rest };
}