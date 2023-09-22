import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Slider, Stack, TextField, Typography } from '@mui/material';
import { FC } from 'react';
import { PartOrder } from '../../lib/types';
import { clamp } from 'lodash';

interface Props {
    part: PartOrder;
    onChange: (part: PartOrder) => void;
    validColors: string[];
}

const validResolutions = [100, 200, 300];

export const PartSettingsEditor: FC<Props> = ({ part, onChange, validColors }) => {
    const { settings, ...restOfPart } = part;
    const { color, infill, resolution } = settings;

    const setColor = (color: string) => {
        const partColor = color == 'Any' ? '' : color;
        const newSettings = { ...settings, color: partColor };
        onChange({ ...restOfPart, settings: newSettings });
    }

    const setInfill = (infillValue: number) => {
        const infill = clamp(infillValue, 0.1, 1);
        const newSettings = { ...settings, infill };
        onChange({ ...restOfPart, settings: newSettings })

    }

    const setResolution = (resolution: number) => {
        const newSettings = { ...settings, resolution };
        onChange({ ...restOfPart, settings: newSettings })
    }

    const invalidColor = !!color && !validColors.find(c => c == color);

    const displayColor = !color ? '' : color;
    return (
        <Stack spacing={1.5}>

            <FormControl variant='standard'>
                <InputLabel disableAnimation>Colour</InputLabel>
                <Select
                    error={invalidColor}

                    value={displayColor || 'Any'}
                    onChange={e => setColor(e.target.value as string)}
                >
                    {validColors.map((v, idx) => (
                        <MenuItem key={idx} value={v}>{v}</MenuItem>
                    ))}

                    <MenuItem value='Any'>Any</MenuItem>
                </Select>
                {invalidColor && <FormHelperText>select a valid colour for this material </FormHelperText>}

            </FormControl>

            <Stack >
                <Stack direction='row' padding={0}>
                    {/* Hardcoded font size as styling is challenging otherwise */}
                    <Typography variant='body1' fontSize={10.5}>Infill ({infill * 100}%)</Typography>
                </Stack>
                <Slider
                    size='small'
                    title='Infill'
                    value={infill * 100}
                    onChange={(_, value) => setInfill((value as number) / 100)}
                    min={0} max={100}
                    valueLabelDisplay='auto'
                    valueLabelFormat={value => `${value}%`}
                    step={10}
                />
            </Stack>

            <FormControl variant='standard'>
                <InputLabel>Resolution (μm)</InputLabel>
                <Select
                    value={resolution}
                    onChange={e => setResolution(e.target.value as number)}
                >
                    {validResolutions.map((v, idx) => (
                        <MenuItem key={idx} value={v}>{v}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack >
    )
}
