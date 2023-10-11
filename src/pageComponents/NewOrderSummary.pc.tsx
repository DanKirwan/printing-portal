import { Divider, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from '@mui/material';
import { FileLoadButton } from '@src/components/FileLoadButton';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { OrderEditor } from '@src/components/OrderEditor';
import { PriceEstimation } from '@src/components/upload/PriceEstimation';
import { UploadDialog } from '@src/components/upload/UploadDialog';
import { useAuth } from '@src/contexts/AuthContext';
import { EventTypes } from '@src/lib/analytics';
import { handleOrderUpload } from '@src/lib/appUtils';
import { getDB } from '@src/lib/firebaseUtils';
import { useCollection } from '@src/lib/hooks';
import { genDefaultOrder, genDefaultParts, getOrderProblems, getShippingDetails } from '@src/lib/orderUtils';
import { getEnumValues, pluralise } from '@src/lib/utils';
import { analytics } from '@src/main';
import { logEvent } from 'firebase/analytics';
import _ from 'lodash';
import { uniqBy } from 'lodash';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, OrderSettings, ShippingType } from '../lib/types';
import { ShippingDateViewer } from '@src/components/generic/ShippingDateViewer';
import moment from 'moment';
interface Props {
    files: File[]
}

const minOrderPrice = 30;

const NewOrderSummaryPC: FC<Props> = ({ files }) => {

    const [order, setOrder] = useState<Order>(genDefaultOrder(files));
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
    const [estimatedLeadDays, setEstimatedLeadDays] = useState<number | null>(null);

    const { uid, email } = useAuth();
    const navigate = useNavigate();

    const [materials, loadingMaterials] = useCollection(getDB().materials);
    // Order with added email from auth if user is logged in
    const authOrder = email ? { ...order, email } : order;

    const handleUpload = async () => {
        setLoading(true);
        try {

            logEvent(analytics, EventTypes.CompleteOrder);
            const orderWithEstimates: Order = estimatedLeadDays == null ? authOrder : { ...authOrder, lead: estimatedLeadDays };

            const orderId = await handleOrderUpload(orderWithEstimates, uid);
            navigate(uid ? `/orders/${orderId}` : '/ordercomplete');
        } catch (e: any) {
            logEvent(analytics, EventTypes.OrderError, { error: e });
            alert("There was a problem uploading your order! Please contact support@henleyprint3d.com for suppport");
            console.log(e);
        }
        console.log("Uploaded");
        setLoading(false);
        setDialogOpen(false);



    }

    const handleEstimateCalculations = (price: number, leadDays: number) => {
        setEstimatedPrice(price);
        setEstimatedLeadDays(leadDays);
    }

    const handleChangeSettings = (newSettings: OrderSettings) => {
        const { settings, ...rest } = order;
        setOrder({ ...rest, settings: newSettings });
    }

    const handleAddFiles = (files: File[]) => {
        const { parts, ...rest } = order;
        const fileNames = files.map(file => file.name);
        const remainingParts = parts.filter(p => !fileNames.includes(p.file.name));
        const newParts = uniqBy(remainingParts.concat(genDefaultParts(files)), p => p.file.name);
        setOrder({ ...rest, parts: newParts });
    }

    const currentMaterial = materials.find(material => material.name == order.settings.material);
    const materialColors = currentMaterial?.colors ?? [];
    const availableColors = materialColors.filter(c => c.available).map(c => c.name);

    const orderProblems = currentMaterial ?
        getOrderProblems(authOrder, currentMaterial) :
        ["No material selected"];


    return (
        <Stack direction='row' spacing={4} padding={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <OrderEditor availableColors={availableColors} order={order} onChange={setOrder} />

            </Stack >


            <Stack width='336px' spacing={2} padding={1}>
                <FormControl variant='standard'>
                    <InputLabel>Pick Material</InputLabel>
                    <Select
                        value={order.settings.material}
                        onChange={e => handleChangeSettings({ material: e.target.value })}
                    >
                        {_.orderBy(materials, x => -(x.priority ?? 0))
                            .map((v, idx) => (
                                <MenuItem key={idx} value={v.name}>{v.name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>



                <FormControl variant='standard'>
                    <InputLabel>Shipping Options</InputLabel>
                    <Select
                        value={order.shippingType}
                        onChange={e => setOrder({ ...order, shippingType: e.target.value as ShippingType })}
                    >
                        {Object.values(ShippingType).map((v, idx) => {
                            const [text, price] = getShippingDetails(v);
                            return (
                                <MenuItem key={idx} value={v}>{text} - £{price}</MenuItem>
                            )
                        })
                        }
                    </Select>
                    <FormHelperText>
                        <Typography variant='subtitle2'>

                            Subject to change for order totalling over 2kg
                        </Typography>
                    </FormHelperText>
                </FormControl>
                <Divider />
                <Stack >
                    <PriceEstimation
                        order={authOrder}
                        materials={materials}
                        onCalculated={handleEstimateCalculations} />
                    {order.parts.length > 3 && estimatedPrice == null &&
                        <Typography variant='caption'>
                            (May take up to {pluralise(Math.floor(order.parts.length / 2), 'minute')})
                        </Typography>
                    }

                </Stack>
                <Divider />
                <Stack spacing={0.5} >

                    <FileLoadButton onFilesLoad={handleAddFiles} title='Add Files' variant='contained' extension='.stl' />
                    <LoadingButton
                        color='secondary'
                        sx={{ width: '100%' }}
                        loading={loading}
                        onClick={() => setDialogOpen(true)}
                        variant='contained'
                    >
                        Confirm Order
                    </LoadingButton>
                </Stack>
                <UploadDialog
                    orderProblems={orderProblems}
                    uploading={loading}
                    order={order}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSubmit={() => handleUpload()}
                    onChange={setOrder} />
            </Stack>
        </Stack >
    )
}

export default NewOrderSummaryPC;