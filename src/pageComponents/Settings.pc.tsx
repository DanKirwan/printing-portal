import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { PairListEditor } from '@src/components/generic/PairListEditor';
import { useSettings } from '@src/contexts/SettingsContext';
import { AppSettings } from '@src/lib/types';
import { isArray, orderBy } from 'lodash';
import { FC, useState } from 'react';


// cutoffAngle: number = 0.959931, //55Deg
// wallThickness: number = 1.2,
// samples: number = 40,
// supportInfill: number = 0.15, 
const defaults: AppSettings = {
    bulkPricingDiscounts: [{ key: 0, value: 0 }, { key: 40, value: 0.08 }, { key: 100, value: 0.15 }, { key: 200, value: 0.2 }, { key: 500, value: 0.27 }],
    quantityPricingDiscounts: [{ key: 0, value: 0 }, { key: 50, value: 0.07 }, { key: 150, value: 0.15 }, { key: 250, value: 0.25 }], //[[0, 0], [50, 0.07], [150, 0.15], [250, 0.25]],
    resolutionPriceMultiplier: [{ key: 100, value: 0.95 }, { key: 200, value: 1 }, { key: 300, value: 1.15 }],
    infillPriceMultiplier: [{ key: 0, value: 1 }, { key: 20, value: 1 }, { key: 40, value: 0.8 }, { key: 100, value: 0.6 }],
    modelSampleRate: 40,
    minimumPrice: 20,
    minLeadDays: 2,
    priceMultiplier: 10,
    supportAngle: 0.959931,// 55 degrees
    wallThickness: 1.2,
    supportDensity: 0.2,
    volumeLeadMultiplier: 2, // TODO
};

export const SettingsPC: FC = () => {
    const { settings, setSettings } = useSettings();

    const [internalSettings, setInternalSettings] = useState(settings);


    const deployDefaults = () => {


        if (!internalSettings) setSettings(defaults);

        setSettings({ ...defaults, ...internalSettings });
    }
    if (!internalSettings) return (
        <Container>
            <Typography variant='h3'>No Settings Deployed</Typography>
            <Button onClick={() => deployDefaults()} variant='contained'>Apply Default Settings</Button>
        </Container>
    );

    console.log(internalSettings);

    const keys: (keyof AppSettings)[] = Object.keys(defaults) as Array<keyof AppSettings>

    if (keys.some(key => internalSettings[key] == null)) return (
        <Container>
            <Typography variant='h3'>Some Settings are missing</Typography>
            <Button onClick={() => deployDefaults()} variant='contained'>Fill Default Settings</Button>
        </Container>
    )

    const {
        priceMultiplier, minimumPrice,
        supportAngle, supportDensity, wallThickness,
        volumeLeadMultiplier, minLeadDays,
        bulkPricingDiscounts,
        resolutionPriceMultiplier,
        infillPriceMultiplier,
        modelSampleRate,
        quantityPricingDiscounts } = internalSettings;
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

                    <TextField
                        type='number'
                        value={modelSampleRate}
                        onChange={e => setInternalSettings({ ...internalSettings, modelSampleRate: +e.target.value })}
                        label='Model Sampling Rate' />
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

                <Stack direction='row' width='100%' justifyContent='space-between'>

                    <Stack width='250px' >
                        <Typography variant='h6'>Bulk Pricing </Typography>
                        <PairListEditor
                            entries={bulkPricingDiscounts}
                            setEntries={entries => setInternalSettings({ ...internalSettings, bulkPricingDiscounts: orderBy(entries, e => e.key) })}
                            keyTitle='Price'
                            valueTitle='Discount'
                        />
                    </Stack>
                    <Stack width='250px' >
                        <Typography variant='h6'>Quantity Discounts </Typography>
                        <PairListEditor
                            entries={quantityPricingDiscounts}
                            setEntries={entries => setInternalSettings({ ...internalSettings, quantityPricingDiscounts: orderBy(entries, e => e.key) })}
                            keyTitle='Quantity'
                            valueTitle='Discount'
                        />
                    </Stack>
                    <Stack width='250px' >
                        <Typography variant='h6'>Resolution</Typography>
                        <PairListEditor
                            entries={resolutionPriceMultiplier}
                            setEntries={entries => setInternalSettings({ ...internalSettings, resolutionPriceMultiplier: orderBy(entries, e => e.key) })}
                            keyTitle='Layer'
                            valueTitle='Price Mult'
                        />
                    </Stack>
                    <Stack width='250px' >
                        <Typography variant='h6'>Infill Multipliers</Typography>
                        <PairListEditor
                            entries={infillPriceMultiplier}
                            setEntries={entries => setInternalSettings({ ...internalSettings, infillPriceMultiplier: orderBy(entries, e => e.key) })}
                            keyTitle='Layer'
                            valueTitle='Price Mult'
                        />
                    </Stack>
                </Stack>

                <Button onClick={() => handleSave()} variant='contained'>Save Changes</Button>
            </Stack>
        </Container >
    )
}
