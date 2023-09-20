import { Button, Divider, Link, Stack, Typography } from '@mui/material';
import { OrderViewer } from '@src/components/OrderViewer';
import { PriceSummary } from '@src/components/generic/PriceSummary';
import { AddressViewer } from '@src/components/shipping/AddressViewer';
import { handleOrderDownload } from '@src/lib/downloadUtils';
import { getShippingDetails } from '@src/lib/orderUtils';
import { Order } from '@src/lib/types';
import { WithId } from '@src/lib/utils';
import { sum } from 'lodash';
import { FC } from 'react';

interface Props {
    order: WithId<Order>;
}

export const OrderViewerPC: FC<Props> = ({ order }) => {
    const downloadOrder = async () => {
        handleOrderDownload(order);
    }

    const [, shippingPrice] = order.shippingType ? getShippingDetails(order.shippingType) : [null, null];
    const partCount = sum(order.parts.map(p => p.quantity));

    // TODO Convert to using order viewer
    return (
        <Stack direction='row' spacing={4} paddingX={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <OrderViewer order={order} />
            </Stack >


            <Stack width='20vw' minWidth='300px' spacing={2} padding={1}>
                <Typography variant='h6' fontWeight='bold'>Order Summary</Typography>
                <Divider />
                <Stack>
                    {order.price ?
                        <PriceSummary
                            components={[
                                [`Parts (${partCount} Part${partCount > 1 ? 's' : ''})`, order.price],
                                [`Shipping (${order.shippingType})`, shippingPrice ?? 0]
                            ]}
                        /> :
                        <Typography>No Price Assigned</Typography>
                    }
                </Stack>
                <Divider />
                <Stack>
                    {order.trackingLink && <Link href={order.trackingLink} >Track My Order</Link>}
                    <AddressViewer address={order.address} />
                </Stack>
                <Divider />
                <Button onClick={() => downloadOrder()} variant='contained'>Download Files</Button>
            </Stack>
        </Stack >

    )
}
