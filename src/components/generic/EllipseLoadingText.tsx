import { useInterval } from '@src/lib/hooks';
import { FC, useState } from 'react';

interface Props {
    interval?: number;
}

export const EllipseLoadingText: FC<Props> = ({ interval = 200 }) => {
    const states = ['  ', '.  ', '.. ', '...'];
    const [state, setState] = useState(0);
    useInterval(() => {
        setState(s => (s + 1) % states.length);
    }, interval);
    return (
        <span>{states[state]}</span>
    )
}
