import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Tab, Tabs } from "@mui/material";
import { ConfirmButton } from "@src/components/generic/ConfirmButton";
import { OrdersTable } from "@src/components/orders/OrdersTable"
import { getDB } from "@src/lib/firebaseUtils";
import { useCollectionWithIds, useSnapshot } from "@src/lib/hooks"
import { Order, OrderStatus } from "@src/lib/types";
import { handleOrderUpdate } from "@src/lib/appUtils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AcceptOrderDialog } from "@src/components/admin/AcceptOrderDialog";
import { WithId } from "@src/lib/utils";
import { ProcessingOrderTable } from "@src/components/admin/ProcessingOrderTable";

export default () => {
    const [orders, loading] = useCollectionWithIds(getDB().orders);
    const [acceptingOrderIndex, setAcceptingOrderIndex] = useState<number | null>(null);

    const [tabIndex, setTabIndex] = useState(0);
    const incoming = orders.filter(order => order.status == OrderStatus.Incoming);
    const accepted = orders.filter(order => order.status == OrderStatus.Accepted);
    const processing = orders.filter(order => order.status == OrderStatus.Processing);
    const shipped = orders.filter(order => order.status == OrderStatus.Shipped);
    const completed = orders.filter(order => order.status == OrderStatus.Completed);
    const deleted = orders.filter(order => order.status == OrderStatus.Deleted);


    const navigate = useNavigate();

    const handleClick = (orderId: string) => {
        navigate(`/admin/${orderId}`);
    }

    const handleOrderAccept = async (order: Order) => {
        if (acceptingOrderIndex == null) throw "cannot accept without an order";
        const { id } = incoming[acceptingOrderIndex];

        await handleOrderUpdate(id, { ...order, status: OrderStatus.Accepted });
        setAcceptingOrderIndex(null);
        setTabIndex(OrderStatus.Accepted);

    }


    const getIncomingActions = (index: number) => {
        const order = incoming[index];

        const handleReject = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Deleted });
            setTabIndex(3);
        }


        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <Button onClick={handleReject} variant='contained' color='primary'>Reject</Button>
                <Button onClick={() => setAcceptingOrderIndex(index)} variant='contained' color='info'>Accept </Button>
                <Button onClick={() => handleClick(order.id)} variant='contained'>View</Button>
            </Stack>
        )

    }

    const getAcceptedActions = (index: number) => {
        const order = accepted[index];

        const handleReject = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Deleted });
            setTabIndex(OrderStatus.Deleted);
        }

        const handleStartProcessing = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Processing });
            setTabIndex(OrderStatus.Processing);
        }

        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <ConfirmButton
                    description='This order has alreay been accepted, make sure no payment has been made'
                    title='Confirm Order Rejection'
                    onConfirm={handleReject}
                >
                    Delete Order
                </ConfirmButton>
                <Button onClick={handleStartProcessing} variant='contained' color='info'>Start Processing</Button>
                <Button onClick={() => handleClick(order.id)} variant='contained'>View</Button>
            </Stack>
        )

    }


    const getShippedActions = (index: number) => {
        const order = shipped[index];
        const handleComplete = async () => {
            await handleOrderUpdate(order.id, { ...order, status: OrderStatus.Completed });
            setTabIndex(OrderStatus.Completed);
        }
        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <ConfirmButton
                    description='This order has alreay been shipped, are you sure you want to reject?'
                    title='Confirm Order Rejection'
                    onConfirm={() => handleOrderUpdate(order.id, { ...order, status: OrderStatus.Deleted })}
                >
                    Delete Order
                </ConfirmButton>
                <Button onClick={handleComplete} variant='contained'>Confirm Delivery</Button>
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
            setTabIndex(OrderStatus.Incoming);
        }
        return (
            <Stack direction='row' justifyContent='right' spacing={1}>
                <Button onClick={handleRecover} variant='contained'>
                    Recover to Incoming
                </Button>

            </Stack>
        )
    }

    const getTab = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Incoming:
                return <OrdersTable orders={incoming} getRowActions={getIncomingActions} />;
            case OrderStatus.Accepted:
                return <OrdersTable orders={accepted} getRowActions={getAcceptedActions} />;
            case OrderStatus.Processing:
                return <ProcessingOrderTable orders={processing} handleClick={handleClick} handleOrderUpdate={handleOrderUpdate} />;
            case OrderStatus.Shipped:
                return <OrdersTable orders={shipped} getRowActions={getShippedActions} />;
            case OrderStatus.Completed:
                return <OrdersTable orders={completed} getRowActions={getCompletedActions} />;
            case OrderStatus.Deleted:
                return <OrdersTable orders={deleted} getRowActions={getDeletedActions} />;
        }
    }

    return (
        <Stack>

            <Tabs value={tabIndex} onChange={(_, newTab) => setTabIndex(newTab)} aria-label="lab API tabs example">
                <Tab label="Incoming" value={OrderStatus.Incoming} />
                <Tab label="Awaiting Payment" value={OrderStatus.Accepted} />
                <Tab label="Processing" value={OrderStatus.Processing} />
                <Tab label="Shipped" value={OrderStatus.Shipped} />
                <Tab label="Completed" value={OrderStatus.Completed} />
                <Tab label="Deleted" value={OrderStatus.Deleted} />
            </Tabs>
            {getTab(tabIndex)}
            {acceptingOrderIndex != null &&
                <AcceptOrderDialog
                    open={acceptingOrderIndex != null}
                    onClose={() => setAcceptingOrderIndex(null)}
                    orderId={incoming[acceptingOrderIndex]?.id}
                    onAccept={handleOrderAccept}
                />
            }
        </Stack>

    )
}