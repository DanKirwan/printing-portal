import { Typography, Divider, Stack, Link } from '@mui/material';
import { Order } from '@src/lib/types';
import moment from 'moment';
import { FC } from 'react';
import { PriceSummary } from '../generic/PriceSummary';
import { ShippingDateViewer } from '../generic/ShippingDateViewer';
import { AddressViewer } from '../shipping/AddressViewer';
import { getShippingDetails } from '@src/lib/orderUtils';
import { sum } from 'lodash';

interface Props {
    order: Order;
}

export const OrderSummary: FC<Props> = ({ order }) => {
    const { ordered, lead, settings, expectedShipping } = order;
    const { material } = settings;
    const [, shippingPrice] = order.shippingType ? getShippingDetails(order.shippingType) : [null, null];
    const partCount = sum(order.parts.map(p => p.quantity));

    return (
        <Stack spacing={2}>
            <Typography variant='h6' fontWeight='bold'>Order Summary</Typography>

            <Typography ><span style={{ fontWeight: 'bold' }}>Material:</span> {material} </Typography>
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

            {
                expectedShipping &&
                <ShippingDateViewer
                    orderDate={moment(ordered.toDate())}
                    shippingDate={moment(expectedShipping.toDate())}

                />
            }
            <Typography variant='caption' textAlign='center' >Lead Time: {lead} Days Approx.</Typography>


            <Divider />
            <Stack>
                {order.trackingLink && <Link href={order.trackingLink} >Track My Order</Link>}
                <AddressViewer address={order.address} />
            </Stack>
        </Stack>

    )
}
