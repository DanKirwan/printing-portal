/* eslint-disable no-restricted-globals */

import { Material } from "@src/lib/types";
import { estimateLeadTime, estimateOrderCost } from "@src/lib/stlUtils";
import { Order } from "@src/lib/types";

let currentRequest: string | null = null;
// This functions as a cache between files and their volume estimation
const estimatorCache = new Map<string, [number, number, number]>();

type EstimatorMessage = {
    order: Order,
    materials: Material[],
    id: string,
}

// A request id is sent alongside the request to ensure most up to date result used
self.onmessage = async (e: MessageEvent<{ order: Order, materials: Material[], id: string }>) => {
    const { order, materials, id } = e.data;
    e.lastEventId
    if (id != currentRequest) {

    }
    try {

        const cost = await estimateOrderCost(order, materials, estimatorCache);
        const leadDays = await estimateLeadTime(order, materials, estimatorCache);

        self.postMessage({ cost, leadDays, id });
    } catch (error: any) {

        self.postMessage({ cost: Number.NaN, leadDays: Number.NaN, id });
        console.error(error.stack);
        throw error;
    }
};

export { };