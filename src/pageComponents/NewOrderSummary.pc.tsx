import { Modal, Stack, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { OrderEditor } from '@src/components/OrderEditor';
import { ShippingInput } from '@src/components/upload/ShippingInput';
import { UploadDialog } from '@src/components/upload/UploadDialog';
import { getOrder, handleOrderUpload } from '@src/lib/uploadUtils';
import { FC, useState } from 'react';
import DetailedPartOrder from '../components/DetailedPartOrder';
import PartDetailsModal from '../components/parts/PartDetailsModal';
import { Order, PartOrder } from '../lib/types';

interface Props {
    files: File[]
}

const genDefaultOrder = (files: File[]): Order => {

    const order: Order = {
        email: "Test",
        desc: "Test Desc",
        lead: 2,
        ordered: new Date(),
        parts: files.map((file, i) => ({
            file,
            notes: "",
            quantity: 1,
            settings: {
                color: 'Any',
                infill: 0.4,
                resolution: 200
            }
        })),
        address: {
            firstName: '',
            lastName: '',
            city: '',
            countryCode: 'GB',
            line1: '',
            line2: '',
            postCode: '',
            county: ''
        },
        completed: false,
        processing: false,
        settings: {
            material: 'PLA',
        }
    };

    return order;
}
const NewOrderSummaryPC: FC<Props> = ({ files }) => {

    const [order, setOrder] = useState<Order>(genDefaultOrder(files));
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleUpload = async () => {
        setLoading(true);
        console.log(order);
        const orderId = await handleOrderUpload(order);
        console.log("Upload");
        const checkOrder = await getOrder(orderId);
        console.log(checkOrder);
        setLoading(false);
        setDialogOpen(false);
    }

    const fakeUpload = () => {
        setLoading(loading => !loading);
    }


    return (
        <Stack>
            <OrderEditor order={order} onChange={setOrder} />
            <LoadingButton loading={loading} onClick={() => setDialogOpen(true)} >Upload</LoadingButton>
            <UploadDialog
                uploading={loading}
                order={order}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={() => handleUpload()}
                onChange={setOrder} />
        </Stack >
    )
}

export default NewOrderSummaryPC;