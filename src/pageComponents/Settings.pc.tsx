import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useSettings } from '@src/contexts/SettingsContext';
import { FC, useState } from 'react';


// cutoffAngle: number = 0.959931, //55Deg
// wallThickness: number = 1.2,
// samples: number = 40,
// supportInfill: number = 0.15, 


export const SettingsPC: FC = () => {
    const { settings, setSettings } = useSettings();

    const [internalSettings, setInternalSettings] = useState(settings);


    const deployDefaults = () => {
        setSettings({
            minimumPrice: 20,
            minLeadDays: 2,
            priceMultiplier: 10,
            supportAngle: 0.959931,// 55 degrees
            wallThickness: 1.2,
            supportDensity: 0.2,
            volumeLeadMultiplier: 2, // TODO
        })
    }
    if (!internalSettings) return (
        <Container>
            <Typography variant='h3'>No Settings Deployed</Typography>
            <Button onClick={() => deployDefaults()} variant='contained'>Apply Default Settings</Button>
        </Container>
    );


    const {
        priceMultiplier, minimumPrice,
        supportAngle, supportDensity, wallThickness,
        volumeLeadMultiplier, minLeadDays, } = internalSettings;
    const handleSave = () => {
        setSettings(internalSettings);
    }

    return (
        <Container>
            <Stack spacing={4}>

                <Stack spacing={1}>

                    <Typography variant='h6'>General</Typography>
                    <TextField
                        type='number'
                        value={priceMultiplier.toFixed(2)}
                        onChange={e => setInternalSettings({ ...internalSettings, priceMultiplier: +e.target.value })}
                        label='Price Multiplier' />

                    <TextField
                        type='number'
                        value={minimumPrice.toFixed(2)}
                        onChange={e => setInternalSettings({ ...internalSettings, minimumPrice: +e.target.value })}
                        label='Minumum Price' />
                </Stack>
                <Stack spacing={1}>


                    <Typography variant='h6'>Cost Calculation</Typography>
                    <TextField
                        type='number'
                        value={supportAngle.toString()}
                        onChange={e => setInternalSettings({ ...internalSettings, supportAngle: +e.target.value })}
                        label='Support Angle (In Radians)' />

                    <TextField
                        type='number'
                        value={supportDensity.toString()}
                        onChange={e => setInternalSettings({ ...internalSettings, supportDensity: +e.target.value })}
                        label='Support Density (0-1)' />


                    <TextField
                        type='number'
                        value={wallThickness.toString()}
                        onChange={e => setInternalSettings({ ...internalSettings, wallThickness: +e.target.value })}
                        label='Wall Thickness (mm)' />


                </Stack>

                <Stack spacing={2}>
                    <Typography variant='h6'>Lead Time Calculation</Typography>


                    <TextField
                        type='number'
                        value={volumeLeadMultiplier.toString()}
                        onChange={e => setInternalSettings({ ...internalSettings, volumeLeadMultiplier: +e.target.value })}
                        label='Volume to Lead Time Multiplier (Days)' />


                    <TextField
                        type='number'
                        value={minLeadDays.toString()}
                        onChange={e => setInternalSettings({ ...internalSettings, minLeadDays: +e.target.value })}
                        label='Minumum Lead Days' />
                </Stack>
                <Button onClick={() => handleSave()} variant='contained'>Save Changes</Button>
            </Stack>
        </Container>
    )
}
