import { Stack, TextField, styled } from '@mui/material';
import { FC } from 'react';
import { LocalizationProvider, PickersDay, PickersDayProps, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Moment } from 'moment';
import React from 'react';
import moment from 'moment';

interface Props {
    orderDate: Moment;
    leadDays: number;
}

// export const ShippingDateViewer: FC<Props> = ({ orderDate, leadDays }) => {
//     return (
//         <LocalizationProvider dateAdapter={AdapterMoment}>

//             <StaticDatePicker
//                 displayStaticWrapperAs='desktop'

//                 openTo='month'
//                 value={orderDate.add(leadDays, 'days')}
//                 onChange={() => null}
//                 renderInput={(params) => <TextField {...params} />}

//             />
//         </LocalizationProvider>

//     )
// }

const CustomPickersDay = styled(PickersDay<Moment>, {
    shouldForwardProp: (prop) => prop !== "selected"
})(({ theme, selected }) => ({
    ...(selected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.dark
        },
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%"
    })
}));

export const ShippingDateViewer: FC<Props> = ({ orderDate, leadDays }) => {
    const [values, setValues] = React.useState([moment()]);

    const findDate = (dates: Moment[], date: Moment) => {
        return dates.find((item) => item.dayOfYear() === date.dayOfYear());
    };

    const findIndexDate = (dates: Moment[], date: Moment) => {
        return dates.findIndex((item) => item.dayOfYear() === date.dayOfYear());
    };

    const renderPickerDay = (date: Moment, selectedDates: Moment[], pickersDayProps: PickersDayProps<Moment>) => {
        if (!values) {
            return <PickersDay {...pickersDayProps} />;
        }

        const selected = values.some(d => d.isSame(date));

        return (
            <CustomPickersDay
                {...pickersDayProps}
                disableMargin
                selected={selected}
            />
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
                displayStaticWrapperAs="desktop"
                label="Week picker"
                value={values}
                onChange={moment => { if (moment) { setValues(vs => [...vs, moment]) } }}
                renderDay={renderPickerDay}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}

