import { Stack } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import NewOrderSummaryPC from './NewOrderSummary.pc';

const UploadFilesPC: FC = () => {

    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        setFiles(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'model/stl': ['.stl'] } })

    if (files.length == 0) return (
        <Stack width='100vw' height='90vh' alignItems='center' justifyContent='center'>
            <Stack sx={{ border: 'solid grey 2px', cursor: 'pointer', borderRadius: 5 }} {...getRootProps()} padding={5}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag models here, or click to select files</p>
                }
            </Stack>
        </Stack>
    )


    return (
        <NewOrderSummaryPC files={files} />
    )
}

export default UploadFilesPC;