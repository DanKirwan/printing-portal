import { Button, Checkbox, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { DBOrder } from '@src/lib/types';
import { ChangeEvent, FC, ReactNode } from 'react';
import ModelPreview from '../ModelPreview';
import PartSummary from '../parts/PartSettingsSummary';
import { sum } from 'lodash';

interface Props {
    order: DBOrder;

    actions: ReactNode;
}

export const OrderSummaryRow: FC<Props> = ({ order, actions }) => {

    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

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
            <TableCell>
                {order.price ?? "No Quote Yet"}
            </TableCell>
            <TableCell>
                {order.expectedShipping?.toDate().toLocaleDateString('en-GB') ?? "No Shipping Date Yet"}
            </TableCell>
            <TableCell align='right'>
                {order.desc}
            </TableCell>

            <TableCell align='right'>
                {actions}
            </TableCell>
        </TableRow>
    )
}
