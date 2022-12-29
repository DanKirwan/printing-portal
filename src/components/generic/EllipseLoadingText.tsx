import { useInterval } from '@src/lib/hooks';
import { FC, useState } from 'react';



export const EllipseLoadingText: FC = () => {
    const states = ['  ', '.  ', '.. ', '...'];
    const [state, setState] = useState(0);
    useInterval(() => {
        setState(s => (s + 1) % states.length);
    }, 200);
    return (
        <span>{states[state]}</span>
    )
}
