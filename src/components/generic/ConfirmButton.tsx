import { IconButton, DialogActions, DialogTitle, DialogContent, Dialog, Button } from '@mui/material';
import { FCC } from '@src/lib/utils';
import { FC, useState, ReactNode } from 'react';

interface Props {
    onConfirm: () => void;
    title: string;
    description: string;
}

export const ConfirmButton: FCC<Props> = ({ onConfirm, title, description, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        onConfirm();
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                {children}
            </Button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {description}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)} variant='contained' color='primary'>Close</Button>
                    <Button onClick={() => handleConfirm()} variant='contained' color='info'>Confim</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
