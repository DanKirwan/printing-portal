import { Canvas } from '@react-three/fiber';
import { FC, Suspense, useMemo } from 'react';
import { stlToGeom } from '../lib/stlUtils';
import NormalizedModel from './NormalizedModel';
import { suspend } from 'suspend-react'
import { CircularProgress } from '@mui/material';
import Loading from './Loading';
import { AmbientLight, BufferGeometry, Color, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { max } from 'lodash';

interface Props {
    file: File;
    color: Color;
}
const renderer = new WebGLRenderer();
const width = 600;
const height = 400;

const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(1, 1, 1);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
renderer.setSize(width, height);

const ModelPreview: FC<Props> = ({ file, color }) => {
    const geometry = suspend(() => stlToGeom(file), [file]);
    const imgUrl = useMemo(() => {
        const scene = new Scene();

        geometry.computeBoundingBox();

        const bb = geometry.boundingBox;
        const centerVector = new Vector3();
        const size = new Vector3();
        bb?.getCenter(centerVector);
        bb?.getSize(size);
        const scale = max([size.x, size.y, size.z])!;

        scene.background = new Color('white');
        const material = new MeshStandardMaterial({ color: 'lightGrey' });
        const mesh = new Mesh(geometry, material);

        mesh.scale.set(1 / scale, 1 / scale, 1 / scale);
        mesh.position.set(
            -centerVector.x / scale,
            -centerVector.y / scale,
            -centerVector.z / scale,);


        scene.add(mesh);

        const lightA = new PointLight(0xffffff, 1);
        lightA.position.set(10, 5, 10);
        scene.add(lightA);

        const lightB = new PointLight(0xffffff, 1);
        lightB.position.set(-10, 5, 5);
        scene.add(lightB);

        renderer.render(scene, camera);
        const imgUrl = renderer.domElement.toDataURL('image/png').replace('image/png', 'image/octet-stream');

        return imgUrl;
    }, [geometry, color])


    // document.body.appendChild(renderer.domElement);
    return (
        <Suspense fallback={<Loading />}>
            <img src={imgUrl} style={{ width: '100%', height: '100%' }} />
            {/* <Canvas camera={{ position: [1, 1, 1], up: [0, 0, 1] }}>
                <color attach="background" args={['white']} />
                <ambientLight />
                <pointLight position={[10, 5, -10]} />
                <pointLight position={[-10, 5, 5]} />

                <NormalizedModel geometry={geometry} color={color} />
            </Canvas > */}
        </Suspense>
    )
}

export default ModelPreview;