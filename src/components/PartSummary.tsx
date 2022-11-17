import { Typography } from '@mui/material';
import { FC } from 'react';
import { PartOrder } from '../lib/types';

interface Props {
    part: PartOrder;
}

const PartSummary: FC<Props> = ({ part }) => {
    return (
        <>
            <Typography>Material: {part.settings.material}</Typography>
            <Typography>Colour: {part.settings.color}</Typography>
            <Typography>Infil: {part.settings.infill * 100}%</Typography>
            <Typography>Resolution: {part.settings.resolution}μm</Typography>
        </>
    )
}

export default PartSummary;