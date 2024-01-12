import { Button, Card, Container, Fab, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import logoUrl from '@src/assets/logo.png';
import GoogleIcon from '@mui/icons-material/Google';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { AppRoutes } from '@src/AppRoutes';
import { signInWithSocialMedia, Providers, loginWithEmailAndPassword } from '@src/lib/firebaseUtils';
export const LoginPC: FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        if (!email || !password) return;
        loginWithEmailAndPassword({ loginEmail: email, loginPassword: password });
    }

    const handleGoogleLogin = () => {
        signInWithSocialMedia(Providers.google);

    }
    return (
        <Container>
            <Stack alignItems='center' spacing={2}>

                <img src={logoUrl} width={150} alt='HP3D Logo' />


                <Fab variant='extended' onClick={handleGoogleLogin}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                        <GoogleIcon />
                        <span>
                            Login With Google
                        </span>
                    </Stack>
                </Fab>


                <Card>
                    <Stack padding={2} spacing={1}>
                        <TextField value={email} onChange={e => setEmail(e.target.value)} label='Email' />

                        <FormControl sx={{ m: 1, }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                value={password} onChange={e => setPassword(e.target.value)}
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>

                        <Button onClick={() => handleLogin()} variant='contained' disabled={!email || !password}>Login</Button>


                        <Stack direction='row'>
                            <Typography variant='caption'>New to Henley Print 3D?</Typography>
                            <Link href={'signup'}>Create an account</Link>
                        </Stack>
                    </Stack>
                </Card>
            </Stack>

        </Container>
    )
}
