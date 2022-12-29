import { Stack } from '@mui/material';
import { FCC } from '@src/lib/utils';
import { FC } from 'react';
import { Header } from './Header';


export const Layout: FCC = ({ children }) => {
    return (
        <Stack height='100vh' width='100vw'>
            <Header />
            <Stack overflow='auto' height='100%'>

                {children}
            </Stack>
        </Stack>
    )
}
