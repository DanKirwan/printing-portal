import { Timestamp } from "firebase/firestore";
import { Material } from "./materialUtils";
import { PartOrder, Order, OrderStatus, Address } from "./types";
import isEmail from 'validator/lib/isEmail';

export const genDefaultParts = (files: File[]): PartOrder[] => files.map((file, i) => ({
    file,
    notes: "",
    quantity: 1,
    settings: {
        color: 'Not Chosen',
        infill: 0.4,
        resolution: 200
    }
}));

export const getOrderProblems = (order: Order, currentMaterial: Material): string[] => {

    const partProblems = order.parts.flatMap(p => getPartProblems(p, currentMaterial));
    if (!isEmail(order.email)) {
        partProblems.push("must have a valid email")
    }

    if (!isAddressFilled) {
        partProblems.push("address has missing fields")
    }

    return partProblems;
}

const isAddressFilled = (address: Address): boolean => {
    const { line2, ...nonOptionalParts } = address;

    return Object.values(nonOptionalParts).every(p => !!p);

}

const getPartProblems = (part: PartOrder, currentMaterial: Material): string[] => {

    const { file, settings, quantity } = part;
    const { name } = file;
    const { infill, color } = settings;
    const problems = [];
    if (infill < 0 || infill > 1) {
        problems.push(`${name} has invalid infill: ${infill * 100}% - must be between 0 and 100`);
    }

    const { colors, name: materialName } = currentMaterial;
    if (!colors.find(c => c.name == color)) {
        const validColours = colors
            .filter(c => c.available)
            .map(c => c.name)
            .join(', ');
        problems.push(
            `${name} has invalid colour: ${color} is unavailable for ${materialName}. `
            + `Valid colours: ${validColours}`
        )
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
        problems.push(
            `${name} has invalid quantity: ${quantity} must be an integer greater than 0`
        );
    }

    return problems;
}
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