import { Canvas, Color, useFrame, useThree } from '@react-three/fiber';
import { FC, useMemo, useState } from 'react';
import { BufferGeometry, Vector3, } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useModel } from '../contexts/ModelContext';
import { CamControls } from './CameraControls';

interface Props {
    geometry: BufferGeometry;
    color: Color;
}


const NormalizedModel: FC<Props> = ({ geometry, color }) => {
    const [hovered, setHovered] = useState(false);
    const centerVector = useMemo(() => new Vector3(), []);
    const size = useMemo(() => new Vector3(), []);
    const { setSize } = useModel();
    geometry.computeBoundingBox();

    const bb = geometry.boundingBox;
    bb?.getCenter(centerVector);
    bb?.getSize(size);

    geometry.computeBoundingBox();

    setSize(size.x, size.y, size.z);


    return (
        <mesh geometry={geometry}
            scale={[1 / size.x, 1 / size.y, 1 / size.z]}
            position={[
                -centerVector.x / size.x,
                -centerVector.y / size.y,
                -centerVector.z / size.z
            ]}
            onPointerOver={_ => setHovered(true)}
            onPointerOut={_ => setHovered(false)}>
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

export default NormalizedModel;