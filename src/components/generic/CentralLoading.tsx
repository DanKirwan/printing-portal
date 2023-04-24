import { Stack } from '@mui/material';
import { FC } from 'react';
import Loading from '../Loading';


export const CentralLoading: FC = () => {
    return (
        <Stack width='100%' height='100%' justifyContent='center' alignItems='center'>
            <Loading />
        </Stack>
    )
}
