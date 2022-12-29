import { Canvas } from '@react-three/fiber';
import { FC, useState } from 'react';
import { BufferGeometry, } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ModelContext, useModel } from '../contexts/ModelContext';
import { CamControls } from './CameraControls';
import NormalizedModel from './NormalizedModel';
import { Stats, useContextBridge } from "@react-three/drei";


interface Props {
    geometry: BufferGeometry;
}

const MainRenderer: FC<Props> = ({ geometry }) => {
    const ContextBridge = useContextBridge(ModelContext);

    return (
        <Canvas flat dpr={window.devicePixelRatio} camera={{ position: [2, 2, 2], fov: 75, near: 0.01, far: 2000, up: [0, 0, 1] }} style={{ height: '100%' }}>
            <ContextBridge>

                <color attach="background" args={['white']} />
                <CamControls boundary={false} />
                <ambientLight />
                <pointLight position={[10, 5, 10]} />
                <pointLight position={[-10, 5, 10]} />

                <NormalizedModel geometry={geometry} color="grey" />
            </ContextBridge>
        </Canvas>
    )
}

export default MainRenderer;