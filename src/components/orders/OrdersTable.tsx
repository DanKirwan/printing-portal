import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '@src/contexts/AuthContext';
import { DBOrder } from '@src/lib/types';

import { WithId } from '@src/lib/utils';
import { FC, ReactNode } from 'react';
import { OrderSummaryRow } from './OrderSummaryRow';
import { orderBy } from 'lodash';


interface Props {
    orders: WithId<DBOrder>[];
    getRowActions: (index: number) => ReactNode;
    showActions?: boolean;
}


export const OrdersTable: FC<Props> = ({ orders, getRowActions, showActions = true }) => {



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
                    <TableCell>Status</TableCell>
                    <TableCell align="right" >Description</TableCell>
                    {showActions && <TableCell align='right'></TableCell>}
                </TableRow>
            </TableHead>

            <TableBody>
                {orders.map((order, i) => (
                    <OrderSummaryRow
                        showActions={showActions}
                        key={i}
                        order={order}
                        actions={getRowActions(i)}
                    />
                ))}
            </TableBody>

        </Table >
    )
}
