import { Timestamp } from "firebase/firestore"

export type Order = {
    address: Address,
    completed: boolean,
    processing: boolean,
    email: string,
    desc: string,
    parts: PartOrder[],
    ordered: Timestamp,
    lead: number,
    settings: OrderSettings,
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