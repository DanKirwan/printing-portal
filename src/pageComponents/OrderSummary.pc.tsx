import { Modal, Stack, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { FC, useState } from 'react';
import DetailedPartOrder from '../components/DetailedPartOrder';
import PartDetailsModal from '../components/PartDetailsModal';
import { Order, PartOrder } from '../lib/types';

interface Props {
    order: Order
}

const OrderSummaryPC: FC<Props> = ({ order }) => {
    const [openPart, setOpenPart] = useState<PartOrder>();
    return (
        <Stack>
            <DetailedPartOrder parts={order.parts} onClick={part => setOpenPart(part)} />
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