import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { handleOrderGet } from '@src/lib/appUtils';
import { getDB } from '@src/lib/firebaseUtils';
import { useCollection, useCollectionWithIds } from '@src/lib/hooks';
import { computeGeometryMetrics, estimateOrderPrice, stlToGeom } from '@src/lib/stlUtils';
import { Order } from '@src/lib/types';
import { Timestamp } from 'firebase/firestore';
import moment, { Moment } from 'moment';
import { FC, Suspense, useEffect, useState } from 'react';
import { suspend } from 'suspend-react';
import Loading from '../Loading';

interface Props {
    orderId: string;
    onClose: () => void;
    onAccept: (order: Order) => void;
}

export const AcceptOrderDialogContent: FC<Props> = ({ orderId, onAccept, onClose }) => {
    const order = suspend(() => handleOrderGet(orderId), [orderId]);
    const [materials, loadingMaterials] = useCollection(getDB().materials);


    const [date, setDate] = useState<Moment | null>(moment().add(5, 'days'));
    const [priceMult, setPriceMult] = useState(10);
    const [estimatedCost, setEstimatedCost] = useState<null | number>(null);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (price != 0) return;
        if (loadingMaterials) return;
        let unmounted = false;
        const asyncCalcPrice = async () => {
            try {
                console.log(order);
                const price = await estimateOrderPrice(order, materials);
                if (unmounted) return;
                setEstimatedCost(price);
                setPrice(p => p == 0 ? price * priceMult : p);
            } catch (error) {
                console.log(error);
                alert("Failed to calculate estimated price: Check console for errors");
            }
        }

        asyncCalcPrice();

        return () => {
            unmounted = true;
        };

    }, [order, materials, loadingMaterials])

    const handleProfitMultChange = (value: number) => {
        setPriceMult(value);
        if (!estimatedCost) return;
        setPrice(estimatedCost * value);
    }


    const handleAccept = () => {

        if (!date) return;
        onAccept({
            ...order,
            expectedShipping: Timestamp.fromDate(date.toDate()),
            price: price
        });
    }

    return (<>
        <DialogTitle>
            Accept Order
        </DialogTitle>
        <DialogContent>
            <Stack padding={2} spacing={2}>

                <DatePicker
                    label="Shipping Date"
                    inputFormat="DD/MM/YYYY"
                    value={date}
                    onChange={newDate => setDate(newDate)}
                    renderInput={(params) => <TextField {...params} />}
                />

                {estimatedCost == null ?
                    <Stack>

                        <Typography>Calculating Estimated Price...</Typography>
                        <Loading />
                    </Stack> :
                    <Typography>Estimated Cost: £{estimatedCost}</Typography>
                }

                <TextField type='number' value={priceMult.toString()} onChange={e => handleProfitMultChange(+e.target.value)} label='Profit Multiplier' />
                <TextField type='number' value={price.toString()} onChange={e => setPrice(+e.target.value)} label='Price' />
            </Stack>


        </DialogContent>
        <DialogActions>
            <Button onClick={() => onClose()} variant='contained'>Close</Button>
            <Button
                onClick={() => handleAccept()}
                variant='contained'
                disabled={!date || price == 0}
            >Accept</Button>
        </DialogActions>

    </>)
}
