import { OrdersTable } from "@src/components/orders/OrdersTable"
import { getDB } from "@src/lib/firebaseUtils";
import { useCollectionWithIds, useSnapshot } from "@src/lib/hooks"

export default () => {
    const [orders, loading] = useCollectionWithIds(getDB().orders);


    return (
        <OrdersTable orders={orders} />
    )
}