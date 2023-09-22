import { TextField, Tooltip } from '@mui/material';
import { LocalizationProvider, PickersDay, PickersDayProps, StaticDatePicker, pickersDayClasses } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { theme } from '@src/theme';
import { Moment } from 'moment';
import { FC } from 'react';

interface Props {
    orderDate: Moment;
    shippingDate: Moment;
}




export const ShippingDateViewer: FC<Props> = ({ orderDate, shippingDate }) => {

    const renderPickerDay = (date: Moment | undefined, selectedDates: Moment[], pickersDayProps: PickersDayProps<Moment>) => {
        const selected = selectedDates.some(d => d?.isSame(date, 'D') ?? false);
        const isOrderDate = date?.isSame(orderDate, 'D');

        const tooltipText = selected ? 'Shipping Date' : isOrderDate ? 'Order Date' : '';
        return (
            <PickersDay
                {...pickersDayProps}
                title={tooltipText}
                disableMargin
                today={isOrderDate}
                sx={{
                    [`&&.${pickersDayClasses.selected}`]: {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.common.white,
                        "&:hover, &:focus": {
                            backgroundColor: theme.palette.secondary.dark
                        },
                    }
                }}
            />
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
                views={['day']}
                inputFormat="DD/MM/YYYY"

                displayStaticWrapperAs="desktop"
                value={shippingDate}
                onChange={() => null}
                renderDay={renderPickerDay}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    )
}


// const CustomPickersDay = styled(PickersDay<Moment>, {
//     shouldForwardProp: (prop) => prop !== "selected"
// })(({ theme, selected }) => ({
//     ...(selected && {
//         backgroundColor: theme.palette.primary.main,
//         color: theme.palette.common.white,
//         "&:hover, &:focus": {
//             backgroundColor: theme.palette.primary.dark
//         },
//         borderTopLeftRadius: "50%",
//         borderBottomLeftRadius: "50%",
//         borderTopRightRadius: "50%",
//         borderBottomRightRadius: "50%"
//     })
// }));

// export const ShippingDateViewer: FC<Props> = ({ orderDate, leadDays }) => {
//     const [values, setValues] = React.useState([orderDate.add(leadDays, 'days')]);


//     // const expiditedDate = orderDate.add(leadDays + expiditedTime, 'days');
//     // const standardDate = orderDate.add(leadDays + standardTime, 'days');

//     const renderPickerDay = (date: Moment, selectedDates: Moment[], pickersDayProps: PickersDayProps<Moment>) => {
//         if (!values) {
//             return <PickersDay {...pickersDayProps} />;
//         }

//         const selected = values.some(d => d.isSame(date));

//         return (
//             <Tooltip title={selected ? 'test' : ''}>

//                 <CustomPickersDay
//                     {...pickersDayProps}
//                     disableMargin
//                     selected={selected}
//                 />
//             </Tooltip>
//         );
//     };

//     return (
//         <LocalizationProvider dateAdapter={AdapterMoment}>
//             <StaticDatePicker
//                 displayStaticWrapperAs="desktop"
//                 label="Week picker"
//                 value={values}

//                 onChange={moment => { if (moment) { setValues(vs => [...vs, moment]) } }}
//                 renderDay={renderPickerDay}
//                 renderInput={(params) => <TextField {...params} />}
//             />
//         </LocalizationProvider>
//     );
// }

