/* eslint-disable no-restricted-globals */

import { Material } from "@src/lib/materialUtils";
import { estimateOrderPrice } from "@src/lib/stlUtils";
import { Order } from "@src/lib/types";

let currentRequest: string | null = null;
// This functions as a cache between files and their volume estimation
const estimatorCache = new Map<string, [number, number, number]>();

// A request id is sent alongside the request to ensure most up to date result used
self.onmessage = async (e: MessageEvent<{ order: Order, materials: Material[], id: string }>) => {
    const { order, materials, id } = e.data;
    e.lastEventId
    if (id != currentRequest) {

    }
    try {

        const price = await estimateOrderPrice(order, materials, estimatorCache);
        self.postMessage({ price, id });
    } catch (error) {
        console.log(error);
        self.postMessage({ price: Number.NaN, id });
    }
};

export { };