import { Button, Typography, Stack } from '@mui/material';
import { useAuth } from '@src/contexts/AuthContext';
import { SignInWithSocialMedia, Providers, SignOut } from '@src/lib/firebaseUtils';
import { FC } from 'react';


const LoginTest: FC = () => {
    const { uid } = useAuth()
    const handleClick = () => {
        if (!uid) SignInWithSocialMedia(Providers.google);
        else SignOut();
    }
    return (
        <Stack>
            {uid && <Typography>{uid}</Typography>}
            <Button onClick={() => handleClick()} variant='contained'>{uid ? "Sign Out" : "Sign In"}</Button>

        </Stack>
    )
}

export default LoginTest;