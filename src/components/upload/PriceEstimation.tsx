import { Typography } from '@mui/material';
import { Material } from '@src/lib/types';
import { Order } from '@src/lib/types';
import _ from 'lodash';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EllipseLoadingText } from '../generic/EllipseLoadingText';

import Estimator from '@src/workers/priceEstimator?worker';
import { getOrderPrice, scaleNormals } from '@src/lib/stlUtils';
import { useSettings } from '@src/contexts/SettingsContext';
interface Props {
    order: Order;
    materials: Material[];
    onCalculated?: (price: number) => void;
}

const getRangeString = (ranges: number[], upperIndex: number) => {
    if (upperIndex == 0) return `Less than £${ranges[0]}`;
    if (upperIndex >= ranges.length - 1 || upperIndex == -1) return `Greater than £${ranges[ranges.length - 1]}`;

    return `£${ranges[upperIndex - 1]} - £${ranges[upperIndex]}`;
}


export const PriceEstimation: FC<Props> = ({ order, materials, onCalculated = () => null }) => {

    const { settings } = useSettings();
    const { priceMultiplier, minimumPrice } = settings;
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState<number | null>(null);
    const requestId = useRef<null | string>(null);

    const estimator: Worker = useMemo(
        () => new Estimator(),
        []
    );

    const priceString = price?.toFixed(0);

    // Stops the message queue becoming completely overpopulated with requests

    const postMessageDebounced = useCallback(_.debounce(
        (message: { order: Order, materials: Material[], id: string }) => {
            estimator.postMessage(message)
        },
        200), [estimator]);


    useEffect(() => {
        if (!window.Worker) return;


        const id = _.uniqueId();
        requestId.current = id;
        estimator.onmessage = (e: MessageEvent<{ price: number, id: string }>) => {
            const { price, id } = e.data;
            if (id != requestId.current) return;
            if (Number.isNaN(price)) {
                setPrice(null);
                setLoading(false);

                return;
            }
            const orderPrice = Math.max(minimumPrice, getOrderPrice(price, priceMultiplier))
            setPrice(orderPrice);
            onCalculated(orderPrice);
            setLoading(false);

        }
        setLoading(true);
        postMessageDebounced({ order, materials, id });


    }, [estimator, order.parts, order.settings.material, materials])


    if (loading) return <Typography>Calculating price<EllipseLoadingText /></Typography>;
    return priceString ?
        <Typography>Price Estimate: £{priceString} Approx.</Typography> :
        <Typography>
            No price estimate can be provided at this time please your submit order for a quote.
        </Typography>


}
