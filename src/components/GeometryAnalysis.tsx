import { Stack, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { BufferGeometry, Vector3 } from 'three';
import { useModel } from '../contexts/ModelContext';
import { getVolume } from '../lib/stlUtils';

interface Props {
    geometry: BufferGeometry
}

const GeometryAnalysis: FC<Props> = ({ geometry }) => {
    const size = useMemo(() => new Vector3(), []);
    geometry.computeBoundingBox();

    const bb = geometry.boundingBox;
    bb?.getSize(size);
    const volume = getVolume(geometry);
    const volInCm = volume / 1000;


    return (
        <Stack>
            <Typography>Dimensions: {size.x.toFixed(2)}×{size.y.toFixed(2)}×{size.z.toFixed(2)}mm</Typography>
            <Typography>Bounding Volume: {(size.x * size.y * size.z / 1000).toFixed(4)}cm<sup>3</sup></Typography>
            <Typography>...</Typography>
        </Stack>
    )
}

export default GeometryAnalysis;