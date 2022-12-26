import { User, AuthProvider, UserCredential, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider } from "firebase/auth";
import { FirestoreDataConverter, QueryDocumentSnapshot, Firestore, collection } from "firebase/firestore";
import { auth, fireStore } from "@src/main"
import { DBOrder, getTypedFirestore, Order, PartOrder } from "./types";
import { Material } from "./materialUtils";





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


