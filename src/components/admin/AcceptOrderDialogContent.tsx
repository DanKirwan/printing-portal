import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { handleOrderGet } from '@src/lib/appUtils';
import { getDB } from '@src/lib/firebaseUtils';
import { useCollection, useCollectionWithIds } from '@src/lib/hooks';
import { computeGeometryMetrics, estimateLeadTime, estimateOrderCost, getOrderPrice, stlToGeom } from '@src/lib/stlUtils';
import { Order } from '@src/lib/types';
import { Timestamp } from 'firebase/firestore';
import moment, { Moment } from 'moment';
import { FC, Suspense, useEffect, useState } from 'react';
import { suspend } from 'suspend-react';
import Loading from '../Loading';
import { useSettings } from '@src/contexts/SettingsContext';

interface Props {
    orderId: string;
    onClose: () => void;
    onAccept: (order: Order) => void;
}

export const AcceptOrderDialogContent: FC<Props> = ({ orderId, onAccept, onClose }) => {
    const order = suspend(() => handleOrderGet(orderId), [orderId]);
    const [materials, loadingMaterials] = useCollection(getDB().materials);


    const [date, setDate] = useState<Moment | null>(moment().add(5, 'days'));
    const { settings } = useSettings();
    const { priceMultiplier } = settings;
    const [priceMult, setPriceMult] = useState(priceMultiplier);
    const [estimatedCost, setEstimatedCost] = useState<null | number>(null);
    const [estimatedLead, setEstimatedLead] = useState<null | number>(null);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (price != 0) return;
        if (loadingMaterials) return;
        let unmounted = false;
        const metricCache = new Map<string, [number, number, number]>();
        const asyncCalcPrice = async () => {
            try {
                console.log(order);
                const cost = await estimateOrderCost(order, materials, metricCache);
                if (unmounted) return;
                setEstimatedCost(cost);
                setPrice(p => p == 0 ? +(getOrderPrice(cost, priceMult).toFixed(2)) : p);
            } catch (error) {
                console.log(error);
                alert("Failed to calculate estimated price: Check console for errors");
            }
        }

        const asyncCalcLead = async () => {
            try {
                const leadDays = await (estimateLeadTime(order, materials, metricCache));
                if (unmounted) return;
                setEstimatedLead(leadDays);
                setDate(moment().add(leadDays, 'days'));
            } catch (error) {
                console.log(error);
                alert("Failed to calculate estimated lead days: Check console for errors");
            }
        }

        asyncCalcPrice();
        asyncCalcLead();

        return () => {
            unmounted = true;
        };

    }, [order, materials, loadingMaterials])

    const handleProfitMultChange = (value: number) => {
        setPriceMult(value);
        if (!estimatedCost) return;
        setPrice(+(estimatedCost * value).toFixed(2));
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
                <Typography variant='caption'>
                    {estimatedLead ? `Estimated ${estimatedLead} Days` : 'Calculating Lead Time...'}
                </Typography>

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
