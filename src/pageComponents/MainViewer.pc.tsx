import { Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { BufferGeometry } from 'three';
import MainRenderer from '../components/MainRenderer';
import NormalizedModel from '../components/NormalizedModel';
import STLLoaderHandler from '../components/STLLoaderHandler';
import { useModel } from '../contexts/ModelContext';


const MainViewerPC: FC = () => {
    const [bufferGeom, setBufferGeom] = useState<BufferGeometry>()
    const { volume, x, y, z } = useModel();
    return (
        <Stack direction='row'>

            <Stack width='80%' height='100vh'>
                <Typography variant='h3'>STL Viewer</Typography>
                <STLLoaderHandler onLoad={geom => setBufferGeom(geom)} />
                <MainRenderer geometry={bufferGeom ?? new BufferGeometry()} />
                {/* {bufferGeom && <ModelRender geometry={bufferGeom} />} */}
            </Stack>
            <Stack>
                {volume > 0 && <>
                    <Typography variant='h4'>Volume: {volume.toFixed(2)}cm3</Typography>
                    <Typography variant='h6'>Price: £{(volume / 10000 * 1.6).toFixed(2)}</Typography>
                    <Typography variant='body1'>Depth: {x.toFixed(2)}, Width: {y.toFixed(2)}, Height: {z.toFixed(2)} </Typography>
                </>}
            </Stack>
        </Stack>
    )
}

export default MainViewerPC;