import Loading from "@src/components/Loading";
import { OrderEditor } from "@src/components/OrderEditor";
import { getOrder } from "@src/lib/uploadUtils";
import NewOrderSummaryPC from "@src/pageComponents/NewOrderSummary.pc";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { suspend } from "suspend-react";

export default () => {
    const { orderId } = useParams<{ orderId: string }>();
    if (!orderId) throw "No id provided to load order";
    const order = suspend(() => getOrder(orderId), [orderId]);
    return (
        <Suspense fallback={<Loading />}>

            <OrderEditor order={order} onChange={() => null} />
        </Suspense>
    )
}