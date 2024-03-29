import { Divider, Grid, Stack, Typography } from '@mui/material';
import { Material, ShippingType } from '@src/lib/types';
import { Order } from '@src/lib/types';
import _, { sum } from 'lodash';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EllipseLoadingText } from '../generic/EllipseLoadingText';

import Estimator from '@src/workers/priceEstimator?worker';
import { getOrderPrice, scaleNormals } from '@src/lib/stlUtils';
import { useSettings } from '@src/contexts/SettingsContext';
import { getShippingDetails } from '@src/lib/orderUtils';
import { PriceSummary } from '../generic/PriceSummary';
import { ShippingDateViewer } from '../generic/ShippingDateViewer';
import moment from 'moment';
import { EstimatorMessage } from '@src/workers/priceEstimator';
import { tupalize } from '@src/lib/utils';
interface Props {
    order: Order;
    materials: Material[];
    onCalculated?: (price: number, leadDays: number) => void;
}


export const PriceEstimation: FC<Props> = ({ order, materials, onCalculated = () => null }) => {

    const { settings } = useSettings();
    const { priceMultiplier, minimumPrice, bulkPricingDiscounts, volumeLeadMultiplier } = settings;
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState<number | null>(null);
    const [leadDays, setLeadDays] = useState<number | null>(null);
    const requestId = useRef<null | string>(null);
    const { shippingType } = order;
    const estimator: Worker = useMemo(
        () => new Estimator(),
        []
    );

    const displayPrice = price == null ? null : Math.round(price);
    const leadString = !leadDays ?
        null :
        leadDays >= 10 ? '10 Days + (Review Required)' : `${leadDays} Days Approx.`;

    // Stops the message queue becoming completely overpopulated with requests

    const postMessageDebounced = useCallback(_.debounce(
        (message: EstimatorMessage) => {
            estimator.postMessage(message)
        },
        200), [estimator]);

    const handleCompleteCalculation = (cost: number, leadDays: number) => {
        if (Number.isNaN(cost) || Number.isNaN(leadDays)) {
            setPrice(null);
            setLeadDays(null);

            return;
        }
        const filteredLeadDays = Math.ceil(Math.max(settings.minLeadDays, leadDays * volumeLeadMultiplier));


        const valueDiscounts = tupalize(bulkPricingDiscounts);
        const orderPrice = getOrderPrice(cost, priceMultiplier, valueDiscounts);
        const filteredPrice = orderPrice == 0 ? null : Math.max(minimumPrice, orderPrice);
        setPrice(filteredPrice);
        setLeadDays(filteredLeadDays);
        if (filteredPrice == null || filteredLeadDays == null) return;
        onCalculated(orderPrice, filteredLeadDays);
    }


    useEffect(() => {
        if (!window.Worker) return;


        const id = _.uniqueId();
        requestId.current = id;
        estimator.onmessage = (e: MessageEvent<{ cost: number, leadDays: number, id: string }>) => {
            const { cost, leadDays, id } = e.data;
            if (id != requestId.current) return;
            console.log(e.data);
            handleCompleteCalculation(cost, leadDays);
            setLoading(false);
        }
        setLoading(true);
        postMessageDebounced({ order, materials, id, settings });


    }, [estimator, order.parts, order.settings.material, materials])

    const [, shippingPrice] = getShippingDetails(shippingType);
    const partCount = sum(order.parts.map(p => p.quantity));

    if (!displayPrice) return <Typography>Calculating price<EllipseLoadingText /></Typography>;
    return displayPrice != null ?
        <Stack>
            <PriceSummary
                components={[
                    [`Parts (${partCount} Part${partCount > 1 ? 's' : ''})`, displayPrice],
                    [`Shipping (${order.shippingType})`, shippingPrice ?? 0]
                ]}
            />
            <Divider />

            {leadDays !== null &&
                <ShippingDateViewer orderDate={moment()} shippingDate={moment().add(leadDays, 'days')} />
            }
            <Typography variant='caption' textAlign='center'>Lead Time: {leadString}</Typography>
        </Stack> :
        <Typography>
            No price estimate can be provided at this time please your submit order for a quote.
        </Typography>


}
