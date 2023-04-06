import { Stack, Toolbar, Typography, Link as MuiLink } from '@mui/material';
import { FCC } from '@src/lib/utils';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';


export const Layout: FCC = ({ children }) => {
    return (
        <Stack height='100vh' width='100vw'>
            <Header />
            <Stack overflow='auto' height='100%'>

                {children}
            </Stack>
            <Toolbar variant='dense'>

                <Stack direction='row' width='100%' justifyContent='center' spacing={5}>
                    <Link to='/privacy' >
                        <MuiLink variant='caption' color='#666'>Privacy</MuiLink>
                    </Link>
                    <Link to='/cookies'>
                        <MuiLink variant='caption' color='#666'>Cookies</MuiLink>

                    </Link>
                </Stack>
            </Toolbar>
        </Stack>
    )
}
