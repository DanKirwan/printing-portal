import { Button, IconButton, Stack, Typography } from "@mui/material";
import Loading from "@src/components/Loading";
import { OrderNavigationBar } from "@src/components/orders/OrderNavigationBar";
import { OrderProgressBar } from "@src/components/orders/OrderProgressBar";
import { useAuth } from "@src/contexts/AuthContext";
import { handleOrderGet } from "@src/lib/appUtils";
import { Providers, SignInWithSocialMedia } from "@src/lib/firebaseUtils";
import { OrderViewerPC } from "@src/pageComponents/OrderViewer.pc";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { suspend } from "suspend-react";

export default () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { uid } = useAuth();
    const navigate = useNavigate();
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

    const handleSignIn = async () => {
        await SignInWithSocialMedia(Providers.google);
        window.location.reload();
    }


    return (
        <Suspense fallback={<Loading />}>
            {'error' in order ?

                <Stack width='100%' height='100%' justifyContent='center' alignItems='center'>
                    <Typography variant='h6' textAlign='center'>We apologise but this order is not available to view.</Typography>
                    <Typography>{order.error}</Typography>
                    {!uid && <Button onClick={handleSignIn} variant='contained' sx={{ marginY: 3, padding: 2 }}>Click Here to Log In</Button>}
                </Stack> :
                <Stack>
                    <OrderNavigationBar status={order.status} />
                    <OrderViewerPC order={{ ...order, id: orderId }} />
                </Stack>
            }
        </Suspense >
    )
}