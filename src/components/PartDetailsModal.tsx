import { Accordion, AccordionDetails, AccordionSummary, Paper, Stack, Typography } from '@mui/material';
import { FC, Suspense } from 'react';
import { suspend } from 'suspend-react';
import { stlToGeom } from '../lib/stlUtils';
import { PartOrder } from '../lib/types';
import Loading from './Loading';
import MainRenderer from './MainRenderer';
import PartSummary from './PartSummary';

interface Props {
    part: PartOrder
}

const PartDetailsModal: FC<Props> = ({ part }) => {
    const geometry = suspend(() => stlToGeom(part.file), [part.file]);
    return (
        <Suspense fallback={<Loading />}>


            <Stack direction='row' spacing={2} height='100%'>
                <Stack>
                    <Typography>Details</Typography>
                    <PartSummary part={part} />
                    <Accordion>
                        <AccordionSummary>Analysis</AccordionSummary>
                        <AccordionDetails>
                            <Stack>
                                Volume: 1000cm3
                                Dimensions:
                                ...
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Stack>
                <MainRenderer geometry={geometry} />
            </Stack>
        </Suspense>
    )
}

export default PartDetailsModal