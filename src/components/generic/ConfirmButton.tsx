import { IconButton, DialogActions, DialogTitle, DialogContent, Dialog, Button, ButtonProps } from '@mui/material';
import { FCC } from '@src/lib/utils';
import { FC, useState, ReactNode } from 'react';
import { LoadingButton } from './LoadingButton';

interface Props {
    onConfirm: () => void;
    title: string;
    description: string;
    loading?: boolean;
}

export const ConfirmButton: FCC<Props & Pick<ButtonProps, 'variant' | 'style' | 'disabled' | 'sx'>> = ({
    onConfirm, title, description, children, loading = false,
    ...buttonProps }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        onConfirm();
    };

    return (
        <>
            <LoadingButton loading={loading} onClick={() => setIsOpen(true)} {...buttonProps}>
                {children}
            </LoadingButton>

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
