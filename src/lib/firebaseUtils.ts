import { auth, fireStore } from "@src/main";
import { AuthProvider, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { AppSettings, DBOrder, Email, Material, collections } from "./types";
import { CollectionReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, collection } from "firebase/firestore";





export const getDB = () => getTypedFirestore(fireStore);


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



// Firebase type handling
export const converter = <T>(): FirestoreDataConverter<T> => ({
    toFirestore: ((data: T) => data) as any, //TODO Fix?
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});



export type DBCollections = {
    orders: CollectionReference<DBOrder>;
    materials: CollectionReference<Material>;
    emails: CollectionReference<Email>;
    settings: CollectionReference<AppSettings>;
}

const typedCollection = <T>(db: Firestore, path: string, ...collectionPath: string[]) => collection(db, path, ...collectionPath).withConverter(converter<T>());


export const getTypedFirestore = (fs: Firestore) => ({
    orders: typedCollection<DBOrder>(fs, collections.orders),
    materials: typedCollection<Material>(fs, collections.materials),
    emails: typedCollection<Email>(fs, collections.emails),
    settings: typedCollection<AppSettings>(fs, collections.settings),
})