import { Button, Link, Stack, Typography } from '@mui/material';
import { OrderViewer } from '@src/components/OrderViewer';
import { AddressViewer } from '@src/components/shipping/AddressViewer';
import { handleOrderDownload } from '@src/lib/downloadUtils';
import { getShippingDetails } from '@src/lib/orderUtils';
import { Order } from '@src/lib/types';
import { WithId } from '@src/lib/utils';
import { FC } from 'react';

interface Props {
    order: WithId<Order>;
}

export const OrderViewerPC: FC<Props> = ({ order }) => {
    const downloadOrder = async () => {
        handleOrderDownload(order);
    }

    const [, shippingPrice] = order.shippingType ? getShippingDetails(order.shippingType) : [null, null];

    // TODO Convert to using order viewer
    return (
        <Stack direction='row' spacing={4} paddingX={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <Typography variant='h4'>Parts</Typography>
                <OrderViewer order={order} />
            </Stack >


            <Stack width='20vw' minWidth='300px' spacing={2} padding={1}>
                <Typography variant='h4'>Order Details</Typography>
                <Button onClick={() => downloadOrder()} variant='contained'>Download Files</Button>
                <Stack>
                    <Typography variant='h6'>Pricing</Typography>
                    <Typography>Price: {order.price ? `£${order.price}` : 'No Price Assigned'}</Typography>
                    {shippingPrice && <Typography>Shipping Price: £{shippingPrice}</Typography>}
                    {order.price && shippingPrice && <Typography>Total Price: £{order.price + shippingPrice} </Typography>}
                </Stack>
                <Stack>

                    <Typography variant='h6'>Shipping</Typography>
                    {order.trackingLink && <Link href={order.trackingLink} >Track My Order</Link>}
                    <Typography>Shipping Type: {order.shippingType}</Typography>
                    <AddressViewer address={order.address} />
                </Stack>
            </Stack>
        </Stack >

    )
}
