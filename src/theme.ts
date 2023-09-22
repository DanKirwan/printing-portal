import { createTheme } from "@mui/material";



const darkGrey = '#414241';
const lightGrey = '#eceff1';
const background = 'white';
const blue = '#501cfc';
const red = '#a42117';
const contrastText = '#fff';
const preTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: darkGrey,
            contrastText: contrastText,
        },
        secondary: {
            main: red,
            contrastText: contrastText,
        },
        action: {
            disabled: contrastText,
        }
    },
    typography: {
        allVariants: {
            letterSpacing: 2,
            fontWeight: 'lighter',


        },
        caption: {
            color: darkGrey
        },

        body1: {
            color: darkGrey,
            fontSize: 14
        },
        subtitle1: {
            color: darkGrey,
            fontSize: 12,
            letterSpacing: 1.2
        },
        subtitle2: {
            fontSize: 9,
            letterSpacing: 1.2
        },
        fontFamily: 'Mulish,Helvetica, Arial, Sans-Serif, serif',
        fontSize: 16
    },
    components: {

    }
});

export const theme = createTheme(preTheme, {
    palette: {
        info: {
            main: '#fff',
        },
    },
});