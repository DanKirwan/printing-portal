import { Button, Stack, Typography } from '@mui/material';
import { ChangeEvent, FC, useState } from 'react';
import { BufferGeometry } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

interface Props {
    onLoad: (geometry: BufferGeometry) => void;
}

const loader = new STLLoader();

const STLLoaderHandler: FC<Props> = ({ onLoad }) => {

    const [file, setFile] = useState<File>();

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;

        if (!files) return;
        const file = files[0];
        setFile(file);

        const fileUrl = URL.createObjectURL(file);

        const bufferGeom = await loader.loadAsync(fileUrl);
        onLoad(bufferGeom);
    }
    return (
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
        </Stack>
    )
}

export default STLLoaderHandler;   