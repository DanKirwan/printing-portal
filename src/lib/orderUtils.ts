import { Timestamp } from "firebase/firestore";
import { PartOrder, Order, OrderStatus, Address, ShippingType, Material } from "./types";
import isEmail from 'validator/lib/isEmail';


export const getOrderProblems = (order: Order, currentMaterial: Material): string[] => {

    const partProblems = order.parts.flatMap(p => getPartProblems(p, currentMaterial));
    if (order.parts.length == 0) partProblems.push("An order must contain at least 1 part");
    if (!isEmail(order.email)) {
        partProblems.push("Must have a valid email")
    }

    if (!isAddressFilled(order.address)) {
        partProblems.push("Address has missing fields")
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
        problems.push(`Part ${name} has invalid infill: ${infill * 100}% - must be between 0 and 100`);
    }

    const { colors, name: materialName } = currentMaterial;
    if (!colors.find(c => c.name == color) && color) {
        const validColours = colors
            .filter(c => c.available)
            .map(c => c.name)
            .join(', ');
        problems.push(
            `Part ${name} has invalid colour: ${color} is unavailable for ${materialName}.`
            + `(Valid colours: ${validColours})`
        )
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
        problems.push(
            `$Part {name} has invalid quantity: ${quantity} must be an integer greater than 0`
        );
    }

    return problems;
}

export const genDefaultParts = (files: File[]): PartOrder[] => files.map((file, i) => ({
    file,
    notes: "",
    quantity: 1,
    settings: {
        color: '',
        infill: 0.2,
        resolution: 200
    }
}));

export const getShippingDetails = (type: ShippingType): [string, number] => {
    switch (type) {
        case ShippingType.Standard:
            return ["Standard 1-2 days", 5]
        case ShippingType.Expedited:
            return ["Guaranteed Next Day", 15]
    }

}

export const genDefaultOrder = (files: File[]): Order => {

    const order: Order = {
        userId: null,
        shippingType: ShippingType.Standard,
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
        price: null,
        expectedShipping: null,
        trackingLink: null,
    };

    return order;
}