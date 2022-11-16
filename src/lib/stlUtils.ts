import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const loader = new STLLoader();


export const stlToGeom = async (file: File) => {
    const fileUrl = URL.createObjectURL(file);

    const bufferGeom = await loader.loadAsync(fileUrl)
    return bufferGeom;
}