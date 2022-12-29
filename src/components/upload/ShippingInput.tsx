import { Autocomplete, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Address } from '@src/lib/types';
import { FC } from 'react';
import { CountrySelect } from './CountrySelect';

interface Props {
    address: Address;
    onChange: (address: Address) => void;
}


export const ShippingInput: FC<Props> = ({ address, onChange }) => {
    const { city, countryCode, county, line1, line2, postCode, firstName, lastName } = address;
    return (
        <Stack spacing={2}>
            {/* Country select */}
            <Stack direction='row' spacing={2}>
                <TextField
                    value={firstName}
                    onChange={e => onChange({ ...address, firstName: e.target.value })}
                    label='First Name' />
                <TextField
                    value={lastName}
                    onChange={e => onChange({ ...address, lastName: e.target.value })}
                    label='Last Name' />
            </Stack>
            <TextField
                value={postCode}
                onChange={e => onChange({ ...address, postCode: e.target.value })}
                label='Post Code' />

            <TextField
                value={line1}
                onChange={e => onChange({ ...address, line1: e.target.value })}
                label='Address Line 1' />
            <TextField
                value={line2}
                onChange={e => onChange({ ...address, line2: e.target.value })}
                label='Address Line 2 (Optional)' />

            <TextField
                value={city}
                onChange={e => onChange({ ...address, city: e.target.value })}
                label='City' />

            <TextField
                value={county}
                onChange={e => onChange({ ...address, county: e.target.value })}
                label='County' />





            <CountrySelect countryCode={countryCode} onChange={countryCode => onChange({ ...address, countryCode })} />


        </Stack>
    )
}
