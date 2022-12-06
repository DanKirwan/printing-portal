import { Container, Typography, Card } from '@mui/material';
import { Stack } from '@mui/system';
import { SpinningLogo } from '@src/components/about/SpinningLogo';
import { FC } from 'react';
import CountUp from 'react-countup';

export const AboutPC: FC = () => {
    return (
        <Stack alignItems='center' height='60vh' justifyContent='center' spacing={2} padding={20}>
            {/* Hopefully render logo spinning */}
            <Stack>
                <Stack height='300px'>

                    <SpinningLogo />
                </Stack>
            </Stack>
            <Container>
                <Card sx={{ padding: '20px' }}>
                    <Stack alignItems='center'>

                        <Typography variant='h2'>

                            <CountUp end={72879} formattingFn={n => n.toLocaleString('en-GB')} duration={4} useEasing={true} />
                            {' Parts Printed'}
                        </Typography>
                        <Typography>Delivered to 19 different countries</Typography>
                    </Stack>
                </Card>
            </Container>

            <Typography variant='h4'>Local, High Quality 3D Printing Service</Typography>
            <Typography textAlign='center'>Providing Prototyping, Functional Parts, Additive Manufacturing, FDM, One-off, Batch, Large scale production as well us helpful friendly advice. We are here to help.</Typography>
        </Stack>
    )
}
