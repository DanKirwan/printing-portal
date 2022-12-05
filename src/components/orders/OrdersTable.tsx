import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '@src/contexts/AuthContext';
import { DBOrder } from '@src/lib/firebaseUtils';
import { updateOrder } from '@src/lib/uploadUtils';
import { WithId } from '@src/lib/utils';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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

                    <TableCell >Email</TableCell>
                    <TableCell >Date</TableCell>
                    <TableCell >Material</TableCell>
                    <TableCell >Size</TableCell>
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
