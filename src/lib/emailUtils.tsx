import { uuidv4 } from '@firebase/util';
import { Typography } from '@mui/material';
import { AddressViewer } from '@src/components/shipping/AddressViewer';
import { setDoc, doc } from 'firebase/firestore';
import { renderEmail, Email as EmailComponent, Item, Span } from 'react-html-email';
import { DBCollections, DBOrder, Email, Order } from './types';
import { WithId } from './utils';

export const renderBasicEmail = (order: WithId<DBOrder>) => {
    const { address, price, id, } = order;
    const { firstName } = address;

    const confirmationAddress = `${import.meta.env.VITE_PUBLISHED_URL}/orders/${id}/confirmation`;
    return renderEmail(
        <EmailComponent title='Order Confirmation' >
            <Item>
                <Span fontSize={15}>Hi {firstName},</Span>
                <Span fontSize={15}>Your order {price ? `of £${price} ` : ''}has been confirmed. An invoice will follow this email shortly</Span>
            </Item>

            <Item>
                <Span fontSize={15}>
                    <a href={confirmationAddress}>
                        Click here to view your order
                    </a>
                </Span>
            </Item>

        </EmailComponent>
    )
}

export const uploadEmail = async (order: WithId<DBOrder>, db: DBCollections) => {
    const html = renderBasicEmail(order);
    const email: Email = {
        to: order.email,
        message: {
            subject: "Henley Print 3D Order Confirmation",
            html
        }
    };

    const uuid = uuidv4();
    await setDoc(doc(db.emails, uuid), Object.assign({}, email));
}