import { Container, Stack } from '@mui/material';
import { FC, useCallback, useState } from 'react';
import DetailedPartOrder from '../components/DetailedPartOrder';
import { useDropzone } from 'react-dropzone'
import OrderSummaryPC from './OrderSummary.pc';
import { Order } from '../lib/types';

const UploadFilesPC: FC = () => {

    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        setFiles(acceptedFiles);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'model/stl': ['.stl'] } })

    if (files.length == 0) return (
        <Stack width='100vw' height='100vh' alignItems='center' justifyContent='center'>
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

    const order: Order = {
        email: "Test",
        desc: "Test Desc",
        lead: 2,
        ordered: new Date(),
        parts: files.map((file, i) => ({
            file,
            notes: "Great file",
            quantity: i + 1,
            settings: {
                color: 'red',
                infill: 0.4,
                material: 'PLA',
                resolution: 200
            }
        }))
    };

    return (
        <OrderSummaryPC order={order} />
    )
}

export default UploadFilesPC;