import { useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { PointerInput } from "camera-controls/dist/types";
import { FC, useEffect, useRef } from "react";
import { Box3, MathUtils, Matrix4, MOUSE, Quaternion, Raycaster, Sphere, Spherical, Vector2, Vector3, Vector4 } from 'three';

const subsetOfTHREE = {
    MOUSE, Vector2, Vector3, Vector4, Quaternion,
    Matrix4, Spherical, Box3, Sphere, Raycaster,
    MathUtils: {
        DEG2RAD: MathUtils.DEG2RAD,
        clamp: MathUtils.clamp,
    },
};

CameraControls.install({ THREE: subsetOfTHREE });

interface Props {
    startPos?: Vector3;
    boundary?: boolean;
}

export const CamControls: FC<Props> = ({ startPos = new Vector3(0.5, 0.5, -0.2), boundary = true }) => {
    const { camera, gl } = useThree();


    const cameraControlsRef = useRef<CameraControls | null>(new CameraControls(camera, gl.domElement));

    useFrame(({ scene }, delta) => {
        if (!cameraControlsRef.current) return;
        cameraControlsRef.current.update(delta);
        gl.render(scene, camera);
    });


    const extractClientCoordFromEvent = (pointers: PointerInput[], out: Vector2) => {
        out.set(0, 0);
        pointers.forEach((pointer) => {
            out.x += pointer.clientX;
            out.y += pointer.clientY;
        });
        out.x /= pointers.length;
        out.y /= pointers.length;
    }

    useEffect(() => {
        const cameraControls = cameraControlsRef.current;
        if (!cameraControls) return;
        // cameraControls.setTarget(startPos.x, startPos.y, startPos.z);
        // cameraControls.minPolarAngle = Math.PI * 1 / 10;
        // cameraControls.maxPolarAngle = Math.PI * 4 / 10;
        // cameraControls.dampingFactor = 0.1;
        // cameraControls.draggingDampingFactor = 0.1;
        // cameraControls.dollySpeed = 3;
        // cameraControls.mouseButtons.left = 2;
        // cameraControls.mouseButtons.right = 1;
        // cameraControls.mouseButtons.middle = 4;
        // // if (boundary) cameraControls.setBoundary(new Box3(new Vector3(0, 0, -1), new Vector3(1, 1, 0)));


    }, [cameraControlsRef.current, startPos]);

    return <></>;
};
