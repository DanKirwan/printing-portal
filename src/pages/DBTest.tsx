import { ref, getDownloadURL, getBytes, getBlob } from "firebase/storage";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom"
import { suspend } from "suspend-react";
import { storage } from "@src/main";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import PartSummary from "@src/components/PartSummary";
import { getFileFromUrl } from "@src/lib/utils";
import { PartOrder } from "@src/lib/types";
import Loading from "@src/components/Loading";
import PartDetailsModal from "@src/components/PartDetailsModal";


function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

export default () => {
    const query = useQuery();
    const storageRef = useMemo(() => ref(storage, "100mm_Cube.STL"), []);

    const handleFileLoad = async () => {
        const blob = await getBlob(storageRef);
        console.log(blob);
        const file = new File([blob], "Model");
        return file;
    }
    const file = suspend(handleFileLoad, []);
    if (!file) return <Loading />;

    const part: PartOrder = {
        file,
        notes: "None",
        quantity: 10,
        settings: {
            color: "red",
            infill: 0.2,
            material: "PLA",
            resolution: 100
        }
    }
    return (

        <PartDetailsModal part={part} />
    )
}