import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Card, Container, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import logoUrl from '@src/assets/logo.png';
import { LoadingButton } from '@src/components/generic/LoadingButton';
import { useAuth } from '@src/contexts/AuthContext';
import { getErrorDescription, signUp } from '@src/lib/firebaseUtils';
import { debounce } from 'lodash';
import { FC, useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';


export const SignUpPC: FC = () => {

    const { emailVerified, email: loggedInEmail, sendVerification } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [passHelperText, setPassHelperText] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const verifyPassword = (password: string) => {
        if (password.length < 6) return false;
        return !!password;
    }
    const handleSignUp = async () => {
        if (!verifyPassword(password) || !email) return;
        setLoading(true);

        try {

            const signupResult = await signUp(email, password);
            console.log(signupResult);

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


    const handleSetPass = (pass: string) => {
        setErrorMessage('');
        setPassword(pass);
        if (!passHelperText) return;
        handlePassBlur();
    }


    const handlePassBlur = () => {
        if (verifyPassword(password)) {
            setPassHelperText('');
            return;
        }
        setPassHelperText('Must be at least 6 characters');
    }

    const internalSendEmail = useCallback(() => {
        sendVerification();
    }, [sendVerification]);

    const debouncedSendEmail = useMemo(() => debounce(internalSendEmail, 30000, { leading: true }), [internalSendEmail]);


    return (
        <Container>
            <Stack alignItems='center' spacing={4}>
                <Stack alignItems='center'>

                    <img src={logoUrl} width={150} alt='HP3D Logo' />
                    <Typography variant='body1'> Welcome To Henley Print 3D</Typography>
                </Stack>


                <Card>
                    {loggedInEmail ? (
                        emailVerified ? <Navigate to='/' /> :
                            <Stack padding={4} spacing={4} alignItems='center'>
                                <Stack alignItems='center'>
                                    <Typography variant='h6' fontWeight='bold'>Email Verification</Typography>
                                    <Typography>You're almost there! We sent an email to</Typography>
                                    <Typography fontWeight='bold'>{loggedInEmail}.</Typography>
                                </Stack>
                                <Stack alignItems='center'>
                                    <Typography variant='caption'>Didn't recieve an email? No Problem</Typography>
                                    <Button onClick={() => debouncedSendEmail()} variant='contained'>Resend Verification Email</Button>
                                </Stack>

                            </Stack>

                    ) : (
                        <Stack padding={4} spacing={4}>

                            <Stack spacing={1}>

                                <TextField value={email} onChange={e => handleSetEmail(e.target.value)} label='Email' />

                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        value={password} onChange={e => handleSetPass(e.target.value)}
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
                                        onBlur={handlePassBlur}

                                        label="Password"
                                    />
                                    <FormHelperText error={true}>
                                        {passHelperText}
                                    </FormHelperText>
                                </FormControl>
                            </Stack>


                            <Stack spacing={1}>
                                <LoadingButton
                                    onClick={() => handleSignUp()}
                                    variant='contained'
                                    loading={loading}
                                    disabled={!verifyPassword(password) || !email}
                                >
                                    Sign Up
                                </LoadingButton>
                                <Typography variant='subtitle2' color='error'>{errorMessage}</Typography>
                                <Stack direction='row' alignItems='center'>
                                    <Typography variant='caption'>Already have an account?</Typography>
                                    <Link href={'login'}>Login here</Link>
                                </Stack>
                            </Stack>
                        </Stack>
                    )}
                </Card>
            </Stack >

        </Container >
    )
}
