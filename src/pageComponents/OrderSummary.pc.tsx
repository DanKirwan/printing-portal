import { Stack } from '@mui/material';
import { FC } from 'react';
import DetailedPartOrder from '../components/DetailedPartOrder';
import { Order, PartOrder } from '../lib/types';

interface Props {
    order: Order
}

const OrderSummaryPC: FC<Props> = ({ order }) => {

    return (
        <Stack>
            <DetailedPartOrder parts={order.parts} />
        </Stack>
    )
}

export default OrderSummaryPC;