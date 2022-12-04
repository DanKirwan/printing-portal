import Loading from "@src/components/Loading";
import { getOrder } from "@src/lib/uploadUtils";
import OrderSummaryPC from "@src/pageComponents/OrderSummary.pc";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { suspend } from "suspend-react";

export default () => {
    const { orderId } = useParams<{ orderId: string }>();
    if (!orderId) throw "No id provided to load order";
    const order = suspend(() => getOrder(orderId), [orderId]);
    return (
        <Suspense fallback={<Loading />}>

            <OrderSummaryPC order={order} />
        </Suspense>
    )
}