import { Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Order, PartOrder, PartSettings } from '@src/lib/types';
import { FC, useState } from 'react';
import DetailedPartOrderEditor from './DetailedPartOrderEditor';
import PartDetailsEditorModal from './parts/PartDetailsModal';

interface Props {
    order: Order;
    onChange: (order: Order) => void;
    availableColors: string[];
}

export const OrderEditor: FC<Props> = ({ order, onChange, availableColors }) => {
    const [openPartIndex, setOpenPartIndex] = useState<number | null>(null);

    const handlePartsChange = (newParts: PartOrder[]) => {
        const { parts, ...rest } = order;
        const newOrder: Order = { ...rest, parts: newParts };
        onChange(newOrder);
    }

    const handleDeletePart = (index: number) => {
        const { parts, ...rest } = order;
        const newOrder: Order = { ...rest, parts: parts.filter((_, i) => i != index) };
        onChange(newOrder);
    }

    const handleOpenPartChange = (newPart: PartOrder) => {

        if (openPartIndex === null) return;
        const newParts = [...order.parts];
        newParts[openPartIndex] = newPart;
        handlePartsChange(newParts);
    }

    const handleSetAllPartSettings = () => {
        if (openPartIndex === null) return;
        const { settings } = order.parts[openPartIndex];
        const newParts = order.parts.map(part => ({ ...part, settings }));
        handlePartsChange(newParts);
        setOpenPartIndex(null);
    }

    return (
        <Stack>
            <DetailedPartOrderEditor
                parts={order.parts}
                onChange={parts => handlePartsChange(parts)}
                onClick={part => setOpenPartIndex(part)}
                onDelete={i => handleDeletePart(i)} />

            {openPartIndex !== null && <Dialog
                open={openPartIndex !== null}
                onClose={() => setOpenPartIndex(null)}
                fullWidth={true}
                maxWidth={'lg'}
            >
                <DialogTitle>Part Settings</DialogTitle>
                <DialogContent sx={{ height: '70vh' }}>

                    <PartDetailsEditorModal availableColors={availableColors} editing={true} onChange={part => handleOpenPartChange(part)} part={order.parts[openPartIndex]} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => handleSetAllPartSettings()} variant='contained'>Apply To All Parts</Button>
                    <Button onClick={() => setOpenPartIndex(null)} variant='contained'>Ok</Button>
                </DialogActions>


            </Dialog>}
        </Stack >
    )
}
