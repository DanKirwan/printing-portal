/* eslint-disable no-restricted-globals */

import { AppSettings, Material } from "@src/lib/types";
import { estimateLeadTime, estimateOrderCost } from "@src/lib/stlUtils";
import { Order } from "@src/lib/types";

let currentRequest: string | null = null;
// This functions as a cache between files and their volume estimation
const estimatorCache = new Map<string, [number, number, number]>();

export type EstimatorMessage = {
    order: Order,
    materials: Material[],
    id: string,
    settings: AppSettings,
}

// A request id is sent alongside the request to ensure most up to date result used
self.onmessage = async (e: MessageEvent<EstimatorMessage>) => {
    const { order, materials, id, settings } = e.data;
    const {
        supportAngle, wallThickness, supportDensity,
        quantityPricingDiscounts, resolutionPriceMultiplier, infillPriceMultiplier,
        modelSampleRate, } = settings;
    e.lastEventId
    if (id != currentRequest) {

    }
    try {
        const quantityDiscounts: [number, number][] = quantityPricingDiscounts.map(({ key, value }) => [key, value]);
        const resolutionMultipliers: [number, number][] = resolutionPriceMultiplier.map(({ key, value }) => [key, value]);
        const infillMultipliers: [number, number][] = infillPriceMultiplier.map(({ key, value }) => [key, value]);

        const cost = await estimateOrderCost(
            order, materials, estimatorCache,
            quantityDiscounts, resolutionMultipliers, infillMultipliers,
            supportAngle, wallThickness, modelSampleRate, supportDensity,

        );
        const leadDays = await estimateLeadTime(order, materials, estimatorCache);

        self.postMessage({ cost, leadDays, id });
    } catch (error: any) {

        self.postMessage({ cost: Number.NaN, leadDays: Number.NaN, id });
        console.error(error.stack);
        throw error;
    }
};

export { };