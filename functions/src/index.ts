/* eslint-disable indent */
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
import {
    buildAcceptEmail,
    buildConfirmationEmail,
    buildProcessEmail,
    buildShippingEmail,
} from './emails';
import { DBOrder, OrderStatus } from './types';

// Define some parameters
const mailPort = defineInt('MAIL_PORT');
const mailHost = defineString('MAIL_HOST');
const mailUser = defineString('MAIL_USER');
const mailPassword = defineString('MAIL_PASSWORD');
const baseUrl = defineString('BASE_URL');
// This is the email address that should be alerted every time a new order added
const alertEmail = defineString('ALERT_EMAIL');


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

        const adminUrl = `${baseUrl.value()}/admin/${orderId}`;
        await transporter.sendMail({
            from: '"Henley Print 3D" <order@henleyprint3d.com>',
            to: alertEmail.value(),
            subject: 'New order alert',
            html: `<a href="${adminUrl}">Click here to view</a>`,
        });
    });


export const orderUpdateEmail = functions
    .firestore
    .document('orders/{orderId}')
    .onUpdate(async (snap, context) => {
        const order = snap.after.data() as DBOrder;
        const { status } = order;
        const orderId = context.params.orderId;
        functions.logger
            .log(`Order Updated: ${status}`, context.params.orderId, order);

        const transporter = createTransport({
            host: mailHost.value(),
            port: mailPort.value(),
            secure: false,
            auth: {
                user: mailUser.value(),
                pass: mailPassword.value(),
            },
        });

        const url = baseUrl.value();

        switch (order.status) {
            case OrderStatus.Accepted:
                await transporter.sendMail({
                    from: '"Henley Print 3D" <order@henleyprint3d.com>',
                    to: order.email,
                    subject: 'Order Accepted',
                    html: buildAcceptEmail(order, url, orderId).html,
                });
                break;

            case OrderStatus.Processing:
                await transporter.sendMail({
                    from: '"Henley Print 3D" <order@henleyprint3d.com>',
                    to: order.email,
                    subject: 'Order In Production',
                    html: buildProcessEmail(order, url, orderId).html,
                });
                break;

            case OrderStatus.Shipped:
                await transporter.sendMail({
                    from: '"Henley Print 3D" <order@henleyprint3d.com>',
                    to: order.email,
                    subject: 'Order Shipped',
                    html: buildShippingEmail(order, url, orderId).html,
                });
                break;
        }
    });
