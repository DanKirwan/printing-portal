import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { Material } from '@src/lib/types';
import { FC, useState } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (material: Material) => void;

}

export const NewMaterialDialog: FC<Props> = ({ isOpen, onClose, onAdd }) => {
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [pricePerKg, setPricePerKg] = useState(10);
    const [density, setDensity] = useState(1000);


    const handleAdd = () => {
        onAdd({ colors: [], name: newName, description: newDescription, pricePerKg, density });
        onClose();
    }
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                Add a new Material
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} padding={2}>
                    <TextField value={newName} onChange={e => setNewName(e.target.value)} label='Name' />
                    <TextField type='number' value={pricePerKg.toString()} onChange={e => setPricePerKg(+e.target.value)} label='Price Per Kg' />
                    <TextField type='number' value={density.toString()} onChange={e => setDensity(+e.target.value)} label='Density' />
                    <TextField value={newDescription} onChange={e => setNewDescription(e.target.value)} label='Description' multiline rows={4} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()} variant='contained'>Close</Button>
                <Button onClick={() => handleAdd()} variant='contained'>Add Material</Button>
            </DialogActions>
        </Dialog>
    )
}
