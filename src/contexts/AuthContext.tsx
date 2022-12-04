import { auth } from "@src/main";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { FCC } from "../lib/utils";
interface IAuthContext {
    uid: string | null;
    email: string | null;
    photoURL: string | null;
    displayName: string | null;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: FCC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            if (!currentUser) return;
            const { uid, email } = currentUser;

            if (!email) throw `User with uid=${uid} has no email`;
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{
            uid: user?.uid ?? null,
            email: user?.email ?? null,
            photoURL: user?.photoURL ?? null,
            displayName: user?.displayName ?? null
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth hook must be used within a AuthProvider");
    return context;
}