import { Button, Card, Container, Divider, Fab, FormControl, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';
import logoUrl from '@src/assets/logo.png';
import GoogleIcon from '@mui/icons-material/Google';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { AppRoutes } from '@src/AppRoutes';
import { signInWithSocialMedia, Providers, loginWithEmailAndPassword, getErrorDescription } from '@src/lib/firebaseUtils';
import { PasswordField } from '@src/components/generic/PasswordField';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@src/components/generic/LoadingButton';
export const LoginPC: FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const handleLogin = async () => {

        if (!email || !password) return;
        setLoading(true);

        try {
            const signupResult = await loginWithEmailAndPassword({ loginEmail: email, loginPassword: password });
            navigate(signupResult.user.emailVerified ? '/' : '/signup');

        } catch (e: any) {
            console.log(e, e.code);
            const msg = getErrorDescription(e.code ?? '');
            setErrorMessage(`We encoutered an error: ${msg}`);
        } finally {
            setLoading(false);
        }

    }


    const handleGoogleLogin = async () => {
        try {

            await signInWithSocialMedia(Providers.google);
            navigate('/');

        } catch (e: any) {
            const msg = getErrorDescription(e.code ?? '');
            setErrorMessage(`We encoutered an error: ${msg}`);
        } finally {
            setLoading(false);
        }


    }


    const handleSetEmail = (email: string) => {
        setErrorMessage('');
        setEmail(email);
    }


    const handleSetPassword = (pass: string) => {
        setErrorMessage('');
        setPassword(pass);
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

                <Divider orientation='horizontal' sx={{ marginY: 10 }} />

                <Card>
                    <Stack padding={2} spacing={1}>
                        <Stack spacing={1} width='100%'>

                            <TextField size='small' value={email} onChange={e => handleSetEmail(e.target.value)} label='Email' />

                            <PasswordField
                                password={password}
                                label='Password'
                                setPassword={handleSetPassword}
                                verifyPassword={() => ''}
                            />
                        </Stack>




                        <Stack spacing={1}>
                            <LoadingButton
                                onClick={() => handleLogin()}
                                variant='contained'
                                loading={loading}
                                disabled={!email || !password}
                            >
                                Login
                            </LoadingButton>
                            <Typography variant='subtitle2' color='error'>{errorMessage}</Typography>
                            <Stack direction='row' alignItems='center' spacing={1}>
                                <Typography variant='caption'>New to Henley Print 3D?</Typography>
                                <Link href={'signup'}>Create Account Here</Link>
                            </Stack>
                        </Stack>

                    </Stack>
                </Card>
            </Stack>

        </Container>
    )
}
