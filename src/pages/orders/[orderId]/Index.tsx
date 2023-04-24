import { Stack, Typography } from "@mui/material";
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
    const order = suspend(() => handleOrderGet(orderId).catch(e => {
        console.error(e);
        const isPermissionError = JSON.stringify(e).includes('permission');
        console.log(JSON.stringify(e));
        return {
            error: isPermissionError ?
                "Missing or insufficient permissions to view this order" :
                "Please try again or contact support at support@henleyprint3d.com"
        };
    }), [orderId]);
    return (
        <Suspense fallback={<Loading />}>
            {'error' in order ?

                <Stack width='100%' height='100%' justifyContent='center' alignItems='center'>
                    <Typography variant='h6' textAlign='center'>We apologise but this order is not available to view.</Typography>
                    <Typography>{order.error}</Typography>
                </Stack> :
                <AdminOrderViewerPC order={{ ...order, id: orderId }} />
            }
        </Suspense>
    )
}