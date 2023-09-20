import { Stack, Grid, Typography } from '@mui/material';
import { sum } from 'lodash';
import { FC } from 'react';

interface Props {
    components: [string, number][];
}

export const PriceSummary: FC<Props> = ({ components }) => {
    return (
        <Grid container spacing={2}>
            {components.map(([description, value]) => <>
                <Grid item xs={8} alignContent='right'>
                    <Typography variant='body1' textAlign='right'>{description}: </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant='body1'>£{value.toFixed(2)}</Typography>
                </Grid>
            </>)}


            <Grid item xs={8}>
                <Typography textAlign='right' fontWeight='bold'>Total: </Typography>
            </Grid>
            <Grid item xs={4}>
                <Typography fontWeight='bold'>
                    £{sum(components.map(([, value]) => value)).toFixed(2)}
                </Typography>
            </Grid>
        </Grid>
    )
}
