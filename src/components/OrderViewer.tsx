import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { Order } from '@src/lib/types';
import { FC, useState } from 'react';
import DetailedPartOrderViewer from './DetailedPartOrderViewer';
import PartDetailsEditorModal from './parts/PartDetailsModal';

interface Props {
    order: Order;
}

export const OrderViewer: FC<Props> = ({ order }) => {
    const [openPartIndex, setOpenPartIndex] = useState<number | null>(null);

    return (
        <Stack>
            <DetailedPartOrderViewer

                parts={order.parts}
                onClick={part => setOpenPartIndex(part)} />

            {openPartIndex !== null && <Dialog
                open={openPartIndex !== null}
                onClose={() => setOpenPartIndex(null)}
                fullWidth={true}
                maxWidth={'lg'}
            >
                <DialogTitle>Part Settings</DialogTitle>
                <DialogContent sx={{ height: '70vh' }}>

                    <PartDetailsEditorModal availableColors={[]} editing={false} onChange={part => null} part={order.parts[openPartIndex]} />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenPartIndex(null)} variant='contained'>Close</Button>
                </DialogActions>

            </Dialog>}
        </Stack >
    )
}
