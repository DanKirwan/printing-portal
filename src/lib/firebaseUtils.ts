import { User, AuthProvider, UserCredential, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider } from "firebase/auth";
import { FirestoreDataConverter, QueryDocumentSnapshot, Firestore, collection } from "firebase/firestore";
import { auth, fireStore } from "@src/main"
import { Order, PartOrder } from "./types";


const converter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: ((data: T) => data) as any, //TODO Fix?
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

const typedCollection = <T>(db: Firestore, path: string, ...collectionPath: string[]) => collection(db, path, ...collectionPath).withConverter(converter<T>());

const collections = {
    orders: 'orders'
};


export type DBPart = Omit<PartOrder, 'file'> & { fileName: string };

export type DBOrder = Omit<Order, 'parts'> & { parts: DBPart[] };

export const getDB = () => ({
    orders: typedCollection<DBOrder>(fireStore, collections.orders),

});


export const SignInWithSocialMedia = (provider: AuthProvider) =>
    new Promise<UserCredential>((resolve, reject) => {
        signInWithPopup(auth, provider)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });


export const SignInWithEmailAndPassword = ({ loginEmail, loginPassword }: any) => {
    return signInWithEmailAndPassword(auth, loginEmail, loginPassword)
};

export const SignUp = async ({ registerEmail, registerPassword }: any) => {
    return await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
};


export const SignOut = () => { signOut(auth).catch((error) => { alert("Error Signing out"); console.log(error) }) }

export const Providers = {
    google: new GoogleAuthProvider(),
};
