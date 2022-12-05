import { useFrame } from '@react-three/fiber';
import { FC, useRef } from 'react';

interface Props {
    radius: number;
    rpm: number;
}

export const SpinController: FC<Props> = ({ radius, rpm }) => {
    const angleRef = useRef(0);
    useFrame(({ camera }, delta) => {
        const deltaInMin = delta / 60;
        angleRef.current += deltaInMin * (Math.PI * 2) * rpm;
        if (angleRef.current == null) throw "No angle defined";
        camera.position.setX(Math.sin(angleRef.current) * radius);
        camera.position.setY(Math.cos(angleRef.current) * radius);
        camera.lookAt(0, 0, 0);


    });

    return (
        <></>
    )
}
