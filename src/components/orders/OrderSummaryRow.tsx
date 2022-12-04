import { Stack, TableCell, TableRow, Typography } from '@mui/material';
import { DBOrder } from '@src/lib/firebaseUtils';
import { FC } from 'react';
import ModelPreview from '../ModelPreview';
import PartSummary from '../PartSummary';
import { sum } from 'lodash';

interface Props {
    order: DBOrder;
    onClick: () => void;
}

// Desc
// Email
// Date
// Count
// Total Count
export const OrderSummaryRow: FC<Props> = ({ order, onClick }) => {
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
            onClick={onClick}

        >
            <TableCell align="right" width="20px">
                {order.desc}
            </TableCell>
            <TableCell>
                {order.email}
            </TableCell>
            <TableCell align="left" valign='bottom'>
                {/* {order.ordered?.toLocaleDateString()} */}
            </TableCell>
            <TableCell align="left">
                Part Count: {order.parts.length}
            </TableCell>
            <TableCell>
                Total Parts: {sum(order.parts.map(p => p.quantity))}
            </TableCell>
        </TableRow>
    )
}
