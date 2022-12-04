import { Stack, TableCell, TableRow, Typography } from '@mui/material';
import { DBOrder } from '@src/lib/firebaseUtils';
import { FC } from 'react';
import ModelPreview from '../ModelPreview';
import PartSummary from '../parts/PartSettingsSummary';
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
            <TableCell >
                {order.email}
            </TableCell>

            <TableCell  >
                {order.ordered.toDate().toLocaleDateString('en-GB')}
            </TableCell>

            <TableCell >
                <Stack>

                    <Typography>{order.settings.material}</Typography>

                </Stack>

            </TableCell>

            <TableCell>
                <Stack>

                    <Typography>Parts: {order.parts.length}</Typography>

                    <Typography variant='body2'>Units: {sum(order.parts.map(p => p.quantity))}</Typography>
                </Stack>

            </TableCell>
            <TableCell align='right'>
                {order.desc}
            </TableCell>
        </TableRow>
    )
}
