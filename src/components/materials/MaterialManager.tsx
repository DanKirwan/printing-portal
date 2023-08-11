import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, IconButton, InputAdornment, List, ListItem, Stack, Switch, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { TooltipIconButton } from '../generic/ToolTipIconButton';
import { ConfirmIconButton } from '../generic/ConfirmIconButton';
import { Color, Material } from '@src/lib/types';

interface Props {
    material: Material;
    onDelete: () => void;
    onChange: (material: Material) => void;
}


const METER_CUBED_TO_1000CM_CUBED = 1000;

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

    const handleSetDaysPerMeterCubed = (days: number) => {
        const { daysPerCubicMeter, ...rest } = material;
        onChange({ daysPerCubicMeter: days, ...rest })
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
                    <TextField type='number' value={material.density.toString()} onChange={e => onChange({ ...material, density: +e.target.value })} label='Density' />
                    <TextField type='number' value={material.pricePerKg.toString()} onChange={e => onChange({ ...material, pricePerKg: +e.target.value })} label='Price Per Kilogram' />
                    <TextField type='number' value={material.priority?.toString() ?? 0} onChange={e => onChange({ ...material, priority: +e.target.value })} label='Viewing Priority' />
                    <TextField
                        type='number'
                        value={+(material.daysPerCubicMeter ?? 0) / METER_CUBED_TO_1000CM_CUBED}
                        onChange={e => onChange({ ...material, daysPerCubicMeter: +e.target.value * METER_CUBED_TO_1000CM_CUBED })}
                        label={<>Days Per 1000cm<sup>3</sup></>}
                    />

                    <Typography >Description: {material.description}</Typography>
                    <List>
                        {material.colors.map((color, i) => (
                            <ListItem
                                key={i}
                                secondaryAction={
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
