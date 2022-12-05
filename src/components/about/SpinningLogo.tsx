import { Canvas } from '@react-three/fiber';
import { FC, Suspense } from 'react';
import NormalizedModel from '../NormalizedModel';
import cubeUrl from '@src/assets/cube.stl';
import { stlToGeom } from '@src/lib/stlUtils';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Loader } from '@react-three/drei';
import Loading from '../Loading';
import { suspend } from 'suspend-react';
import { CamControls } from '../CameraControls';
import { Stack } from '@mui/material';
import { SpinController } from './SpinController';

export const SpinningLogo: FC = () => {
    const cubeModel = suspend(() => new STLLoader().loadAsync(cubeUrl), [cubeUrl]);
    return (
        <Suspense fallback={<Loading />}>
            <Canvas dpr={window.devicePixelRatio} camera={{ position: [1, 1, -1], fov: 60, near: 0.01, far: 2000, up: [0, 0, -1] }} style={{ height: '100%' }}>


                <pointLight position={[-5, 5, 20]} />
                <pointLight position={[5, 5, -15]} />
                <pointLight position={[-10, -10, 0]} />
                <SpinController radius={1.5} rpm={5} />
                <NormalizedModel geometry={cubeModel} color="rgb(100,0, 0)" />
            </Canvas>
        </Suspense>
    )
}
