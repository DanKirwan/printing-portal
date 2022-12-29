import { Canvas, Color } from '@react-three/fiber';
import { FC, Suspense } from 'react';
import { stlToGeom } from '../lib/stlUtils';
import NormalizedModel from './NormalizedModel';
import { suspend } from 'suspend-react'
import { CircularProgress } from '@mui/material';
import Loading from './Loading';
import { BufferGeometry } from 'three';

interface Props {
    file: File;
    color: Color;
}

const ModelPreview: FC<Props> = ({ file, color }) => {
    const geometry = suspend(() => stlToGeom(file), [file]);
    return (
        <Suspense fallback={<Loading />}>

            <Canvas camera={{ position: [1, 1, 1], up: [0, 0, 1] }}>
                <color attach="background" args={['white']} />
                <ambientLight />
                <pointLight position={[10, 5, -10]} />
                <pointLight position={[-10, 5, 5]} />

                <NormalizedModel geometry={geometry} color={color} />
            </Canvas >
        </Suspense>
    )
}

export default ModelPreview;