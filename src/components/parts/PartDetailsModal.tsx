import { Accordion, AccordionDetails, AccordionSummary, Paper, Stack, Typography } from '@mui/material';
import { FC, Suspense } from 'react';
import { suspend } from 'suspend-react';
import { stlToGeom } from '../../lib/stlUtils';
import { PartOrder } from '../../lib/types';
import GeometryAnalysis from '../GeometryAnalysis';
import Loading from '../Loading';
import MainRenderer from '../MainRenderer';
import { PartSettingsEditor } from './PartSettingsEditor';
import PartSummary from './PartSettingsSummary';

interface Props {
    part: PartOrder
    onChange: (part: PartOrder) => void;
    editing?: boolean;
}


const PartDetailsModal: FC<Props> = ({ part, onChange, editing = false }) => {
    const geometry = suspend(() => stlToGeom(part.file), [part.file]);

    return (
        <Suspense fallback={<Loading />}>


            <Stack direction='row' spacing={2} height='100%'>
                <Stack width="60%">
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary>Settings</AccordionSummary>
                        <AccordionDetails>
                            {editing
                                ?
                                <PartSettingsEditor part={part} onChange={onChange} />
                                :
                                <PartSummary part={part} />
                            }

                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>Analysis</AccordionSummary>
                        <AccordionDetails>
                            <GeometryAnalysis geometry={geometry} />
                        </AccordionDetails>
                    </Accordion>
                </Stack>
                <MainRenderer geometry={geometry} />
            </Stack>
        </Suspense>
    )
}

export default PartDetailsModal