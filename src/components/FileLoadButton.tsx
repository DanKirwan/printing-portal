import { Button, ButtonProps } from '@mui/material';
import { ChangeEvent, FC } from 'react';

interface Props {
    onFilesLoad: (files: File[]) => void;
    title: string;
    extension?: string;
}


export const FileLoadButton: FC<Props & Pick<ButtonProps, 'variant' | 'style'>> = ({ onFilesLoad, title, extension = '*', ...buttonProps }) => {


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
                accept={extension}
                multiple
                onChange={handleFileUpload}
                hidden
            />
        </Button>

    )
}