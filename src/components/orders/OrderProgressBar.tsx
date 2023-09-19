import { LinearProgress, Stack } from '@mui/material';
import { OrderStatus } from '@src/lib/types';
import { FC } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { OrderStepIcon } from './OrderStepIcon';

interface Props {
    status: OrderStatus;
}

const getStage = (status: OrderStatus) => {

    const steps = [OrderStatus.Incoming, OrderStatus.Accepted, OrderStatus.Processing, OrderStatus.Shipped, OrderStatus.Completed];
    console.log(steps)
    const index = steps.indexOf(status);
    if (index == -1) return 0;
    return index;
}

export const OrderProgressBar: FC<Props> = ({ status }) => {

    const step = getStage(status);

    console.log(status, step, OrderStatus.Shipped);
    const getProgress = (lastStep: number) => {
        if (lastStep == step) return 50;
        return step > lastStep ? 100 : 0;
    }

    return (
        <Stack direction='row' width='100%' justifyContent='center' paddingTop={2.5}>
            <OrderStepIcon completed={step >= 0} description='Submitted' step={1} />
            <LinearProgress variant="determinate" value={getProgress(0)} sx={{ width: 100, marginTop: '18px' }} />
            <OrderStepIcon completed={step >= 1} description='Accepted' step={2} />
            <LinearProgress variant="determinate" value={getProgress(1)} sx={{ width: 100, marginTop: '18px' }} />
            <OrderStepIcon completed={step >= 2} description='Paid and in Production' step={3} />
            <LinearProgress variant="determinate" value={getProgress(2)} sx={{ width: 100, marginTop: '18px' }} />
            <OrderStepIcon completed={step >= 3} description='Shipped' step={4} />
            <LinearProgress variant="determinate" value={getProgress(3)} sx={{ width: 100, marginTop: '18px' }} />
            <OrderStepIcon completed={step >= 4} description='Delivered' step={5} />

        </Stack>
    )
}
