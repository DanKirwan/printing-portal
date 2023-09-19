import { FC } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Stack, Typography } from '@mui/material';
import { theme } from '@src/theme';
interface Props {
    completed: boolean;
    step: number;
    description: string;
}

export const OrderStepIcon: FC<Props> = ({ completed, step, description }) => {


    return (
        <Stack alignItems='center' width='32px' zIndex={20}>
            {completed ?
                <CheckCircleRoundedIcon fontSize='large' color='secondary' /> :
                <Typography sx={{
                    borderRadius: '50%',
                    width: 34, height: 34,
                    paddingTop: '2px',
                    marginTop: '4px',
                    border: `solid ${theme.palette.secondary.main} 2px`,
                    marginBottom: 0.2
                }} textAlign='center'>{step}</Typography>}
            <Typography variant='caption' textAlign='center' sx={{ width: '100px' }}>{description}</Typography>
        </Stack>
    )
}
