import { Timestamp } from "firebase/firestore";
import { PartOrder, Order, OrderStatus } from "./types";

export const genDefaultParts = (files: File[]): PartOrder[] => files.map((file, i) => ({
    file,
    notes: "",
    quantity: 1,
    settings: {
        color: 'Any',
        infill: 0.4,
        resolution: 200
    }
}));

export const genDefaultOrder = (files: File[]): Order => {

    const order: Order = {
        userId: null,
        email: "",
        desc: "",
        lead: 2,
        ordered: Timestamp.fromDate(new Date()),
        parts: genDefaultParts(files),
        address: {
            firstName: '',
            lastName: '',
            city: '',
            countryCode: 'GB',
            line1: '',
            line2: '',
            postCode: '',
            county: ''
        },
        status: OrderStatus.Incoming,
        settings: {
            material: 'PLA',
        },
        price: 0,
        expectedShipping: Timestamp.fromDate(new Date()),
    };

    return order;
}