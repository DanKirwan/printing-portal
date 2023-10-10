/* eslint-disable indent */
/* eslint-disable max-len */
import mjml2html from 'mjml';
import { Address, DBOrder } from './types';


const basicHeader = `
<mj-head>
  <mj-attributes>
  
    <mj-all font-family='Mulish,Helvetica, Arial, Sans-Serif, serif'/>
  </mj-attributes>
  
</mj-head>
`;

const headerStyle = 'font-size="20px"  align="center" font-weight="bold" text-transform="uppercase"';

// TODO unify across this and non functions code
const darkGrey = '#504c4c';
// const lightGrey = '#eceff1';
// const background = 'white';
// const blue = '#501cfc';
// const red = '#a42117';
// const contrastText = '#fff';

const buildAddress = (address: Address) => {
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  return `
  <mj-text line-height="1px" font-size="12px" color="${darkGrey}" font-weight="bold">${firstName} ${lastName}</mj-text>
  <mj-text line-height="1px" font-size="12px" color="${darkGrey}" font-family="helvetica">${line1}</mj-text>
  <mj-text line-height="1px" font-size="12px" color="${darkGrey}" font-family="helvetica">${line2}</mj-text>
  <mj-text line-height="1px" font-size="12px" color="${darkGrey}" font-family="helvetica">${city}</mj-text>
  <mj-text line-height="1px" font-size="12px" color="${darkGrey}" font-family="helvetica">${county}</mj-text>
  <mj-text line-height="1px" font-size="12px" color="${darkGrey}" font-family="helvetica">${postCode}</mj-text>
  `;
};


const buildLink = (baseUrl: string, orderId: string) => {
  const link = `${baseUrl}/orders/${orderId}`;
  return `
  <mj-text align='center' line-height="1px" font-size="16px" color=${darkGrey}">Order Link:</mj-text>
  <mj-text align='center' font-size="8px" href="${link}"  color=${darkGrey}">${link}</mj-text>
  `;
};
const buildOrderDetails = (order: DBOrder) => {
  const { address, lead, price } = order;
  return `
  <mj-text font-size="16px" color="${darkGrey}" font-weight="bold">Quoted Order Price</mj-text>
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">£${price?.toFixed(2)}</mj-text>

  <mj-text font-size="16px" color="${darkGrey}" font-weight="bold">Address</mj-text>
  ${buildAddress(address)}

  <mj-text font-size="16px" color="${darkGrey}" font-weight="bold">Expected Lead Time</mj-text>
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${lead} days</mj-text>
  `;
};


export const buildConfirmationEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead } = order;
  const { firstName } = address;

  return mjml2html(`<mjml>
    ${basicHeader}
    <mj-body background-color=white>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text color="${darkGrey}" ${headerStyle} >Order Confirmed</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
            Thank you for submitting your order! We have received it and our team will now review and approve it. An
            invoice will be sent to you shortly and upon receipt of payment, your order will be moved into
            production. We appreciate your business and look forward to fulfilling your order.
          </mj-text>
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text color="${darkGrey}" ${headerStyle} >Tracking</mj-text>
          ${buildLink(baseUrl, orderId)}
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text color="${darkGrey}" ${headerStyle}>Shipping Details</mj-text>
          <mj-text font-size="16px" color="${darkGrey}" font-weight="bold">Address</mj-text>
          ${buildAddress(address)}

          <mj-text font-size="16px" color="${darkGrey}" font-weight="bold">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${lead} days</mj-text>


          
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildAcceptEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead, price } = order;
  const { firstName } = address;

  return mjml2html(`<mjml>
    ${basicHeader}
    <mj-body background-color=white>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text color="${darkGrey}" ${headerStyle}>Order Accepted</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
              Your order has been accepted! We have quoted your order at £${price?.toFixed(2)} with a lead time 
              of ${lead} days for production. Please do not hesitate to contact us with any questions,
              an invoice will follow shortly.
          </mj-text>
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text color="${darkGrey}" ${headerStyle}>Tracking</mj-text>

          ${buildLink(baseUrl, orderId)}
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text color="${darkGrey}" ${headerStyle}>Order Details</mj-text>
          ${buildOrderDetails(order)}
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildProcessEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address } = order;
  const { firstName } = address;

  return mjml2html(`<mjml>
    ${basicHeader}
    <mj-body background-color=white>
    
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text color="${darkGrey}" ${headerStyle}>Order In Production</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
              Your payment has been recieved and your order is under production!
              Your order is currently being printed in our production facility and will be shipped once completed.
          </mj-text>
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text color="${darkGrey}" ${headerStyle}>Tracking</mj-text>
          ${buildLink(baseUrl, orderId)}
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text color="${darkGrey}" ${headerStyle}>Order Details</mj-text>
          ${buildOrderDetails(order)}

        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildShippingEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, trackingLink } = order;
  const { firstName } = address;

  const trackingButton = trackingLink ?

    `
    <mj-text align='center' line-height="1px" font-size="16px" color=${darkGrey}">Tracking Link:</mj-text>
    <mj-text align='center' font-size="8px" href="${trackingLink}"  color=${darkGrey}">${trackingLink}</mj-text>
    ` :
    '';

  return mjml2html(`<mjml>
    ${basicHeader}
    <mj-body background-color=white>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text color="${darkGrey}" ${headerStyle}>Order Shipped</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
              Your order is on the way! 
          </mj-text>

          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text  color="${darkGrey}" ${headerStyle}>Tracking</mj-text>

        
          ${trackingButton}
          ${buildLink(baseUrl, orderId)}
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text color="${darkGrey}" ${headerStyle}>Order Details</mj-text>
          ${buildOrderDetails(order)}
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};
