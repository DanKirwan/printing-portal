import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, IconButton, InputAdornment, List, ListItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { Color, Material } from '@src/lib/materialUtils';
import { FC, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TooltipIconButton } from '../generic/ToolTipIconButton';
import { ConfirmIconButton } from '../generic/ConfirmIconButton';

interface Props {
    material: Material;
    onDelete: () => void;
    onChange: (material: Material) => void;
}

export const MaterialManager: FC<Props> = ({ material, onDelete, onChange }) => {
    const [newColor, setNewColor] = useState('');
    const handleColorSwitch = (index: number, available: boolean) => {
        const { colors, ...rest } = material;
        const newColors = [...colors];
        newColors[index] = { ...colors[index], available };
        onChange({ ...rest, colors: newColors });
    }

    const handleDeleteColor = (index: number) => {
        const { colors, ...rest } = material;
        const newColors = [...colors];
        newColors.splice(index, 1);
        onChange({ ...rest, colors: newColors });

    }

    const handleAddColor = (name: string) => {
        const { colors, ...rest } = material;
        const newColors: Color[] = [...colors, { available: true, name }];
        setNewColor('');
        onChange({ ...rest, colors: newColors });


    }
    return (
        <Accordion sx={{ width: '100%' }}>
            <AccordionSummary>
                <Stack direction='row' justifyContent='space-between' width='100%' alignItems='center'>
                    <Typography variant='h4'>
                        {material.name}
                    </Typography>
                    <ConfirmIconButton Icon={DeleteIcon} description='Delete Material - this cannot be undone' onConfirm={onDelete} title={'Delete Material'} />
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Stack>

                    <Typography >Description: {material.description}</Typography>
                    <List>
                        {material.colors.map((color, i) => (
                            <ListItem secondaryAction={
                                <Stack direction='row'>
                                    <IconButton onClick={() => handleDeleteColor(i)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <FormControlLabel
                                        control={<Switch checked={color.available} onChange={e => handleColorSwitch(i, e.target.checked)} />}
                                        label='Available'
                                    />
                                </Stack>
                            }>
                                {color.name}


                            </ListItem>
                        ))}
                        <TextField value={newColor} onChange={e => setNewColor(e.target.value)} label='New Colour'
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <TooltipIconButton
                                            Icon={AddIcon}
                                            onClick={() => handleAddColor(newColor)}
                                            title='Add new colour'
                                            disabled={newColor == ''}
                                        />
                                    </InputAdornment>
                                ),
                            }} />
                    </List>
                </Stack>
            </AccordionDetails>
        </Accordion >
    )
}
