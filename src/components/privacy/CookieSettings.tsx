import { Button, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useCookieConsentContext } from '@use-cookie-consent/react';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const CookieSettings: FC = () => {
    const { consent, acceptCookies } = useCookieConsentContext();
    const [allowNecessary, setAllowNecessary] = useState(consent.necessary ?? false)
    const [allowAnalytics, setAllowAnalytics] = useState(consent.statistics ?? false);
    const navigate = useNavigate();

    const handleSaveChanges = () => {
        acceptCookies({ necessary: allowNecessary, statistics: allowAnalytics });
        navigate('/');
    }
    return (
        <Stack spacing={2}>


            <Typography variant='h3' textAlign='center'>Cookie Settings</Typography>
            <Stack>

                <FormControlLabel
                    control={<Switch
                        checked={allowNecessary}
                        onChange={e => setAllowNecessary(e.target.checked)}
                    />}
                    label='Necessary'
                />
                {
                    !allowNecessary &&
                    <Typography variant='caption' color='red'>
                        Warning: Website is unusable without necessary cookies
                    </Typography>
                }
            </Stack>
            <Stack>

                <FormControlLabel
                    control={<Switch checked={allowAnalytics} onChange={e => setAllowAnalytics(e.target.checked)} />}
                    label='Analytics'
                />
            </Stack>

            <Stack alignItems='center'>

                <Button
                    sx={{ width: '50%' }}
                    onClick={() => handleSaveChanges()}
                    variant='contained'
                    disabled={!allowNecessary}
                >
                    Save Changes
                </Button>
            </Stack>
        </Stack >
    )
}
