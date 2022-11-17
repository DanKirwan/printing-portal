import { Order, PartOrder } from "../lib/types"
import OrderSummaryPC from "../pageComponents/OrderSummary.pc"
import cubeUrl from '@src/assets/cube.stl?url';
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Suspense } from "react";
import { Typography } from "@mui/material";
import { suspend } from "suspend-react";
import { getFileFromUrl } from "../lib/utils";


export default () => {
    const file = suspend(() => getFileFromUrl(cubeUrl, "example file.stl"), []);
    const testParts: PartOrder[] = [
        {
            file,
            notes: "Test Note",
            quantity: 10,
            settings: {
                color: "red",
                infill: 0.8,
                material: "PLA",
                resolution: 300
            }
        }
    ]

    const testOrder: Order = {
        desc: "Test",
        email: "cassian@h3dp.org",
        lead: 2,
        ordered: new Date(),
        parts: testParts,
    }
    return (
        <Suspense fallback={<Typography>Loading Example Data</Typography>}>

            <OrderSummaryPC order={testOrder} />
        </Suspense>
    )
}