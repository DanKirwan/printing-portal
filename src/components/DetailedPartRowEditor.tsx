import { TableCell, Stack, Typography, TextField } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { PartOrder } from '../lib/types';
import ModelPreview from './ModelPreview';

interface Props {
    part: PartOrder;
    onChange: (part: PartOrder) => void
}

const DetailedPartRowEditor: FC<Props> = ({ part, onChange }) => {
    const handleNotesChange = (notes: string) => {

    }
    const handleQuantityChange = (quantity: number) => {

    }
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
                <TextField
                    // value={part.notes}
                    onChange={e => handleNotesChange(e.target.value)}
                    multiline
                    rows={4} />

            </TableCell>
            <TableCell align="center" width={10}>
                <TextField
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={part.quantity}
                    onChange={e => handleQuantityChange(+e.target.value)} />
            </TableCell>
        </TableRow>
    )
}

export default DetailedPartRowEditor;