import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '@src/contexts/AuthContext';
import { DBOrder } from '@src/lib/types';

import { WithId } from '@src/lib/utils';
import { FC, ReactNode } from 'react';
import { OrderSummaryRow } from './OrderSummaryRow';


interface Props {
    orders: WithId<DBOrder>[];
    getRowActions: (index: number) => ReactNode;
}

export const OrdersTable: FC<Props> = ({ orders, getRowActions }) => {




    return (
        <Table stickyHeader>
            <TableHead >
                <TableRow>

                    <TableCell>Email</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Estimated Shipping</TableCell>
                    <TableCell align="right" >Description</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {orders.map((order, i) => (
                    <OrderSummaryRow
                        key={i}
                        order={order}
                        actions={getRowActions(i)}
                    />
                ))}
            </TableBody>

        </Table >
    )
}
