import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Card, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import { useGridStatePersistence } from '@mui/x-data-grid/internals';
import logoUrl from '@src/assets/logo.png';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { PasswordField } from '@src/components/generic/PasswordField';
import { useAuth } from '@src/contexts/AuthContext';
import { getErrorDescription, signUp } from '@src/lib/firebaseUtils';
import { debounce } from 'lodash';
import { FC, useCallback, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


export const SignUpPC: FC = () => {

    const navigate = useNavigate();

    const { emailVerified, email: loggedInEmail, sendVerification } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const verifyPassword = (password: string) => {
        if (password.length < 6) return false;
        return !!password;
    }
    const handleSignUp = async () => {
        if (!verifyPassword(password) || !email) return;
        setLoading(true);

        try {
            const signupResult = await signUp(email, password);
            if (signupResult.user.emailVerified) {
                navigate('/')
                return;
            }
            sendVerification();
        } catch (e: any) {
            console.log(e, e.code);
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

    const handleSetRepeatPassword = (pass: string) => {
        setErrorMessage('');
        setRepeatPassword(pass);
    }


    const checkPassword = (password: string) => {
        if (verifyPassword(password)) return null;
        return 'Must be at least 6 characters';
    }
    const internalSendEmail = useCallback(() => {
        sendVerification();
    }, [sendVerification]);

    const debouncedSendEmail = useMemo(() => debounce(internalSendEmail, 30000, { leading: true }), [internalSendEmail]);


    return (
        <Container sx={{ height: '100%' }}>
            <Stack alignItems='center' justifyContent='center' height='100%'>
                <Card>
                    <Stack padding={2} spacing={3} alignItems='center'>

                        <Stack alignItems='center'>

                            <img src={logoUrl} width={100} alt='HP3D Logo' />
                            <Typography variant='caption'>Welcome to Henley Print 3D</Typography>
                        </Stack>
                        {loggedInEmail ? (
                            emailVerified ? <Navigate to='/' /> :
                                <>
                                    <Stack alignItems='center'>
                                        <Typography variant='h6' fontWeight='bold'>Email Verification</Typography>
                                        <Typography>You're almost there! We sent an email to</Typography>
                                        <Typography fontWeight='bold'>{loggedInEmail}.</Typography>
                                    </Stack>
                                    <Stack alignItems='center'>
                                        <Typography variant='caption'>Didn't recieve an email? No Problem</Typography>
                                        <Button onClick={() => debouncedSendEmail()} variant='contained'>Resend Verification Email</Button>
                                    </Stack>
                                </>
                        ) : (

                            <>
                                <Stack spacing={1} width='100%'>

                                    <TextField size='small' value={email} onChange={e => handleSetEmail(e.target.value)} label='Email' />

                                    <PasswordField
                                        password={password}
                                        label='Password'
                                        setPassword={handleSetPassword}
                                        verifyPassword={checkPassword}
                                    />

                                    <PasswordField
                                        password={repeatPassword}
                                        label='Confirm Password'
                                        setPassword={handleSetRepeatPassword}
                                        verifyPassword={pass => pass == password ? null : 'Passwords must match'}
                                    />
                                </Stack>




                                <Stack spacing={1}>
                                    <LoadingButton
                                        onClick={() => handleSignUp()}
                                        variant='contained'
                                        loading={loading}
                                        disabled={!verifyPassword(password) || !email || password != repeatPassword}
                                    >
                                        Sign Up
                                    </LoadingButton>
                                    <Typography variant='subtitle2' color='error'>{errorMessage}</Typography>
                                    <Stack direction='row' alignItems='center' spacing={1}>
                                        <Typography variant='caption'>Already have an account?</Typography>
                                        <Link href={'login'}>Login here</Link>
                                    </Stack>
                                </Stack>
                            </>
                        )}
                    </Stack>
                </Card>
            </Stack >

        </Container >
    )
}
