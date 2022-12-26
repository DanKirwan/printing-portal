import { Stack, Button, Typography } from "@mui/material";
import { OrdersTable } from "@src/components/orders/OrdersTable"
import { useAuth } from "@src/contexts/AuthContext";
import { SignInWithSocialMedia, Providers, getDB } from "@src/lib/firebaseUtils";
import { useQuery } from "@src/lib/hooks";
import { DBOrder } from "@src/lib/types";
import { WithId } from "@src/lib/utils";
import { query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default () => {
    const { uid } = useAuth();

    const [orderSnapshots, loadingOrders] = useQuery(query(getDB().orders, where("userId", "==", uid)));
    const orders: WithId<DBOrder>[] = orderSnapshots.map(s => ({ ...s.data(), id: s.id }));
    const navigate = useNavigate();

    const handleClick = (orderId: string) => {
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