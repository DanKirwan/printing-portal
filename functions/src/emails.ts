/* eslint-disable indent */
/* eslint-disable max-len */
import { DBOrder } from './types';
import mjml2html from 'mjml';


export const buildConfirmationEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead } = order;
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  return mjml2html(`<mjml>
    <mj-body background-color=black>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="#F45E43"></mj-divider>
  
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Order Confirmed</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">
              Thank you for submitting your order! We have received it and our team will now review and approve it. An
            invoice will be sent to you shortly and upon receipt of payment, your order will be moved into
            production. We appreciate your business and look forward to fulfilling your order.
          </mj-text>
        
          <mj-button href="${baseUrl}/orders/${orderId}/confirmation" background-color="F45E43">Click To View Order</mj-button>
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Address</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${firstName} ${lastName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line1}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line2}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${city}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${county}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${postCode}</mj-text>

          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${lead} days</mj-text>


          
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildAcceptEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead, price } = order;
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  return mjml2html(`<mjml>
    <mj-body background-color=black>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="#F45E43"></mj-divider>
  
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Order Accepted</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">
              Your order has been accepted! We have quoted your order at £${price} with a lead time 
              of ${lead} days for production. Please do not hesitate to contact us with any questions,
              an invoice will follow shortly.
          </mj-text>
        
          <mj-button href="${baseUrl}/orders/${orderId}" background-color="F45E43">Click To View Order</mj-button>
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Address</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${firstName} ${lastName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line1}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line2}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${city}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${county}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${postCode}</mj-text>

          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${lead} days</mj-text>

          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Quoted Order Price</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">£${price}</mj-text>

        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildProcessEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead, price } = order;
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  return mjml2html(`<mjml>
    <mj-body background-color=black>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="#F45E43"></mj-divider>
  
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Order In Production</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">
              Your payment has been recieved and your under is under production!
              Your order is currently being printed in our production facility and will be shipped once completed.
          </mj-text>
        
          <mj-button href="${baseUrl}/orders/${orderId}" background-color="F45E43">Click To View Order</mj-button>
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Address</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${firstName} ${lastName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line1}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line2}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${city}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${county}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${postCode}</mj-text>

          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${lead} days</mj-text>

          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Quoted Order Price</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">£${price}</mj-text>

        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};


export const buildShippingEmail = (order: DBOrder, baseUrl: string, orderId: string) => {
  const { address, lead, price, trackingLink } = order;
  const { firstName, lastName, line1, line2, city, county, postCode } = address;

  const trackingButton = trackingLink ?
    `<mj-button href="${trackingLink}" background-color="F45E43">Click To Track Order</mj-button>` :
    '';

  return mjml2html(`<mjml>
    <mj-body background-color=black>
      <mj-section>
        <mj-column>
  
          <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>
  
          <mj-divider border-color="#F45E43"></mj-divider>
  
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Order Shipped!</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">Dear ${firstName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">
              Your order is on the way! 
          </mj-text>
        
          ${trackingButton}
          <mj-button href="${baseUrl}/orders/${orderId}" background-color="F45E43">Click To View Order</mj-button>
          <mj-divider border-color="#F45E43"></mj-divider>
          <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Shipping Details</mj-text>
          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Address</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${firstName} ${lastName}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line1}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${line2}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${city}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${county}</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${postCode}</mj-text>

          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Expected Lead Time</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">${lead} days</mj-text>

          <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Quoted Order Price</mj-text>
          <mj-text font-size="12px" color="#F45E43" font-family="helvetica">£${price}</mj-text>

        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`);
};