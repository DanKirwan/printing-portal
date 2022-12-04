import { CollectionReference, DocumentReference, onSnapshot, Query, QueryDocumentSnapshot } from "firebase/firestore";
import { DocumentSnapshot } from "firebase/firestore/lite";
import { DependencyList, useEffect, useRef, useState } from "react";
import { WithId } from "./utils";

export const useCollection = <T>(collection: CollectionReference<T>): [T[], boolean] => {
    const [elements, setElements] = useState<T[]>();

    useEffect(() => {
        const unsub = onSnapshot(collection, docs => {
            const es: T[] = [];
            docs.forEach(doc => es.push(doc.data()));
            setElements(es);
        });

        return () => unsub();
    }, []);

    return [elements ?? [], !elements];
}
export const useCollectionWithIds = <T>(collection: CollectionReference<T>): [WithId<T>[], boolean] => {
    const [elements, setElements] = useState<WithId<T>[]>();

    useEffect(() => {
        const unsub = onSnapshot(collection, docs => {
            const es: WithId<T>[] = [];
            docs.forEach(doc => es.push({ ...doc.data(), id: doc.id }));
            setElements(es);
        });

        return () => unsub();
    }, []);

    return [elements ?? [], !elements];
}

export const useSnapshot = <T>(collection: CollectionReference<T>): [QueryDocumentSnapshot<T>[], boolean] => {
    const [elements, setElements] = useState<QueryDocumentSnapshot<T>[]>();

    useEffect(() => {
        const unsub = onSnapshot(collection, doc => {
            const es: QueryDocumentSnapshot<T>[] = [];
            doc.forEach(doc => es.push(doc));
            setElements(es);
        });
        return () => unsub();
    }, []);

    return [elements ?? [], !elements];
}

export const useDocSnapshot = <T>(document: DocumentReference<T> | null, deps: DependencyList = []): DocumentSnapshot<T> | undefined => {
    const [docData, setDocData] = useState<DocumentSnapshot<T>>();

    useEffect(() => {
        if (!document) return;
        const unsub = onSnapshot(document, doc => setDocData(doc));
        return () => unsub();
    }, deps);

    return docData;
}


export const useDocument = <T>(document: DocumentReference<T> | null, deps: DependencyList = []): T | undefined => {
    const [docData, setDocData] = useState<T>();

    useEffect(() => {
        if (!document) return;
        const unsub = onSnapshot(document, doc => setDocData(doc.data()));
        return () => unsub();
    }, deps);

    return docData;
}

/** Live updates to a query - returns isLoading false if passed null */
export const useQuery = <T>(query: Query<T> | null, deps: DependencyList = []): [QueryDocumentSnapshot<T>[], boolean] => {
    const [elements, setElements] = useState<QueryDocumentSnapshot<T>[]>();

    useEffect(() => {
        if (!query) return;
        const unsub = onSnapshot(query, querySnapshot => {
            const es: QueryDocumentSnapshot<T>[] = [];
            querySnapshot.forEach(querySnapshot => es.push(querySnapshot));
            setElements(es);
        });
        return () => unsub();
    }, deps);

    return [elements ?? [], !elements && !!query];
}


export const useInterval = (callback: () => any, delay: number) => {
    const savedCallback = useRef<() => any>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (!savedCallback.current) throw "Cannot run an interval without a callback";
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export const useTime = (interval: number) => {
    const [time, setTime] = useState(Date.now());
    useInterval(() => setTime(Date.now()), interval);

    return new Date(time);
}
