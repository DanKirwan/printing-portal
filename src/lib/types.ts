import { collection, CollectionReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from "firebase/firestore"
import { Material } from "./materialUtils"


export enum OrderStatus {
    Incoming,
    Processing,
    Deleted,
    Completed
}
export type Order = {
    address: Address,
    status: OrderStatus,
    email: string,
    desc: string,
    parts: PartOrder[],
    ordered: Timestamp,
    lead: number,
    settings: OrderSettings,
    userId: string | null,
    // Private Settings
    price?: number,
    expectedShipping?: Timestamp
}

export type PartOrder = {
    file: File,
    quantity: number,
    notes: string,
    settings: PartSettings,
}

export type OrderSettings = {
    material: string,
}


export type PartSettings = {
    color: string,
    resolution: number, // layer height in um
    infill: number, // a number between 0 and 1 representing decimal infil

}


export type Address = {
    firstName: string,
    lastName: string,

    city: string,
    countryCode: string,
    line1: string,
    line2?: string,
    postCode: string,
    county: string,
}

export type DBPart = Omit<PartOrder, 'file'> & { fileName: string };

export type DBOrder = Omit<Order, 'parts'> & { parts: DBPart[] };

export type DBCollections = {
    orders: CollectionReference<DBOrder>;
    materials: CollectionReference<Material>;
}


// Firebase type handling
const converter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: ((data: T) => data) as any, //TODO Fix?
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});




const typedCollection = <T>(db: Firestore, path: string, ...collectionPath: string[]) => collection(db, path, ...collectionPath).withConverter(converter<T>());

const collections = {
    orders: 'orders',
    materials: 'materials'
};

export const getTypedFirestore = (fs: Firestore) => ({
    orders: typedCollection<DBOrder>(fs, collections.orders),
    materials: typedCollection<Material>(fs, collections.materials),

})
