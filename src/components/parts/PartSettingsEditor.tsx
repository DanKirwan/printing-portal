import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { FC } from 'react';
import { PartOrder } from '../../lib/types';

interface Props {
    part: PartOrder;
    onChange: (part: PartOrder) => void;
    validColors: string[];
}

const validResolutions = [100, 200, 300];

export const PartSettingsEditor: FC<Props> = ({ part, onChange, validColors }) => {
    const { settings, ...restOfPart } = part;
    const { color, infill, resolution } = settings;
    console.log(color);

    const setColor = (color: string) => {
        const newSettings = { ...settings, color };
        onChange({ ...restOfPart, settings: newSettings });
    }

    const setInfill = (infilValue: string) => {
        const infill = infilValue == '' ? 0 : Number.parseInt(infilValue);
        if (Number.isNaN(infill) || infill < 0 || infill > 100) return;
        const newSettings = { ...settings, infill: infill / 100 };
        onChange({ ...restOfPart, settings: newSettings })

    }

    const setResolution = (resolution: number) => {
        const newSettings = { ...settings, resolution };
        onChange({ ...restOfPart, settings: newSettings })
    }
    return (
        <Stack spacing={1.5}>

            <FormControl variant='standard'>
                <InputLabel>Colour</InputLabel>
                <Select
                    value={color}
                    onChange={e => setColor(e.target.value as string)}
                >
                    {validColors.map((v, idx) => (
                        <MenuItem key={idx} value={v}>{v}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField variant='standard' value={Math.trunc(infill * 100)} onChange={e => setInfill(e.target.value)} label='Infill %' />

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
        </Stack>
    )
}
