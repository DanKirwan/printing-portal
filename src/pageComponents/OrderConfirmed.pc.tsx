import { Card, Stack, Typography } from '@mui/material';
import { EllipseLoadingText } from '@src/components/generic/EllipseLoadingText';
import { OrderViewer } from '@src/components/OrderViewer';
import { AddressViewer } from '@src/components/shipping/AddressViewer';
import { Order } from '@src/lib/types';
import { WithId } from '@src/lib/utils';
import { FC } from 'react';

interface Props {
    order: WithId<Order>;
}

export const OrderConfirmedPC: FC<Props> = ({ order }) => {
    const { address } = order;
    const { firstName } = address;
    return (
        <Stack margin={2} padding={2} spacing={1}>
            <Typography variant='h4'>Order Confirmed</Typography>
            <Typography variant='body2'>Thank you {firstName}!</Typography>
            <Stack direction='row' spacing={2} >
                <Stack spacing={2} >


                    <Card>
                        <Stack direction='row' width='100%' height='100px' alignItems='center' justifyContent='center'>
                            Loading Map
                            <EllipseLoadingText interval={500} />
                        </Stack>
                    </Card>

                    <Card>
                        <Stack width='100%' margin={2}>
                            <Typography variant='h5'>Order Updates</Typography>
                            <Typography>All updates can be viewed in the app's management page</Typography>
                        </Stack>
                    </Card>

                    <Card>
                        <Stack margin={2}>
                            <Typography variant='h5'>Customer Information</Typography>
                            <AddressViewer address={address} />
                        </Stack>
                    </Card>
                </Stack>
                <Stack>
                    <OrderViewer order={order} />
                </Stack>
            </Stack >
        </Stack>

    )
}
