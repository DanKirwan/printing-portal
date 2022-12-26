import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment,
    RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { getTypedFirestore } from "@src/lib/types";
import { genDefaultOrder } from "@src/lib/orderUtils";
import { getOrder, uploadOrder } from "@src/lib/uploadUtils";
import fs from 'fs';
import { test, assert } from 'vitest';

let testEnv = await initializeTestEnvironment({
    projectId: "demo-project-1234",
    hub: {
        host: 'localhost',
        port: 4400
    },
    firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
    },
});



test("Can Add Order", async () => {
    const rouge = testEnv.unauthenticatedContext();
    const firestore = rouge.firestore();
    console.log(fs);
    if (!firestore) throw "No firestore running";
    const typedFirestore = getTypedFirestore(firestore);
    const storage = rouge.storage();

    if (!firestore || !storage) throw "Emulators not set up";

    const defaultOrder = genDefaultOrder([]);
    const orderId = await uploadOrder(defaultOrder, null, typedFirestore, storage);
    const fromDB = await getOrder(orderId, typedFirestore, storage);

    assert.deepEqual(defaultOrder, fromDB);
})