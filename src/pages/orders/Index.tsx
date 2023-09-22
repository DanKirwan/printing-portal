import { Stack, Button, Typography } from "@mui/material";
import { OrdersTable } from "@src/components/orders/OrdersTable"
import { useAuth } from "@src/contexts/AuthContext";
import { EventTypes } from "@src/lib/analytics";
import { SignInWithSocialMedia, Providers, getDB } from "@src/lib/firebaseUtils";
import { useQuery } from "@src/lib/hooks";
import { DBOrder } from "@src/lib/types";
import { WithId } from "@src/lib/utils";
import { analytics } from "@src/main";
import { logEvent } from "firebase/analytics";
import { query, where } from "firebase/firestore";
import { orderBy } from "lodash";
import { useNavigate } from "react-router-dom";

const timesortOrders = (orders: WithId<DBOrder>[]) => orderBy(orders, o => o.ordered.seconds, 'desc');

export default () => {
    const { uid } = useAuth();

    const [orderSnapshots, loadingOrders] = useQuery(query(getDB().orders, where("userId", "==", uid)));
    const orders: WithId<DBOrder>[] = timesortOrders(orderSnapshots.map(s => ({ ...s.data(), id: s.id })));
    const navigate = useNavigate();

    const handleClick = (orderId: string) => {
        logEvent(analytics, EventTypes.ViewOrder);
        navigate(`/orders/${orderId}`);
    }


    const getActions = (index: number) => {
        const order = orders[index];

        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <Button onClick={() => handleClick(order.id)} variant='contained'>View</Button>
            </Stack>
        )
    }

    if (!uid) return (
        <Stack alignItems='center' padding={2} spacing={2}>
            <Typography variant='h3'>Not Logged in!</Typography>
            <Typography variant='h6'>You must be logged in to view orders</Typography>
            <Button onClick={() => SignInWithSocialMedia(Providers.google)} variant='contained'>Login</Button>
        </Stack>
    )

    return (
        <OrdersTable orders={orders} getRowActions={getActions} />
    )
}