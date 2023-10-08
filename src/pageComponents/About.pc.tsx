import { Container, Typography, Card, Divider } from '@mui/material';
import { Stack } from '@mui/system';
import { SpinningLogo } from '@src/components/about/SpinningLogo';
import { FC } from 'react';
import CountUp from 'react-countup';

export const AboutPC: FC = () => {
    return (
        <Stack alignItems='center' justifyContent='center' spacing={5} sx={{ px: 20, pt: 0, pb: 5 }}  >
            {/* Hopefully render logo spinning */}
            < Stack >
                <Stack height='250px' >
                    <SpinningLogo />
                </Stack>
            </Stack >

            <Stack maxWidth={800}>


                <Typography variant='h4' textAlign='center'>Local, High Quality 3D Printing Service</Typography>
                <Typography textAlign='center'>Providing Prototyping, Functional Parts, Additive Manufacturing, FDM, One-off, Batch, Large scale production as well us helpful friendly advice. We are here to help.</Typography>
            </Stack>
            <Container maxWidth='sm'>

                <Divider />
            </Container>
            <Stack alignItems='center'>
                <Typography variant='h4' fontWeight='bold'>

                    <CountUp end={72879} formattingFn={n => n.toLocaleString('en-GB')} duration={4} useEasing={true} />
                </Typography>

                <Typography variant='h6' textAlign='center'>

                    Parts Printed
                </Typography>
                <Typography textAlign='center'>Delivered to 19 different countries</Typography>
            </Stack>
        </Stack >
    )
}
