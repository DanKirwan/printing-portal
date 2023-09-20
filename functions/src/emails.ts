/* eslint-disable indent */
/* eslint-disable max-len */
import mjml2html from 'mjml';
import { Address, DBOrder } from './types';

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
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${firstName} ${lastName}</mj-text>
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line1}</mj-text>
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line2}</mj-text>
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${city}</mj-text>
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${county}</mj-text>
  <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${postCode}</mj-text>
  `;
};

export const buildConfirmationEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead } = order;
  const { firstName } = address;

  return mjml2html(`<mjml>
    <mj-body background-color=white>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center' fontWeight='bold'>Order Confirmed</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
              Thank you for submitting your order! We have received it and our team will now review and approve it. An
            invoice will be sent to you shortly and upon receipt of payment, your order will be moved into
            production. We appreciate your business and look forward to fulfilling your order.
          </mj-text>
        
          <mj-button href="${baseUrl}/orders/${orderId}" background-color=${darkGrey}">View Order</mj-button>
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Address</mj-text>
          ${buildAddress(address)}

          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${lead} days</mj-text>


          
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildAcceptEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead, price } = order;
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  return mjml2html(`<mjml>
    <mj-body background-color=white>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center' fontWeight='bold'>Order Accepted</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
              Your order has been accepted! We have quoted your order at £${price} with a lead time 
              of ${lead} days for production. Please do not hesitate to contact us with any questions,
              an invoice will follow shortly.
          </mj-text>
        
          <mj-button href="${baseUrl}/orders/${orderId}" background-color=${darkGrey}">Click To View Order</mj-button>
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Address</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${firstName} ${lastName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line1}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line2}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${city}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${county}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${postCode}</mj-text>

          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${lead} days</mj-text>

          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Quoted Order Price</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">£${price}</mj-text>

        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildProcessEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead, price } = order;
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  return mjml2html(`<mjml>
    <mj-body background-color=white>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center' fontWeight='bold'>Order In Production</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
              Your payment has been recieved and your under is under production!
              Your order is currently being printed in our production facility and will be shipped once completed.
          </mj-text>
        
          <mj-button href="${baseUrl}/orders/${orderId}" background-color="${darkGrey}">Click To View Order</mj-button>
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Address</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${firstName} ${lastName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line1}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line2}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${city}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${county}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${postCode}</mj-text>

          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${lead} days</mj-text>

          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Quoted Order Price</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">£${price}</mj-text>

        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildShippingEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead, price, trackingLink } = order;
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  const trackingButton = trackingLink ?
    `<mj-button href="${trackingLink}" background-color=${darkGrey}">Click To Track Order</mj-button>` :
    '';

  return mjml2html(`<mjml>
    <mj-body background-color=white>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="${darkGrey}"></mj-divider>
  
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center' fontWeight='bold'>Order Shipped!</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">
              Your order is on the way! 
          </mj-text>
        
          ${trackingButton}
          <mj-button href="${baseUrl}/orders/${orderId}" background-color=${darkGrey}">Click To View Order</mj-button>
          <mj-divider border-color="${darkGrey}"></mj-divider>
          <mj-text font-size="20px" color="${darkGrey}" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Address</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${firstName} ${lastName}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line1}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${line2}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${city}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${county}</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${postCode}</mj-text>

          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">${lead} days</mj-text>

          <mj-text font-size="16px" color="${darkGrey}" font-family="helvetica">Quoted Order Price</mj-text>
          <mj-text font-size="12px" color="${darkGrey}" font-family="helvetica">£${price}</mj-text>

        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};
