import { IconButton, DialogActions, DialogTitle, DialogContent, Dialog, Button } from '@mui/material';
import { FC, useState } from 'react';

interface Props {
    onConfirm: () => void;
    title: string;
    description: string;
    Icon: FC;
}

export const ConfirmIconButton: FC<Props> = ({ onConfirm, title, description, Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleConfirm = () => {
        setIsOpen(false);
        onConfirm();
    };

    return (
        <>
            <IconButton onClick={() => setIsOpen(true)}>
                <Icon />
            </IconButton>

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
