import { Stack, IconButton } from '@mui/material';
import { OrderStatus } from '@src/lib/types';
import { FC } from 'react';
import { OrderProgressBar } from './OrderProgressBar';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';


interface Props {
    status: OrderStatus;
}

export const OrderNavigationBar: FC<Props> = ({ status }) => {
    const navigate = useNavigate();
    return (
        <Stack direction='row' alignItems='center' spacing={2} paddingX={2}>
            <IconButton onClick={() => navigate(-1)} sx={{ width: 50, height: 50 }} >
                <ArrowBackRoundedIcon />
            </IconButton>
            <OrderProgressBar status={status} />
            {/* This is just used for centering */}
            <Stack style={{ width: '50px', height: '50px' }} />
        </Stack>
    )
}
