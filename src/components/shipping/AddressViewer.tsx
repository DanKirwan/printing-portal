import { Stack, Typography } from '@mui/material';
import { Address } from '@src/lib/types';
import { FC } from 'react';

interface Props {
    address: Address;
}

export const AddressViewer: FC<Props> = ({ address }) => {
    const { firstName, lastName, city, countryCode, county, line1, postCode, line2 } = address;
    return (
        <Stack>
            <Stack direction='row' spacing={1}>
                <Typography fontWeight='bold'>
                    {firstName}
                </Typography>
                <Typography fontWeight='bold'>
                    {lastName}
                </Typography>
            </Stack>
            <Typography>{line1}</Typography>
            <Typography>{line2}</Typography>
            <Typography>{city}</Typography>
            <Typography>{county}</Typography>
            <Typography textTransform='capitalize'>{postCode}</Typography>
        </Stack >
    )
}
