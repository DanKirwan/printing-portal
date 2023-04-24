import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal, Stack, Typography } from '@mui/material';
import { useCookieConsentContext } from '@use-cookie-consent/react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CookieSettings } from './CookieSettings';


export const CookieConsentPopup: FC = () => {
    const { acceptCookies, consent, } = useCookieConsentContext();
    const [customisingCookies, setCustomisingCookies] = useState(false);
    return (
        <Dialog open={consent.statistics == null || !consent.necessary}>
            <DialogTitle align='center'>
                <Typography variant='h3'>We Use Cookies</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>

                    <Typography textAlign='center'>
                        We use cookies for authentication within our app when logging into your account.
                        This is essential for the operation of the website.
                        Our website uses Google Analytics (optional) to improve our services you can change your preferences at any time.
                    </Typography>
                    {customisingCookies &&
                        <CookieSettings />
                    }
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => setCustomisingCookies(true)} color='secondary'>Customise Cookies</Button>
                <Button onClick={() => acceptCookies({ necessary: true, statistics: true })} variant='contained'>Accept All</Button>
            </DialogActions>
        </Dialog>
    )
}
