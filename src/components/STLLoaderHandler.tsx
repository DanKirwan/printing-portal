import { Button, Stack, Typography } from '@mui/material';
import { ChangeEvent, FC, Suspense, useState } from 'react';
import { BufferGeometry } from 'three';
import { stlToGeom } from '../lib/stlUtils';
import Loading from './Loading';
import ModelPreview from './ModelPreview';

interface Props {
    onLoad: (geometry: BufferGeometry) => void;
}


const STLLoaderHandler: FC<Props> = ({ onLoad }) => {

    const [file, setFile] = useState<File>();

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;

        if (!files) return;
        const file = files[0];
        setFile(file);
        const bufferGeom = await stlToGeom(file)
        onLoad(bufferGeom);
    }
    return (
        <Suspense fallback={<Loading />}>

            <Stack>
                {file && <Typography variant='h5'>Current File: {file.name}</Typography>}
                <Button
                    variant="contained"
                    component="label"
                >
                    Upload File
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        hidden
                    />
                </Button>
                <Stack sx={{ width: "100px", height: "100px" }}>

                    {file && <ModelPreview file={file} color="red" />}
                </Stack>
            </Stack>
        </Suspense>
    )
}

export default STLLoaderHandler;   