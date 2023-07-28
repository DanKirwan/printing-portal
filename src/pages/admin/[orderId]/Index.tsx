import { Stack } from "@mui/material";
import Loading from "@src/components/Loading";
import { OrderEditor } from "@src/components/OrderEditor";
import { OrderNavigationBar } from "@src/components/orders/OrderNavigationBar";
import { handleOrderGet, handleOrderMetadataUpdate, handleOrderUpdate } from "@src/lib/appUtils";
import { DBPart, Order } from "@src/lib/types";
import { AdminOrderEditorPC } from "@src/pageComponents/AdminOrderEditor.pc";
import { OrderViewerPC } from "@src/pageComponents/OrderViewer";
import { Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { suspend } from "suspend-react";

export default () => {
    const { orderId } = useParams<{ orderId: string }>();
    if (!orderId) throw "No id provided to load order";
    const order = suspend(() => handleOrderGet(orderId), [orderId]);

    const handleUpdateOrder = async (order: Order) => {
        try {

            await handleOrderUpdate(orderId, order);
        } catch (error: any) {
            alert("Failed to update your order - please try again or contact support");
            console.error(error);
        }
    }

    const handleUpdateMetadata = async (order: Omit<Order, 'parts'>, partMetadata: DBPart[]) => {
        try {
            await handleOrderMetadataUpdate(orderId, order, partMetadata);
        } catch (error: any) {
            alert("Failed to update your order - please try again or contact support");
            console.error(error);
        }
    }

    return (
        <Suspense fallback={<Loading />}>
            <Stack>
                <OrderNavigationBar status={order.status} />
                <AdminOrderEditorPC
                    initialOrder={{ ...order, id: orderId }}
                    saveChanges={handleUpdateOrder}
                    saveMetadata={handleUpdateMetadata}
                />
            </Stack>
        </Suspense>
    )
}