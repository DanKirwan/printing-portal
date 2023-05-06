import * as functions from 'firebase-functions';
import { createTransport } from 'nodemailer';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { defineInt, defineString } from 'firebase-functions/v2/params';
import { buildConfirmationEmail } from './emails';
import { DBOrder } from './types';

// Define some parameters
const mailPort = defineInt('MAIL_PORT');
const mailHost = defineString('MAIL_HOST');
const mailUser = defineString('MAIL_USER');
const mailPassword = defineString('MAIL_PASSWORD');
const baseUrl = defineString('BASE_URL');


export const triggerEmail = functions
    .firestore
    .document('orders/{orderId}')
    .onCreate(async (snap, context) => {
        const order = snap.data() as DBOrder;
        const orderId = context.params.orderId;
        functions.logger
            .log('New Order Created', context.params.orderId, order);

        const transporter = createTransport({
            host: mailHost.value(),
            port: mailPort.value(),
            secure: false,
            auth: {
                user: mailUser.value(),
                pass: mailPassword.value(),
            },
        });

        await transporter.sendMail({
            from: '"Henley Print" 3D <order@henleyprint3d.com>',
            to: order.email,
            subject: 'Order Confirmation',
            html: buildConfirmationEmail(order, baseUrl.value(), orderId).html,
        });
    });
