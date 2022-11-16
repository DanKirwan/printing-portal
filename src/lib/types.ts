export type Order = {
    email: string,
    desc: string,
    parts: PartOrder[],
    ordered: Date,
    lead: number
}

export type PartOrder = {
    file: File,
    quantity: number,
    notes: string,
    settings: PartSettings
}

export type PartSettings = {
    material: string,
    resolution: number, // layer height in um
    infill: number, // a number between 0 and 1 representing decimal infil
    color: string,

}
