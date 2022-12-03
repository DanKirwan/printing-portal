import { Modal, Stack, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { handleOrderUpload } from '@src/lib/uploadUtils';
import { FC, useState } from 'react';
import DetailedPartOrder from '../components/DetailedPartOrder';
import PartDetailsModal from '../components/PartDetailsModal';
import { Order, PartOrder } from '../lib/types';

interface Props {
    order: Order
}

const OrderSummaryPC: FC<Props> = ({ order }) => {
    const [openPart, setOpenPart] = useState<PartOrder>();
    const [loading, setLoading] = useState(false);
    const handleUpload = async () => {
        setLoading(true);
        await handleOrderUpload(order);
        console.log("Upload");
        setLoading(false);
    }
    return (
        <Stack>
            <DetailedPartOrder parts={order.parts} onClick={part => setOpenPart(part)} />
            <Button onClick={() => handleUpload()} variant='contained'>Upload</Button>
            {openPart && <Dialog
                open={!!openPart}
                onClose={() => setOpenPart(undefined)}
                fullWidth={true}
                maxWidth={'lg'}
            >
                <DialogTitle>Part Settings</DialogTitle>
                <DialogContent sx={{ height: '70vh' }}>

                    <PartDetailsModal part={openPart} />
                </DialogContent>

            </Dialog>}
        </Stack >
    )
}

export default OrderSummaryPC;