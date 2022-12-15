import { uuidv4 } from "@firebase/util";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { getDB } from "./firebaseUtils";

export type Material = {
    name: string,
    description: string,
    colors: Color[],
};


export type Color = {
    name: string,
    available: boolean,
}

export const addMaterial = (material: Material) => setMaterial(material, uuidv4());
export const setMaterial = async (material: Material, uuid: string): Promise<string> => {
    await setDoc(doc(getDB().materials, uuid), Object.assign({}, material));
    return uuid;
}

export const deleteMaterial = async (uuid: string): Promise<void> => {
    await deleteDoc(doc(getDB().materials, uuid));
}