import { Button, Divider, Link, Stack, Typography } from '@mui/material';
import { OrderViewer } from '@src/components/OrderViewer';
import { PriceSummary } from '@src/components/generic/PriceSummary';
import { ShippingDateViewer } from '@src/components/generic/ShippingDateViewer';
import { OrderSummary } from '@src/components/orders/OrderSummary';
import { AddressViewer } from '@src/components/shipping/AddressViewer';
import { handleOrderDownload } from '@src/lib/downloadUtils';
import { getShippingDetails } from '@src/lib/orderUtils';
import { Order } from '@src/lib/types';
import { WithId } from '@src/lib/utils';
import { sum } from 'lodash';
import moment from 'moment';
import { FC } from 'react';

interface Props {
    order: WithId<Order>;
}

export const OrderViewerPC: FC<Props> = ({ order }) => {

    const downloadOrder = async () => {
        handleOrderDownload(order);
    }



    return (
        <Stack direction='row' spacing={4} paddingX={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <OrderViewer order={order} />
            </Stack >


            <Stack width='336px' spacing={2} padding={1}>
                <OrderSummary order={order} />
                <Divider />
                <Button onClick={() => downloadOrder()} variant='contained'>Download Files</Button>
            </Stack>
        </Stack >

    )
}
