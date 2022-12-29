import { TableCell, Stack, Typography } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';
import { PartOrder } from '../lib/types';
import ModelPreview from './ModelPreview';
import PartSummary from './parts/PartSettingsSummary';

interface Props {
    part: PartOrder;
    onClick: () => void;

}

const DetailedPartRow: FC<Props> = ({ part, onClick }) => {
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
            onClick={onClick}

        >
            <TableCell align="right" width="20px">
                <Stack width={200} alignItems='center'>
                    <ModelPreview file={part.file} color={'lightGrey'} />
                    <Typography >{part.file.name}</Typography>
                </Stack>
            </TableCell>
            <TableCell align="left" valign='bottom'>
                <PartSummary part={part} />
            </TableCell>
            <TableCell align="left">
                <Typography>{part.notes}</Typography>

            </TableCell>
            <TableCell align="center" width={10}>{part.quantity}</TableCell>
        </TableRow>
    )
}

export default DetailedPartRow;