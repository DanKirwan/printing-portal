import { Timestamp } from "firebase/firestore"


export enum OrderStatus {
    Incoming, // These are orders which are yet to be assigned a price or confirmed
    Processing, // These are paid and in production 
    Deleted,
    Completed, // These have confirmed delivery
    Shipped,
    Accepted // This have been accepted and therefore will move to paid and in production after payment recieved 
}

export enum ShippingType {
    Standard = 'Standard',
    Expedited = 'Expedited',
}



export type Order = {
    address: Address,
    shippingType: ShippingType,
    status: OrderStatus,
    email: string,
    desc: string,
    parts: PartOrder[],
    ordered: Timestamp,
    lead: number,
    settings: OrderSettings,
    userId: string | null,
    // Private Settings
    price: number | null,
    expectedShipping: Timestamp | null
}

export type PartOrder = {
    file: File,
    quantity: number,
    notes: string,
    settings: PartSettings,
}

export type OrderSettings = {
    material: string,
}


export type PartSettings = {
    color: string,
    resolution: number, // layer height in um
    infill: number, // a number between 0 and 1 representing decimal infil

}


export type Address = {
    firstName: string,
    lastName: string,

    city: string,
    countryCode: string,
    line1: string,
    line2?: string,
    postCode: string,
    county: string,
}

export type Email = {
    to: string,
    message: {
        subject: string,
        html: string
    }
};

export type Material = {
    name: string,
    description: string,
    colors: Color[],
    pricePerKg: number,
    density: number, // In kg/m3
    priority?: number, // This is the order in which materials will be shown
};


export type Color = {
    name: string,
    available: boolean,
}


export type DBPart = Omit<PartOrder, 'file'> & { fileName: string };

export type DBOrder = Omit<Order, 'parts'> & { parts: DBPart[] };



export const collections = {
    orders: 'orders',
    materials: 'materials',
    emails: 'emails',
};

