import { DBOrder, Order, OrderStatus } from '@src/lib/types';
import { WithId } from '@src/lib/utils';
import { FC, ReactNode, useState } from 'react';
import { OrdersTable } from '../orders/OrdersTable';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { ConfirmButton } from '../generic/ConfirmButton';
import { DatePicker } from '@mui/x-date-pickers';
import Loading from '../Loading';

interface Props {
    orders: WithId<DBOrder>[];
    showActions?: boolean;
    handleOrderUpdate: (uuid: string, newOrder: Omit<Order, 'parts'>) => void;
    handleClick: (orderId: string) => void;
}

export const ProcessingOrderTable: FC<Props> = ({ orders, handleOrderUpdate, handleClick }) => {

    const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(null);
    const [trackingLink, setTrackingLink] = useState('');

    const getRowActions = (index: number) => {
        const order = orders[index];
        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <ConfirmButton
                    description='This order has alreay been accepted and paid for, are you sure you want to reject?'
                    title='Confirm Order Rejection'
                    onConfirm={() => handleOrderUpdate(order.id, { ...order, status: OrderStatus.Deleted })}
                >
                    Delete Order
                </ConfirmButton>
                <Button onClick={() => setSelectedOrderIndex(index)} variant='contained' color='secondary'>Mark As Shipped</Button>
                <Button onClick={() => handleClick(order.id)} variant='contained'>View</Button>
            </Stack>
        )
    }

    const handleAccept = async () => {
        if (selectedOrderIndex === null) return;
        const order = orders[selectedOrderIndex];

        await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Shipped, trackingLink })
        setSelectedOrderIndex(null);
    }

    return (
        <Stack>
            <Dialog open={selectedOrderIndex !== null} onClose={() => setSelectedOrderIndex(null)}>
                <DialogTitle>
                    Completed Order
                </DialogTitle>
                <DialogContent>
                    <Stack padding={2} spacing={2}>
                        <Typography>Enter a tracking link here if applicable</Typography>
                        <TextField value={trackingLink} onChange={e => setTrackingLink(e.target.value)} label='Tracking Link' />
                    </Stack>


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedOrderIndex(null)} variant='contained'>Close</Button>
                    <Button
                        onClick={() => handleAccept()}
                        variant='contained'
                    >Accept</Button>
                </DialogActions>
            </Dialog>
            <OrdersTable orders={orders} getRowActions={getRowActions} />
        </Stack >
    )
}
