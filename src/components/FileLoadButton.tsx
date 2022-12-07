import { Box, Button, ButtonProps, Stack, SxProps, Typography } from '@mui/material';
import { ChangeEvent, FC, Suspense, useState } from 'react';
import { BufferGeometry } from 'three';
import { stlToGeom } from '../lib/stlUtils';
import Loading from './Loading';
import ModelPreview from './ModelPreview';

interface Props {
    onFilesLoad: (files: File[]) => void;
    title: string;

}


export const FileLoadButton: FC<Props & Pick<ButtonProps, 'variant' | 'style'>> = ({ onFilesLoad, title, ...buttonProps }) => {


    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.currentTarget.files;

        if (!files) return;
        onFilesLoad([...files]);
    }
    return (

        <Button
            {...buttonProps}
            variant="contained"
            component="label"

        >
            {title}
            <input
                type="file"
                accept='.stl'
                multiple
                onChange={handleFileUpload}
                hidden
            />
        </Button>

    )
}