import { Container, IconButton, List, ListItem, Stack, Typography } from '@mui/material';
import { MaterialManager } from '@src/components/materials/MaterialManager';
import { getDB } from '@src/lib/firebaseUtils';
import { useCollectionWithIds } from '@src/lib/hooks';
import { addMaterial, deleteMaterial, setMaterial } from '@src/lib/materialUtils';
import { FC, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { NewMaterialDialog } from '@src/components/materials/NewMaterialDialog';
import { Material } from '@src/lib/types';

export const MaterialManagementPC: FC = () => {
    const [materials, loading] = useCollectionWithIds(getDB().materials);
    const [addingMaterial, setAddingMaterial] = useState(false);
    const handleMaterialChange = (material: Material, id: string) => {
        setMaterial(material, id);
    }

    const handleAddMaterial = (material: Material) => {
        addMaterial(material);
    }


    return (
        <Container>
            <Stack direction='row' width='100%' alignItems='center' justifyContent='space-between'>
                <Typography variant='h3'>Materials</Typography>
                <Stack>

                    <IconButton size='large' onClick={() => setAddingMaterial(true)}>
                        <AddIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <List>
                {materials.map((material, i) => (
                    <ListItem key={i}>
                        <MaterialManager
                            material={material}
                            onChange={newMat => handleMaterialChange(newMat, material.id)}
                            onDelete={() => deleteMaterial(material.id)} />

                    </ListItem>
                ))}
            </List>

            <NewMaterialDialog isOpen={addingMaterial} onClose={() => setAddingMaterial(false)} onAdd={handleAddMaterial} />
        </Container >
    )
}
