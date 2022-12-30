import { Stack, Typography } from '@mui/material';
import { EventTypes } from '@src/lib/analytics';
import { analytics } from '@src/main';
import { logEvent } from 'firebase/analytics';
import { FC, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import NewOrderSummaryPC from './NewOrderSummary.pc';

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
            <Stack flexGrow={1} justifyContent='center'>

                <Stack sx={{ width: '60vw', border: 'solid grey 2px', cursor: 'pointer', borderRadius: 5 }} {...getRootProps()} padding={5} alignItems='center' justifyContent='center'>
                    <input {...getInputProps()} />
                    {
                        !isDragActive ?
                            <Typography textAlign='center'>
                                Please upload your .stl files for an instant quote and lead time below.
                                Once submitted we will get back to you the same day to confirm your parts are printable and that they are underway.
                            </Typography> :
                            <Typography textAlign='center'>Drag models here, or click to select files</Typography>
                    }

                </Stack>
            </Stack>

            <Typography textAlign='center' variant='body2'>
                If you would like advice, have a specialist request, the webpage is not working,
                or simply would like a manual quote then please email us at: {" "}
                <a href="mailto:henleyprint3d@gmail.com" style={{ color: 'red' }}>
                    henleyprint3d@gmail.com
                </a>
                {" "}and we will get back to you within a matter of minutes.
            </Typography>

            <Stack width='80%'>

                <Typography textAlign='center' variant='caption' color='red'>
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