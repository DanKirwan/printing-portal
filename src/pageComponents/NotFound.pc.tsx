import { Container, Link, Stack, Typography } from '@mui/material';
import { SpinningLogo } from '@src/components/about/SpinningLogo';
import { FC } from 'react';


const NotFoundPC: FC = () => {
    return (

        <Stack width='100%' alignItems='center' height='100%' justifyContent='center'>

            <Typography variant='h4' fontWeight='bold'>This Page Does Not Exist!</Typography>
            <Link href='/' >
                <Typography variant='body2'>
                    Please click here to get back on track.
                </Typography>
            </Link>
        </Stack>
    )
}

export default NotFoundPC;