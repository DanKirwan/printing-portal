import { IconButton, Tooltip, TooltipProps, SxProps, Theme } from '@mui/material';
import { FC } from 'react';


interface Props {
    title: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    Icon: FC<{ color: 'inherit' | 'primary'; }>;
    isOn?: boolean;
    disabled?: boolean;
    placement?: TooltipProps['placement'];
    sx?: SxProps<Theme> | null;
}
export const TooltipIconButton: FC<Props> = ({ title, onClick, Icon, isOn, disabled = false, placement = 'bottom', sx }) => (
    <IconButton sx={sx} onClick={onClick} disabled={disabled}>
        <Tooltip title={title} placement={placement} >
            <Icon color={isOn ? 'primary' : 'inherit'} />
        </Tooltip>
    </IconButton>
);
