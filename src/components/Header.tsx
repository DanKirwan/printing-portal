import { AppBar, Toolbar, IconButton, Typography, Button, Box, Avatar, Menu, MenuItem, Tooltip, Stack } from '@mui/material';
import { useAuth } from '@src/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { FC, useState, MouseEvent } from 'react';
import { SignInWithSocialMedia, Providers, SignOut } from '@src/lib/firebaseUtils';


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const Header: FC = () => {
    const { uid, photoURL, displayName, email } = useAuth();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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
        SignInWithSocialMedia(Providers.google);
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <img src='/favicon.png' height='40px' />

                <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: 2 }}>
                    Henley Print 3D
                </Typography>
                {uid && photoURL && displayName && email
                    ?
                    <Stack sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={displayName} src={photoURL} />
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
                            <MenuItem onClick={handleSignout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>

                        </Menu>
                    </Stack>
                    :
                    <Button color="inherit" onClick={handleSignIn}>Login</Button>

                }
            </Toolbar>
        </AppBar>
    )
}
