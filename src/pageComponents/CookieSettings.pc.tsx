import { Card, Stack } from '@mui/material';
import { Container } from '@mui/system';
import { CookieSettings } from '@src/components/privacy/CookieSettings';
import { FC } from 'react';


export const CookieSettingsPC: FC = () => {
    return (
        <Container maxWidth='md' sx={{ padding: 2 }}>

            <Card>
                <Stack sx={{ marginX: 10, marginY: 2 }}>

                    <CookieSettings />
                </Stack>
            </Card>
        </Container>
    )
}
