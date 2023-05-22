import { Button, IconButton, Stack, Typography } from "@mui/material";
import Loading from "@src/components/Loading";
import { OrderProgressBar } from "@src/components/orders/OrderProgressBar";
import { useAuth } from "@src/contexts/AuthContext";
import { handleOrderGet } from "@src/lib/appUtils";
import { Providers, SignInWithSocialMedia } from "@src/lib/firebaseUtils";
import { AdminOrderViewerPC } from "@src/pageComponents/AdminOrderViewer.pc";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { suspend } from "suspend-react";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
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

    const handleSignIn = () => {
        SignInWithSocialMedia(Providers.google);
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
                    <Stack direction='row' alignItems='center' spacing={2} paddingX={2}>
                        <IconButton onClick={() => navigate(-1)} sx={{ width: 50, height: 50 }} >
                            <ArrowBackRoundedIcon />
                        </IconButton>
                        <OrderProgressBar status={order.status} />
                        {/* This is just used for centering */}
                        <Stack style={{ width: '50px', height: '50px' }} />
                    </Stack>
                    <AdminOrderViewerPC order={{ ...order, id: orderId }} />
                </Stack>
            }
        </Suspense >
    )
}