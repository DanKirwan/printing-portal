import { Slider, Stack, TextField, Typography } from "@mui/material"
import ModelPreview from "@src/components/ModelPreview"
import STLLoaderHandler from "@src/components/STLLoaderHandler"
import { estimateVolume } from "@src/lib/stlUtils";
import { useState } from "react";
import { BufferGeometry } from "three";

export default () => {
    const [model, setModel] = useState<BufferGeometry | null>(null);
    const [samples, setSamples] = useState(10);
    const [cutoffAngleInDeg, setCutoffAngleInDeg] = useState(60);
    const [infill, setInfill] = useState(0.5);
    const [supportInfill, setSupportInfill] = useState(0.15);
    const cutoffAngle = cutoffAngleInDeg * Math.PI / 180;

    const tryEstimate = (model: BufferGeometry) => {
        try {
            return estimateVolume(model, samples, cutoffAngle);
        } catch (error) {
            alert(JSON.stringify(error));
            return [Number.NaN, Number.NaN]
        }
    }
    const [partVol, supportVol] = !model ? [Number.NaN, Number.NaN] : tryEstimate(model);
    const fullVolume = partVol * infill + supportVol * supportInfill;
    return (
        <Stack>
            <STLLoaderHandler onLoad={model => setModel(model)} />

            <Typography>Part Volume: {partVol / 1000}cm <sup>3</sup> - Support Volume: {supportVol / 1000}cm <sup>3</sup></Typography>
            <Typography>Estimated Full Volume: {fullVolume / 1000}cm<sup>3</sup></Typography>
            <Typography>Samples: {samples}x{samples} - {`(${samples * samples})`}</Typography>
            <Slider value={samples} onChange={(_, value) => setSamples(value as number)} min={3} max={50} />
            <Typography>Required Support Angle: {`>`}{90 - cutoffAngleInDeg}</Typography>
            <Slider value={cutoffAngleInDeg} onChange={(_, value) => setCutoffAngleInDeg(value as number)} min={0} max={90} />
            <Typography>Infill: {infill * 100}%</Typography>
            <Slider value={infill} onChange={(_, value) => setInfill(value as number)} min={0} max={1} step={0.01} />
            <Typography>Support Avg Infill: {supportInfill * 100}%</Typography>
            <Slider value={supportInfill} onChange={(_, value) => setSupportInfill(value as number)} min={0} max={1} step={0.01} />

        </Stack>
    )
}