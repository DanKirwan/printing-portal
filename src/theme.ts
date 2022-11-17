import { createTheme } from "@mui/material";

const preTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#e44242',

            contrastText: '#fff',
        },
        secondary: {
            main: '#cb337f',
            contrastText: '#fff',
        },
        action: {
            disabled: '#fff',
        }
    },
    typography: {
        fontFamily: 'Monospace',
        fontSize: 16
    },
});

export const theme = createTheme(preTheme, {
    palette: {
        info: {
            main: '#fff',
        },
    },
});