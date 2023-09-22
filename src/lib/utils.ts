import { FC, PropsWithChildren } from "react";

export type FCC<T = unknown> = FC<PropsWithChildren<T>>;

export const getFileFromUrl = async (url: string, name: string, defaultType = 'image/jpeg') => {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], name, {
        type: data.type || defaultType,
    });
}

export const getEnumValues = <T extends object>(e: T): T[] => Object
    .values(e)
    .filter(v => isNaN(Number(v)));

export const pluralise = (value: number, suffix: string) => `${value} ${suffix}${value == 1 ? '' : 's'}`;

export type WithId<T> = T & { id: string };

// Converts a key, value array to a tuple array
export const tupalize = <A, B>(entries: { key: A, value: B }[]): [A, B][] => entries.map(({ key, value }) => [key, value]);