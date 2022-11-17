import { TableCell, Stack, Typography, TextField } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { PartOrder } from '../lib/types';
import ModelPreview from './ModelPreview';
import PartSummary from './PartSummary';

interface Props {
    part: PartOrder;
    onChange: (part: PartOrder) => void;
    onClick: () => void;
}

const DetailedPartRowEditor: FC<Props> = ({ part, onChange, onClick }) => {
    const handleNotesChange = (notes: string) => {

    }
    const handleQuantityChange = (quantity: number) => {

    }
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

        >
            <TableCell align="right" width="20px">
                <Stack width={200} alignItems='center' onClick={onClick} sx={{ cursor: 'pointer' }}>
                    <ModelPreview file={part.file} color={'grey'} />
                    <Typography >{part.file.name}</Typography>
                </Stack>
            </TableCell>
            <TableCell align="left" valign='bottom'>
                <PartSummary part={part} />
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