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
        <Canvas style={{ height: '90vh' }} flat dpr={window.devicePixelRatio} camera={{ position: [2, 2, 0], fov: 75, near: 0.01, far: 2000, up: [0, 0, -1] }}>
            <ContextBridge>

                <color attach="background" args={[0x7799aa]} />
                <CamControls boundary={false} />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <NormalizedModel geometry={geometry} color="0xaaaaaa" />
            </ContextBridge>
        </Canvas>
    )
}

export default MainRenderer;