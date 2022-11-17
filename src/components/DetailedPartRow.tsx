import { TableCell, Stack, Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { PartOrder } from '../lib/types';
import ModelPreview from './ModelPreview';

interface Props {
    part: PartOrder
}

const DetailedPartRow: FC<Props> = ({ part }) => {
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}

        >
            <TableCell align="right" width="20px">
                <Stack width={200} alignItems='center'>
                    <ModelPreview file={part.file} color={'grey'} />
                    <Typography >{part.file.name}</Typography>
                </Stack>
            </TableCell>
            <TableCell align="left" valign='bottom'>
                <Typography>Material: {part.settings.material}</Typography>
                <Typography>Colour: {part.settings.color}</Typography>
                <Typography>Infil: {part.settings.infill * 100}%</Typography>
                <Typography>Resolution: {part.settings.resolution}μm</Typography>
            </TableCell>
            <TableCell align="left">
                <Typography>{part.notes}</Typography>

            </TableCell>
            <TableCell align="center" width={10}>{part.quantity}</TableCell>
        </TableRow>
    )
}

export default DetailedPartRow;