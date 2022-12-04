import { Button, CircularProgress, Stack } from '@mui/material';
import { FCC } from '@src/lib/utils';
import { FC } from 'react';

interface Props {

    loading: boolean;
    onClick: () => void;

}

export const LoadingButton: FCC<Props> = ({ loading, onClick, children }) => {
    return (
        <Button onClick={onClick} >
            <Stack alignItems='center' sx={{ display: 'grid' }}>
                <Stack sx={{ opacity: loading ? 0 : 1, gridRow: 1, gridColumn: 1 }}>

                    {children}
                </Stack>
                <CircularProgress sx={{ opacity: loading ? 1 : 0, gridRow: 1, gridColumn: 1 }} />

            </Stack>
        </Button>
    )
}
