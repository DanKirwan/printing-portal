import { Modal, Stack, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { OrderEditor } from '@src/components/OrderEditor';
import { getOrder, handleOrderUpload } from '@src/lib/uploadUtils';
import { FC, useState } from 'react';
import DetailedPartOrder from '../components/DetailedPartOrder';
import PartDetailsModal from '../components/PartDetailsModal';
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
            notes: "Great file",
            quantity: i + 1,
            settings: {
                color: 'red',
                infill: 0.4,
                resolution: 200
            }
        })),
        address: {
            city: '',
            country: '',
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

    const handleUpload = async () => {
        setLoading(true);
        console.log(order);
        const orderId = await handleOrderUpload(order);
        console.log("Upload");
        const checkOrder = await getOrder(orderId);
        console.log(checkOrder);
        setLoading(false);
    }

    const fakeUpload = () => {
        setLoading(loading => !loading);
    }


    return (
        <Stack>
            <OrderEditor order={order} onChange={setOrder} />
            <LoadingButton loading={loading} onClick={() => fakeUpload()} >Upload</LoadingButton>

        </Stack >
    )
}

export default NewOrderSummaryPC;