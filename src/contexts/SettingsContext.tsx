import { CentralLoading } from "@src/components/generic/CentralLoading";
import { getDB } from "@src/lib/firebaseUtils";
import { AppSettings } from "@src/lib/types";
import { FCC } from "@src/lib/utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Suspense, createContext, useContext, useMemo } from "react";
import { suspend } from "suspend-react";
interface ISettingsContext {
    settings: AppSettings;
    setSettings: (settings: AppSettings) => void;
}

export const SettingsContext = createContext(null as unknown as ISettingsContext);

export const SettingsProvider: FCC = ({ children }) => {

    const settingsDoc = useMemo(() => doc(getDB().settings, 'settings'), []);
    const settings = suspend(async () => (await getDoc(doc(getDB().settings, 'settings'))).data(), []);

    const setSettings = async (settings: AppSettings) => {
        await setDoc(settingsDoc, Object.assign({}, settings));
    }
    return (
        <Suspense fallback={<CentralLoading />}>
            {settings ?
                <SettingsContext.Provider value={{ settings, setSettings }}>
                    {children}
                </SettingsContext.Provider> :
                <CentralLoading />
            }

        </Suspense>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings hook must be used within a SettingsProvider");
    return context;
}