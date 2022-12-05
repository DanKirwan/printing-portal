import { Modal, Stack, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { OrderEditor } from '@src/components/OrderEditor';
import { ShippingInput } from '@src/components/upload/ShippingInput';
import { UploadDialog } from '@src/components/upload/UploadDialog';
import { getOrder, handleOrderUpload } from '@src/lib/uploadUtils';
import { FC, useState } from 'react';
import DetailedPartOrder from '../components/DetailedPartOrder';
import PartDetailsModal from '../components/parts/PartDetailsModal';
import { Order, OrderStatus, PartOrder } from '../lib/types';
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '@src/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
interface Props {
    files: File[]
}

const genDefaultOrder = (files: File[]): Order => {

    const order: Order = {
        email: "",
        desc: "",
        lead: 2,
        ordered: Timestamp.fromDate(new Date()),
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
        status: OrderStatus.Incoming,
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

    const { uid, email } = useAuth();
    const navigate = useNavigate();

    const handleUpload = async () => {
        setLoading(true);
        const authOrder = email ? { ...order, email } : order;
        try {

            const orderId = await handleOrderUpload(authOrder, uid);
            navigate(uid ? `/${orderId}` : '/ordercomplete');
        } catch (e: any) {
            alert("Failed to upload model, the error has been logged");
            console.log(e);
        }
        console.log("Uploaded");
        setLoading(false);
        setDialogOpen(false);



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