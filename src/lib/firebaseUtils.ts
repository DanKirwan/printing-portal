import { auth, fireStore } from "@src/main";
import { AuthProvider, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { AppSettings, DBOrder, Email, Material, collections } from "./types";
import { CollectionReference, Firestore, FirestoreDataConverter, QueryDocumentSnapshot, collection } from "firebase/firestore";





export const getDB = () => getTypedFirestore(fireStore);


type ErrorCode =
    'auth/email-alreay-exsits' |
    'auth/invalid-email' |
    'auth/invalid-password' |
    'auth/weak-password';
export const getErrorDescription = (code: ErrorCode | string) => {
    switch (code) {
        case 'auth/email-alreay-exsits': return "This email already has an account";
        case 'auth/invalid-email': return "This email is not registered with an account";
        case 'auth/invalid-password': return "Incorrect Password";
        case 'auth/weak-password': return "Passwords should be at least 6 characters";
        case 'auth/email-already-in-use': return "This email already has an account";
        default: return 'Please try again';
    }
}

export const signInWithSocialMedia = (provider: AuthProvider): Promise<UserCredential> =>
    new Promise<UserCredential>((resolve, reject) => {
        signInWithPopup(auth, provider)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });


export const loginWithEmailAndPassword = ({ loginEmail, loginPassword }: any) => {
    return signInWithEmailAndPassword(auth, loginEmail, loginPassword)
};

export const signUp = async (registerEmail: string, registerPassword: string) => {
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