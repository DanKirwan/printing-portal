import Loading from "@src/components/Loading";
import { OrderEditor } from "@src/components/OrderEditor";
import { handleOrderGet } from "@src/lib/appUtils";
import { AdminOrderViewerPC } from "@src/pageComponents/AdminOrderViewer.pc";
import NewOrderSummaryPC from "@src/pageComponents/NewOrderSummary.pc";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { suspend } from "suspend-react";

export default () => {
    const { orderId } = useParams<{ orderId: string }>();
    if (!orderId) throw "No id provided to load order";
    const order = suspend(() => handleOrderGet(orderId), [orderId]);
    // TODO (Convert to not using order editor but order viewer)
    return (
        <Suspense fallback={<Loading />}>

            <AdminOrderViewerPC order={{ ...order, id: orderId }} />
        </Suspense>
    )
}