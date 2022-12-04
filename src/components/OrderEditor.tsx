import { Stack, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Order, PartOrder } from '@src/lib/types';
import { FC, useState } from 'react';
import DetailedPartOrder from './DetailedPartOrder';
import PartDetailsModal from './PartDetailsModal';

interface Props {
    order: Order;
    onChange: (order: Order) => void;
}

export const OrderEditor: FC<Props> = ({ order, onChange }) => {
    const [openPart, setOpenPart] = useState<PartOrder>();

    const handlePartsChange = (newParts: PartOrder[]) => {
        const { parts, ...rest } = order;
        const newOrder: Order = { ...rest, parts: newParts };
        onChange(newOrder);
    }

    return (
        <Stack>
            <DetailedPartOrder onChange={parts => handlePartsChange(parts)} parts={order.parts} onClick={part => setOpenPart(part)} />
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
