import { VisibilityOff, Visibility } from '@mui/icons-material';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, Stack } from '@mui/material';
import { Dispatch, FC, SetStateAction, useState } from 'react';

interface Props {
    password: string;
    label: string;
    setPassword: (password: string) => void;
    verifyPassword: (password: string) => string | null;

}

export const PasswordField: FC<Props> = ({ password, setPassword, verifyPassword, label }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passHelperText, setPassHelperText] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };


    const handleSetPass = (pass: string) => {

        setPassword(pass);
        if (!passHelperText) return;
        handlePassBlur(pass);
    }


    const handlePassBlur = (password: string) => {
        setPassHelperText(verifyPassword(password) ?? '');
    }



    return (
        <FormControl variant="outlined" size='small'>
            <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
            <OutlinedInput
                value={password} onChange={e => handleSetPass(e.target.value)}
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                onBlur={() => handlePassBlur(password)}
            />
            <FormHelperText error>
                {passHelperText}
            </FormHelperText>
        </FormControl>

    )
}
