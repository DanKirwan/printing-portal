import { auth } from "@src/main";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { FCC } from "../lib/utils";
interface IAuthContext {
    uid: string | null;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: FCC = ({ children }) => {
    const [uid, setUid] = useState<string | null>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUid(null);
            if (!currentUser) return;
            const { uid, email } = currentUser;
            setUid(uid);
            if (!email) throw `User with uid=${uid} has no email`;
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ uid }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth hook must be used within a AuthProvider");
    return context;
}