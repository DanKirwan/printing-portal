import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Tab, Tabs } from "@mui/material";
import { ConfirmButton } from "@src/components/generic/ConfirmButton";
import { OrdersTable } from "@src/components/orders/OrdersTable"
import { getDB } from "@src/lib/firebaseUtils";
import { useCollectionWithIds, useSnapshot } from "@src/lib/hooks"
import { OrderStatus } from "@src/lib/types";
import { handleOrderUpdate } from "@src/lib/appUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
    const [orders, loading] = useCollectionWithIds(getDB().orders);

    const [tabIndex, setTabIndex] = useState(0);
    const incoming = orders.filter(order => order.status == OrderStatus.Incoming);
    const processing = orders.filter(order => order.status == OrderStatus.Processing);
    const completed = orders.filter(order => order.status == OrderStatus.Completed);
    const deleted = orders.filter(order => order.status == OrderStatus.Deleted);


    const navigate = useNavigate();

    const handleClick = (orderId: string) => {
        navigate(`/admin/${orderId}`);
    }


    const getIncomingActions = (index: number) => {
        const order = incoming[index];
        const handleAccept = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Processing });
            setTabIndex(1);
        }

        const handleReject = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Deleted });
            setTabIndex(3);
        }


        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <Button onClick={handleReject} variant='contained' color='primary'>Reject</Button>
                <Button onClick={handleAccept} variant='contained' color='info'>Accept </Button>
                <Button onClick={() => handleClick(order.id)} variant='contained'>View</Button>
            </Stack>
        )

    }

    const getProcessingActions = (index: number) => {
        const order = processing[index];
        const handleComplete = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Completed });
            setTabIndex(2);
        }
        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <ConfirmButton
                    description='This order has alreay been accepted, are you sure you want to reject?'
                    title='Confirm Order Rejection'
                    onConfirm={() => handleOrderUpdate(order.id, { ...order, status: OrderStatus.Deleted })}
                >
                    Delete Order
                </ConfirmButton>
                <Button onClick={handleComplete} variant='contained'>Mark Done</Button>
                <Button onClick={() => handleClick(order.id)} variant='contained'>View</Button>
            </Stack>
        )
    }

    const getCompletedActions = (index: number) => {
        const order = completed[index];

        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <Button onClick={() => handleClick(order.id)} variant='contained'>View</Button>
            </Stack>
        )
    }

    const getDeletedActions = (index: number) => {
        const order = deleted[index];
        const handleRecover = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Incoming });
            setTabIndex(0);
        }
        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <Button onClick={handleRecover} variant='contained'>
                    Recover to Incoming
                </Button>

            </Stack>
        )
    }

    return (
        <Stack>

            <Tabs value={tabIndex} onChange={(_, newTab) => setTabIndex(newTab)} aria-label="lab API tabs example">
                <Tab label="Incoming" value={0} />
                <Tab label="Processing" value={1} />
                <Tab label="Completed" value={2} />
                <Tab label="Deleted" value={3} />
            </Tabs>
            {tabIndex == 0 && <OrdersTable orders={incoming} getRowActions={getIncomingActions} />}

            {tabIndex == 1 && <OrdersTable orders={processing} getRowActions={getProcessingActions} />}

            {tabIndex == 2 && <OrdersTable orders={completed} getRowActions={getCompletedActions} />}

            {tabIndex == 3 && <OrdersTable orders={deleted} getRowActions={getDeletedActions} />}
        </Stack>

    )
}