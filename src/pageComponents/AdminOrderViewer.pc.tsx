import { Button, Stack, Typography } from '@mui/material';
import { OrderEditor } from '@src/components/OrderEditor';
import { AddressViewer } from '@src/components/shipping/AddressViewer';
import { useAuth } from '@src/contexts/AuthContext';
import { Order } from '@src/lib/types';
import { WithId } from '@src/lib/utils';
import saveAs from 'file-saver';
import JSZip from 'jszip';
import { FC } from 'react';

interface Props {
    order: WithId<Order>;
}

export const AdminOrderViewerPC: FC<Props> = ({ order }) => {
    const handleOrderDownload = async () => {
        const files = order.parts.map(p => p.file);
        const zipper = new JSZip();
        for (let file of files) {
            zipper.file(file.name, file);
        }
        const zip = await zipper.generateAsync({ type: 'blob' });
        saveAs(zip, `order - ${order.email} - (${order.id}).zip`);
    }
    // TODO Convert to using order viewer
    return (
        <Stack direction='row' spacing={4} padding={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <Typography variant='h4'>Parts</Typography>
                <OrderEditor availableColors={[]} order={order} onChange={() => null} />
            </Stack >


            <Stack width='20vw' minWidth='300px' spacing={2} padding={1}>
                <Typography variant='h4'>Order Details</Typography>
                <Button onClick={() => handleOrderDownload()} variant='contained'>Download Files</Button>
                <Typography>Price: {order.price ?? 'No Price Assigned'}</Typography>
                <Stack>

                    <Typography variant='h6'>Shipping </Typography>
                    <AddressViewer address={order.address} />
                </Stack>
            </Stack>
        </Stack >

    )
}
