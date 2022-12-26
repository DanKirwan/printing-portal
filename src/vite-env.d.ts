/// <reference types="vite/client" />
interface ImportMetaEnv {
    // Required
    readonly VITE_USE_EMULATORS: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
