import { Button, Divider, Link, Stack, Typography } from '@mui/material';
import { FileLoadButton } from '@src/components/FileLoadButton';
import { OrderEditor } from '@src/components/OrderEditor';
import { ConfirmButton } from '@src/components/generic/ConfirmButton';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { OrderSummary } from '@src/components/orders/OrderSummary';
import { AddressViewer } from '@src/components/shipping/AddressViewer';
import { handleOrderDownload } from '@src/lib/downloadUtils';
import { getDB } from '@src/lib/firebaseUtils';
import { useCollection } from '@src/lib/hooks';
import { genDefaultParts, getShippingDetails } from '@src/lib/orderUtils';
import { DBPart, Order } from '@src/lib/types';
import { convertToDBPart, updateOrder } from '@src/lib/uploadUtils';
import { WithId } from '@src/lib/utils';
import { uniqBy } from 'lodash';
import { FC, useRef, useState } from 'react';

interface Props {
    initialOrder: WithId<Order>;
    saveChanges: (order: Order) => Promise<void>;
    saveMetadata: (order: Omit<Order, 'parts'>, partMetadata: DBPart[]) => Promise<void>;
}

export const AdminOrderEditorPC: FC<Props> = ({ initialOrder, saveChanges, saveMetadata }) => {

    const { id } = initialOrder;
    const [order, setOrder] = useState<Order>(initialOrder);
    const [saving, setSaving] = useState(false);
    const [filesChanged, setFilesChanged] = useState(false);
    // This tracks if there has been any change to the order
    const [anyChange, setAnyChange] = useState(false);

    const [materials, loadingMaterials] = useCollection(getDB().materials);
    const currentMaterial = materials.find(material => material.name == order.settings.material);
    const materialColors = currentMaterial?.colors ?? [];
    const availableColors = materialColors.filter(c => c.available).map(c => c.name);

    const handleUploadFiles = (files: File[]) => {
        if (!files) return;
        setFilesChanged(true);

        const { parts, ...rest } = order;
        const fileNames = files.map(file => file.name);
        const remainingParts = parts.filter(p => !fileNames.includes(p.file.name));
        const newParts = uniqBy(remainingParts.concat(genDefaultParts(files)), p => p.file.name);
        console.log(newParts, remainingParts);
        setOrder({ ...rest, parts: newParts });
    }

    const handleUpdate = (newOrder: Order) => {
        setAnyChange(true);
        // all you can do here is delete so we just need to check length the same
        if (order.parts.length !== newOrder.parts.length) {
            setFilesChanged(true);
        }
        setOrder(newOrder);
    }
    const handleSave = async () => {
        setSaving(true);
        try {
            if (filesChanged) {
                await saveChanges(order);
            } else {
                await saveMetadata(order, order.parts.map(convertToDBPart));
            }
        } finally {
            setSaving(false);
        }

        setFilesChanged(false);
    }
    // this will download the currently displayed order - not original

    const downloadOrder = () => {
        handleOrderDownload({ ...order, id });
    }

    const [, shippingPrice] = order.shippingType ? getShippingDetails(order.shippingType) : [null, null];

    return (
        <Stack direction='row' spacing={4} paddingX={4} height='100%' flexGrow={1}>

            <Stack width='80vw' spacing={2} padding={1}>
                <Typography variant='h4'>Parts</Typography>
                <OrderEditor
                    order={order}
                    onChange={handleUpdate}
                    availableColors={availableColors} />
            </Stack >


            <Stack width='336px' spacing={2} padding={1}>


                <OrderSummary order={order} />
                <Divider />
                <Button onClick={() => downloadOrder()} variant='contained'>Download Files</Button>
                <FileLoadButton onFilesLoad={handleUploadFiles} title='Add Files' variant='contained' extension='.stl' />
                {filesChanged ?
                    <>
                        <Stack alignItems='center' width='100%'>

                            <ConfirmButton
                                sx={{ width: '100%' }}
                                loading={saving}
                                variant='contained'
                                onConfirm={() => handleSave()}
                                description='Saving your changes may overwrite the old files in this order'
                                title='Confirm Order Update'
                                color='secondary'
                            >
                                Save Changes
                            </ConfirmButton>
                            <Typography variant='caption'>(Files changed)</Typography>
                        </Stack>

                    </> :
                    <LoadingButton
                        disabled={!anyChange}
                        loading={saving}
                        onClick={() => handleSave()}
                        variant='contained' color='secondary'
                    >
                        Save Changes
                    </LoadingButton>
                }

            </Stack>
        </Stack >

    )
}
