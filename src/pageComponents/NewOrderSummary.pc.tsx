import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { FileLoadButton } from '@src/components/FileLoadButton';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { OrderEditor } from '@src/components/OrderEditor';
import { UploadDialog } from '@src/components/upload/UploadDialog';
import { useAuth } from '@src/contexts/AuthContext';
import { handleOrderUpload } from '@src/lib/appUtils';
import { getDB } from '@src/lib/firebaseUtils';
import { useCollection } from '@src/lib/hooks';
import { genDefaultOrder, genDefaultParts, getOrderProblems } from '@src/lib/orderUtils';
import { uniqBy } from 'lodash';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, OrderSettings } from '../lib/types';
interface Props {
    files: File[]
}


const NewOrderSummaryPC: FC<Props> = ({ files }) => {

    const [order, setOrder] = useState<Order>(genDefaultOrder(files));
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { uid, email } = useAuth();
    const navigate = useNavigate();

    const [materials, loadingMaterials] = useCollection(getDB().materials);
    // Order with added email from auth if user is logged in
    const authOrder = email ? { ...order, email } : order;

    const handleUpload = async () => {
        setLoading(true);
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

    const currentMaterial = materials.find(material => material.name == order.settings.material);
    const materialColors = currentMaterial?.colors ?? [];
    const availableColors = materialColors.filter(c => c.available).map(c => c.name);

    const orderProblems = currentMaterial ?
        getOrderProblems(authOrder, currentMaterial) :
        ["No material selected"]

    return (
        <Stack direction='row' spacing={4} padding={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <Typography variant='h4'>Parts</Typography>
                <OrderEditor availableColors={availableColors} order={order} onChange={setOrder} />
                <LoadingButton loading={loading} onClick={() => setDialogOpen(true)} >Upload</LoadingButton>
                <FileLoadButton onFilesLoad={handleAddFiles} title='Add Files' variant='contained' extension='.stl' />
                <UploadDialog
                    orderProblems={orderProblems}
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