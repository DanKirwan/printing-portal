import { TableCell, Stack, Typography, TextField, IconButton } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { PartOrder } from '../lib/types';
import ModelPreview from './ModelPreview';
import PartSummary from './parts/PartSettingsSummary';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    part: PartOrder;
    onChange: (part: PartOrder) => void;
    onClick: () => void;
    onDelete: () => void;
}

const DetailedPartRowEditor: FC<Props> = ({ part, onChange, onClick, onDelete }) => {
    const handleNotesChange = (notes: string) => {
        const { notes: _, ...rest } = part;
        onChange({ ...rest, notes });
    }
    const handleQuantityChange = (newQuantityValue: string) => {
        const quantity = newQuantityValue == '' ? 0 : Number.parseInt(newQuantityValue);
        if (Number.isNaN(quantity)) return;
        const { quantity: _, ...rest } = part;
        onChange({ ...rest, quantity });
    }
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="right" width="20px">
                <Stack width={200} alignItems='center' onClick={onClick} sx={{ cursor: 'pointer' }}>
                    <ModelPreview file={part.file} color={'lightGrey'} />
                    <Typography textAlign='center' >{part.file.name}</Typography>
                </Stack>
            </TableCell>
            <TableCell align="left" valign='bottom' onClick={onClick} sx={{ cursor: 'pointer' }}>
                <PartSummary part={part} />
            </TableCell>
            <TableCell align="left">
                <TextField
                    value={part.notes}
                    onChange={e => handleNotesChange(e.target.value)}
                    multiline
                    rows={4} />

            </TableCell>
            <TableCell align="center" width={10}>
                <TextField
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={part.quantity}
                    onChange={e => handleQuantityChange(e.target.value)} />
            </TableCell>
            <TableCell align='right'>
                <IconButton onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow >
    )
}

export default DetailedPartRowEditor;