import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { Order } from '@src/lib/types';
import { FC } from 'react';
import Loading from '../Loading';
import { ShippingInput } from './ShippingInput';

interface Props {
    uploading: boolean;
    open: boolean;
    onClose: () => void;
    order: Order;
    onChange: (order: Order) => void;
    onSubmit: () => void;
}

export const UploadDialog: FC<Props> = ({ order, onChange, onSubmit, open, onClose, uploading }) => {
    const { desc, address, email } = order;
    if (uploading) return <Dialog open={open} >
        <DialogTitle>Uploading Order...</DialogTitle>
        <DialogContent>
            <Stack alignItems='center'>
                <Loading />
            </Stack>
        </DialogContent>
    </Dialog>
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Submit Order Request</DialogTitle>
            <DialogContent>
                <Stack spacing={3} padding={1}>
                    <TextField value={desc} onChange={e => onChange({ ...order, desc: e.target.value })} label='Order Notes' />
                    <TextField value={email} onChange={e => onChange({ ...order, email: e.target.value })} label='Email Address' />
                    <ShippingInput address={address} onChange={address => onChange({ ...order, address })} />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onSubmit()} variant='contained'>Submit Order Request</Button>
            </DialogActions>
        </Dialog>
    )
}
