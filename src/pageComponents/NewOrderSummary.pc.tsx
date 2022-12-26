import { Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { FileLoadButton } from '@src/components/FileLoadButton';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { OrderEditor } from '@src/components/OrderEditor';
import { UploadDialog } from '@src/components/upload/UploadDialog';
import { useAuth } from '@src/contexts/AuthContext';
import { handleOrderUpload } from '@src/lib/uploadUtils';
import { Timestamp } from 'firebase/firestore';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, OrderSettings, OrderStatus, PartOrder } from '../lib/types';
import { uniqBy } from 'lodash';
import { useCollection } from '@src/lib/hooks';
import { getDB } from '@src/lib/firebaseUtils';
import { ShippingInput } from '@src/components/upload/ShippingInput';
interface Props {
    files: File[]
}

const genDefaultParts = (files: File[]): PartOrder[] => files.map((file, i) => ({
    file,
    notes: "",
    quantity: 1,
    settings: {
        color: 'Any',
        infill: 0.4,
        resolution: 200
    }
}));

const genDefaultOrder = (files: File[]): Order => {

    const order: Order = {
        userId: null,
        email: "",
        desc: "",
        lead: 2,
        ordered: Timestamp.fromDate(new Date()),
        parts: genDefaultParts(files),
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

    const [materials, loadingMaterials] = useCollection(getDB().materials);

    const handleUpload = async () => {
        setLoading(true);
        const authOrder = email ? { ...order, email } : order;
        try {

            const orderId = await handleOrderUpload(authOrder, uid);
            navigate(uid ? `/orders/${orderId}` : '/ordercomplete');
        } catch (e: any) {
            alert("Failed to upload model, the error has been logged");
            console.log(e);
        }
        console.log("Uploaded");
        setLoading(false);
        setDialogOpen(false);



    }

    const handleChangeSettings = (newSettings: OrderSettings) => {
        const { settings, ...rest } = order;
        setOrder({ ...rest, settings: newSettings });
    }

    const handleAddFiles = (files: File[]) => {
        const { parts, ...rest } = order;
        const newParts = uniqBy(parts.concat(genDefaultParts(files)), p => p.file.name);
        setOrder({ ...rest, parts: newParts });
    }

    const materialColors = materials.find(material => material.name == order.settings.material)?.colors ?? [];
    const availableColors = materialColors.filter(c => c.available).map(c => c.name);

    return (
        <Stack direction='row' spacing={4} padding={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <Typography variant='h4'>Parts</Typography>
                <OrderEditor availableColors={availableColors} order={order} onChange={setOrder} />
                <LoadingButton loading={loading} onClick={() => setDialogOpen(true)} >Upload</LoadingButton>
                <FileLoadButton onFilesLoad={handleAddFiles} title='Add Files' variant='contained' extension='.stl' />
                <UploadDialog
                    uploading={loading}
                    order={order}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSubmit={() => handleUpload()}
                    onChange={setOrder} />
            </Stack >


            <Stack width='20vw' minWidth='300px' spacing={2} padding={1}>
                <Typography variant='h4'>Order Details</Typography>
                <FormControl variant='standard'>
                    <InputLabel>Pick Material</InputLabel>
                    <Select
                        value={order.settings.material}
                        onChange={e => handleChangeSettings({ material: e.target.value })}
                    >
                        {materials.map((v, idx) => (
                            <MenuItem key={idx} value={v.name}>{v.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </Stack >
    )
}

export default NewOrderSummaryPC;