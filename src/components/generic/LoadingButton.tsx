import { Button, ButtonProps, CircularProgress, Stack } from '@mui/material';
import { FCC } from '@src/lib/utils';
import { FC } from 'react';

interface Props {

    loading: boolean;
    onClick: () => void;

}

export const LoadingButton: FCC<Props & Pick<ButtonProps, 'variant' | 'style' | 'disabled' | 'sx' | 'color'>> = ({ loading, onClick, children, ...buttonProps }) => {
    return (
        <Button onClick={onClick} {...buttonProps} >
            <Stack alignItems='center' sx={{ display: 'grid' }}>
                <Stack sx={{ opacity: loading ? 0 : 1, gridRow: 1, gridColumn: 1 }}>

                    {children}
                </Stack>
                <Stack direction='row' sx={{ opacity: loading ? 1 : 0, gridRow: 1, gridColumn: 1 }} justifyContent='center'>
                    <CircularProgress color='info' />
                </Stack>

            </Stack>
        </Button>
    )
}
