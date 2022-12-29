import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { useAuth } from '@src/contexts/AuthContext';
import { SignInWithSocialMedia, Providers } from '@src/lib/firebaseUtils';
import { Order } from '@src/lib/types';
import { FC, useState } from 'react';
import Loading from '../Loading';
import { ShippingInput } from './ShippingInput';

interface Props {
    uploading: boolean;
    open: boolean;
    onClose: () => void;
    order: Order;
    onChange: (order: Order) => void;
    onSubmit: () => void;
    orderProblems: string[];
}

export const UploadDialog: FC<Props> = ({ order, onChange, onSubmit, open, onClose, uploading, orderProblems }) => {
    const { desc, address, email } = order;

    const { email: userEmail } = useAuth();


    // Controls the dialog which handles anonymous submissions
    const [confirmAnonymousOpen, setConfirmAnonymousOpen] = useState(false);

    const handleSignin = async () => {
        await SignInWithSocialMedia(Providers.google);
        setConfirmAnonymousOpen(false);
    }

    const handleSubmit = () => {
        if (!userEmail) {
            setConfirmAnonymousOpen(true);
            return;
        }

        onSubmit();
        setConfirmAnonymousOpen(false);


    }

    if (uploading) return <Dialog open={open} >
        <DialogTitle>Uploading Order...</DialogTitle>
        <DialogContent>
            <Stack alignItems='center'>
                <Loading />
            </Stack>
        </DialogContent>
    </Dialog>
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth='lg'>
                <DialogTitle>Submit Order Request</DialogTitle>
                <DialogContent sx={{ maxHeight: '70vh' }}>
                    <Stack spacing={3} padding={1}>
                        <TextField value={desc} onChange={e => onChange({ ...order, desc: e.target.value })} label='Order Notes' />
                        {userEmail ?
                            <Typography>Logged in as: {userEmail}</Typography>
                            :
                            <TextField value={email} onChange={e => onChange({ ...order, email: e.target.value })} label='Email Address' />
                        }
                        <ShippingInput address={address} onChange={address => onChange({ ...order, address })} />

                        {orderProblems.length > 0 &&
                            <Accordion>
                                <AccordionSummary>Problems With Order</AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {orderProblems.map(problem => (
                                            <ListItem dense>
                                                <Typography variant='caption'>{problem}</Typography>

                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        }
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Tooltip
                        title={
                            orderProblems.length > 0 ?
                                'There are problems with your order! See Order Problems' :
                                ''
                        }
                    >
                        <span>
                            {/* required for tooltip to be visible */}
                            <Button

                                onClick={() => handleSubmit()}
                                variant='contained'
                                disabled={orderProblems.length > 0}
                            >
                                Submit Order Request
                            </Button>
                        </span>
                    </Tooltip>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmAnonymousOpen && !userEmail} onClose={() => setConfirmAnonymousOpen(false)}>
                <DialogTitle>Not Logged In</DialogTitle>
                <DialogContent>
                    You will not be able to view or edit your order with a guest submission.
                    You will still be contacted by email but won't be able to edit your order.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onSubmit()} variant='contained'>Confirm Guest Submission</Button>
                    <Button onClick={() => handleSignin()} variant='contained'>Sign In</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
