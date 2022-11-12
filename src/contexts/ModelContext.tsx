import { createContext, useContext, useState } from "react";
import { FCC } from "../lib/utils";
interface IModelContext {
    volume: number;
    x: number;
    y: number;
    z: number;
    setSize: (x: number, y: number, z: number) => void;
}

export const ModelContext = createContext({} as IModelContext);

export const ModelProvider: FCC = ({ children }) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);

    const setSize = (x: number, y: number, z: number) => {
        setX(x);
        setY(y);
        setZ(z);
    }
    return (
        <ModelContext.Provider value={{ volume: x * y * z, x, y, z, setSize }}>
            {children}
        </ModelContext.Provider>
    );
}

export const useModel = () => {
    const context = useContext(ModelContext);
    if (!context) throw new Error("useModel hook must be used within a ModelProvider");
    return context;
}   