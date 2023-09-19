import { Stack, Typography, Button, IconButton, Fab, Box, Tooltip } from '@mui/material';
import { EventTypes } from '@src/lib/analytics';
import { analytics } from '@src/main';
import { logEvent } from 'firebase/analytics';
import { FC, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import NewOrderSummaryPC from './NewOrderSummary.pc';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { theme } from '@src/theme';

const inlineIconStyle = { position: 'relative', width: 20, height: 20, top: 4, marginX: 0.5 };
const UploadFilesPC: FC = () => {

    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        logEvent(analytics, EventTypes.StartOrder);
        setFiles(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'model/stl': ['.stl'] } })

    if (files.length == 0) return (
        <Stack height='100%' spacing={2} alignItems='center' justifyContent='center' sx={{ px: 10, py: 2 }} >
            <Stack flexGrow={1} justifyContent='center' maxWidth='85vh' alignItems='center' spacing={2}>

                <Stack sx={{ width: '100%', border: '1px dashed grey', borderRadius: 2, ":hover": { cursor: 'pointer' } }} {...getRootProps()} spacing={5} padding={10} alignItems='center' justifyContent='center'>
                    <Fab onClick={() => null} color='primary' >
                        <FileUploadIcon />
                    </Fab>
                    <input {...getInputProps()} />
                    <Stack alignItems='center'>

                        <Typography textAlign='center'>Drag and drop here or select files</Typography>
                        <Typography variant='caption'>Supported file types: STL</Typography>
                    </Stack>


                </Stack>
                <Stack direction='row' width='100%' justifyContent='space-between'>



                    <Tooltip
                        title="All your files are secure with us – contact us for more information in regarding our use of data."
                    >

                        <Typography variant='subtitle1' textAlign='center' >

                            <LockIcon sx={inlineIconStyle} />
                            <span style={{ fontWeight: 'bold' }}>Privacy </span>

                        </Typography>
                    </Tooltip>
                    <Tooltip
                        title='Uploading weapons or parts subject to export control regulations including but not limited to ITAR, EAR beyond EAR99, or EU Dual Use is a violation our terms of use.'
                    >
                        <Typography variant='subtitle1' textAlign='center' >
                            <ReportProblemIcon sx={inlineIconStyle} />
                            <span style={{ fontWeight: 'bold' }}>Weapons Regulations </span>

                        </Typography>
                    </Tooltip>

                    <Tooltip
                        title='If you require us to sign an NDA, please do not hesitate to contact us, and we will promptly review and respond to your request. If you would like to discuss specific requests we are moe than happy to set up a call.'
                    >
                        <Typography variant='subtitle1' textAlign='center' >

                            <VerifiedUserIcon sx={inlineIconStyle} />
                            <span style={{ fontWeight: 'bold' }}>Confidentialiy </span>

                        </Typography>
                    </Tooltip>
                </Stack>

            </Stack>

            <Typography textAlign='center' variant='caption'>
                For a specialist request or simply would like a manual quote then please email us at: {" "}
                <a href="order@henleyprint3d.com" style={{ color: 'red' }}>
                    order@henleyprint3d.com
                </a>
                {" "}and we will get back to you within a matter of minutes.
            </Typography>

            <Stack width='80%'>

                <Typography textAlign='center' variant='subtitle2' color='red'>
                    We aim to reply within 2 hours between 08:00 - 20:00.
                    Monday to Sunday. All requests are answered within 24 hours.
                    Please let us know if your request is particularly urgent and we will work with this.
                </Typography>
            </Stack>


        </Stack >
    )


    return (
        <NewOrderSummaryPC files={files} />
    )
}

export default UploadFilesPC;