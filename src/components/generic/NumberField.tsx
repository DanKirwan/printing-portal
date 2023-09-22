import { TextField } from '@mui/material';
import { isNaN } from 'lodash';
import { FC } from 'react';

interface Props {
    value: number;
    setValue: (value: number) => void;
    label?: string;
}

export const NumberField: FC<Props> = ({ value, setValue, label = '' }) => {
    const handleChange = (inputVal: string) => {
        if (!inputVal) {
            setValue(0);
            return;
        }
        const parsedVal = Number.parseFloat(inputVal);
        if (isNaN(parsedVal)) return;
        setValue(parsedVal);
    }
    return (
        <TextField
            type='number'
            value={value.toString()}
            onChange={e => handleChange(e.target.value)} label={label} />
    )
}
