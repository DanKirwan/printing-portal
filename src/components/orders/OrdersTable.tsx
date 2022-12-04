import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { DBOrder } from '@src/lib/firebaseUtils';
import { WithId } from '@src/lib/utils';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderSummaryRow } from './OrderSummaryRow';


interface Props {
    orders: WithId<DBOrder>[];
}

export const OrdersTable: FC<Props> = ({ orders }) => {

    const navigate = useNavigate();

    const handleClick = (orderId: string) => {
        navigate(`/${orderId}`);
    }
    return (
        <Table stickyHeader>
            <TableHead >
                <TableRow>
                    <TableCell align="left" >Description</TableCell>
                    <TableCell align="left" >Email</TableCell>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="center">Parts Count</TableCell>
                    <TableCell align="center">Total Parts</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {orders.map((order, i) => (
                    <OrderSummaryRow order={order} onClick={() => handleClick(order.id)} />
                ))}
            </TableBody>

        </Table>
    )
}
