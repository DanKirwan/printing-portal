import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { handleOrderGet } from '@src/lib/appUtils';
import { Order } from '@src/lib/types';
import { Timestamp } from 'firebase/firestore';
import moment, { Moment } from 'moment';
import { FC, Suspense, useState } from 'react';
import { suspend } from 'suspend-react';
import Loading from '../Loading';
import { AcceptOrderDialogContent } from './AcceptOrderDialogContent';

interface Props {
    orderId: string;
    onAccept: (order: Order) => void;
    open: boolean;
    onClose: () => void;
}

export const AcceptOrderDialog: FC<Props> = ({ orderId, onAccept, open, onClose }) => {

    const handleAccept = (order: Order) => {

        onClose();
        onAccept(order);
    }

    return (


        <LocalizationProvider dateAdapter={AdapterMoment}>

            <Dialog open={open} onClose={onClose}>
                <Suspense fallback={
                    <Stack>
                        <Loading />
                        <Typography>Loading Order Information</Typography>
                    </Stack>

                }>
                    <AcceptOrderDialogContent onAccept={handleAccept} orderId={orderId} onClose={onClose} />
                </Suspense >
            </Dialog>
        </LocalizationProvider >

    )
}
