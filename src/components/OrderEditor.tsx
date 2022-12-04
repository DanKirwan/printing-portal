import { Stack, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Order, PartOrder } from '@src/lib/types';
import { FC, useState } from 'react';
import DetailedPartOrder from './DetailedPartOrder';
import PartDetailsModal from './parts/PartDetailsModal';

interface Props {
    order: Order;
    onChange: (order: Order) => void;
}

export const OrderEditor: FC<Props> = ({ order, onChange }) => {
    const [openPartIndex, setOpenPartIndex] = useState<number | null>(null);

    const handlePartsChange = (newParts: PartOrder[]) => {
        const { parts, ...rest } = order;
        const newOrder: Order = { ...rest, parts: newParts };
        onChange(newOrder);
    }

    const handleOpenPartChange = (newPart: PartOrder) => {

        if (openPartIndex === null) return;
        const newParts = [...order.parts];
        newParts[openPartIndex] = newPart;
        console.log(newParts);
        handlePartsChange(newParts);
    }

    return (
        <Stack>
            <DetailedPartOrder onChange={parts => handlePartsChange(parts)} parts={order.parts} onClick={part => setOpenPartIndex(part)} />
            {openPartIndex !== null && <Dialog
                open={openPartIndex !== null}
                onClose={() => setOpenPartIndex(null)}
                fullWidth={true}
                maxWidth={'lg'}
            >
                <DialogTitle>Part Settings</DialogTitle>
                <DialogContent sx={{ height: '70vh' }}>

                    <PartDetailsModal editing={true} onChange={part => handleOpenPartChange(part)} part={order.parts[openPartIndex]} />
                </DialogContent>

            </Dialog>}
        </Stack >
    )
}
