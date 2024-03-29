import { AppBar, Toolbar, IconButton, Typography, Button, Avatar, Menu, MenuItem, Tooltip, Stack, Tab, Divider } from '@mui/material';
import { useAuth } from '@src/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { FC, useState, MouseEvent } from 'react';
import { signInWithSocialMedia, Providers, SignOut } from '@src/lib/firebaseUtils';
import { Link, useNavigate } from 'react-router-dom';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const menuItemStyles = {
    background: 'grey',
    color: 'white',

    ":hover": {
        background: '#706c6c'
    },
    p: 1.2,
    borderRadius: 1
}

export const Header: FC = () => {
    const { uid, photoURL, displayName, email } = useAuth();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleSignout = () => {
        SignOut();
        handleCloseUserMenu();
    }

    const handleSignIn = () => {
        navigate('/login')
    }

    return (
        <AppBar position="static" >
            <Toolbar >
                <Stack direction='row' justifyContent='space-between' width='100%'>

                    <Stack direction='row' >

                        <img src='/favicon.png' height='80px' style={{ marginTop: '10px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => navigate('/')} />

                        <Stack sx={{ padding: 2, cursor: 'pointer' }} >

                            <Typography variant="h6" fontWeight={600} letterSpacing={6} onClick={() => navigate('/')}  >
                                HENLEYPRINT3D
                            </Typography>
                            <Typography letterSpacing={6} fontWeight={100} color='white' onClick={() => navigate('/')} >
                                CMC Technologies
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack alignItems='center' justifyContent='center' direction='row' sx={{ flexGrow: 0 }} spacing={2}>
                        {uid && <MenuItem onClick={() => navigate('/orders')} sx={menuItemStyles} >
                            MANAGE
                        </MenuItem>}
                        <MenuItem onClick={() => navigate('/')} sx={menuItemStyles}>
                            ORDER
                        </MenuItem>
                        {uid && email
                            ?
                            <Stack sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} >
                                        <Avatar alt={displayName ?? ''} src={photoURL ?? ''} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >

                                    <MenuItem disabled={true}>
                                        <Stack>

                                            <Typography>{displayName}</Typography>
                                            <Typography variant='body2'>({email})</Typography>
                                        </Stack>
                                    </MenuItem>
                                    <MenuItem onClick={() => navigate('/cookies')}>
                                        Privacy Settings
                                    </MenuItem>
                                    <MenuItem onClick={handleSignout}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>

                                </Menu>
                            </Stack>
                            :
                            <Stack direction='row' spacing={2}>

                                <Button variant='outlined' color="inherit" onClick={handleSignIn}>Login</Button>
                            </Stack>

                        }
                    </Stack>

                </Stack>
            </Toolbar>
        </AppBar>
    )
}
