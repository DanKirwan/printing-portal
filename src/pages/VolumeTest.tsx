import { Slider, Stack, TextField, Typography } from "@mui/material"
import ModelPreview from "@src/components/ModelPreview"
import STLLoaderHandler from "@src/components/STLLoaderHandler"
import { computeGeometryMetrics, computePrice, computeVolume, estimatePrice } from "@src/lib/stlUtils";
import { useState } from "react";
import { BufferGeometry } from "three";

export default () => {
    const [model, setModel] = useState<BufferGeometry | null>(null);
    const [samples, setSamples] = useState(10);
    const [cutoffAngleInDeg, setCutoffAngleInDeg] = useState(60);
    const [infill, setInfill] = useState(0.5);
    const [supportInfill, setSupportInfill] = useState(0.15);
    const [pricePerKg, setPricePerKg] = useState(10);
    const [density, setDensity] = useState(1240);
    const [wallThickness, setWallThickness] = useState(1.2); // In mm
    const cutoffAngle = cutoffAngleInDeg * Math.PI / 180;
    const [profitMultiplier, setProfitMultiplier] = useState(10);

    const tryEstimate = (model: BufferGeometry) => {
        try {
            return computeGeometryMetrics(model, samples, cutoffAngle);
        } catch (error) {
            alert(JSON.stringify(error));
            return [Number.NaN, Number.NaN]
        }
    }
    const [partVol, supportVol, surfaceArea] = !model ? [Number.NaN, Number.NaN] : tryEstimate(model);
    const volume = computeVolume(partVol, supportVol, surfaceArea, infill, supportInfill, wallThickness);
    const price = computePrice(
        partVol, supportVol, surfaceArea,
        pricePerKg, density,
        infill, supportInfill, wallThickness);

    return (
        <Stack>
            <STLLoaderHandler onLoad={model => setModel(model)} />

            <Typography>
                Part Volume: {partVol / 1000}cm <sup>3</sup> -
                Support Volume: {supportVol / 1000}cm <sup>3</sup> -
                Surface Area: {surfaceArea / 100}cm<sup>3</sup>
            </Typography>
            <Typography>Estimated Cost: £{price} </Typography>
            <Typography>Estimated Price: £{profitMultiplier * price} </Typography>
            <Typography>Estimated Full Volume: {volume / 1000}cm<sup>3</sup></Typography>
            <Typography>Samples: {samples}x{samples} - {`(${samples * samples})`}</Typography>
            <Slider value={samples} onChange={(_, value) => setSamples(value as number)} min={3} max={50} />
            <Typography>Required Support Angle: {`>`}{90 - cutoffAngleInDeg}</Typography>
            <Slider value={cutoffAngleInDeg} onChange={(_, value) => setCutoffAngleInDeg(value as number)} min={0} max={90} />
            <Typography>Infill: {infill * 100}%</Typography>
            <Slider value={infill} onChange={(_, value) => setInfill(value as number)} min={0} max={1} step={0.01} />
            <Typography>Support Avg Infill: {supportInfill * 100}%</Typography>
            <Slider value={supportInfill} onChange={(_, value) => setSupportInfill(value as number)} min={0} max={1} step={0.01} />
            <TextField type='number' value={pricePerKg.toString()} onChange={e => setPricePerKg(+e.target.value)} label='Price Per KG' />
            <TextField type='number' value={density.toString()} onChange={e => setDensity(+e.target.value)} label='Density (kg/m3)' />
            <TextField type='number' value={wallThickness.toString()} onChange={e => setWallThickness(+e.target.value)} label='Wall Thickness (mm)' />
            <TextField type='number' value={profitMultiplier.toString()} onChange={e => setProfitMultiplier(+e.target.value)} label='Profit Multiplier' />
        </Stack>
    )
}