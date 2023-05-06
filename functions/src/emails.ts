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
    // return mjml2html(`<html>

    //     <body style="margin:0;">
    //         <div
    //             style="width: 100vw;color: white; display: flex; flex-direction: column; align-items: center; background: black;height:100vh;font-family:monospace;">
    //             <img src="https://order.henleyprint3d.com/favicon.png" width="200px" />
    //             <h2>Order Submitted</h2>
    //             <div style="width: 80%;">
    //                 <p>Dear ${firstName},</p>
    //                 <p>
    //                     Thank you for submitting your order! We have received it and our team will now review and approve it. An
    //                     invoice will be sent to you shortly and upon receipt of payment, your order will be moved into
    //                     production. We appreciate your business and look forward to fulfilling your order.
    //                 </p>
    //             </div>
    //             <a href="${baseUrl}/orders/${orderId}/confirmation" style="width:80%;margin:20px;color:white;">
    //                 <div
    //                     style="background: red; padding: 20px; border-radius: 5px; width:auto;display:flex;align-items: center;justify-content: center;">
    //                     Click here to view your order
    //                 </div>
    //             </a>
    //             <hr>

    //             <h2>Shipping Details</h2>
    //             <div style="width: 80%;">
    //                 <h3>Address</h3>
    //                 <p>${firstName} ${lastName}</p>
    //                 <p>${line1}</p>
    //                 <p>${line2}</p>
    //                 <p>${city}</p>
    //                 <p>${county}</p>
    //                 <p>${postCode}</p>

    //                 <h3>Expected Lead Time</h3>
    //                 <p>${lead ?? '2 Days'}</p>
    //             </div>
    //         </div>
    //     </body>
    // </html>`);
};


// <mjml>
// <mj-body background-color=black>
//   <mj-section>
//     <mj-column>

//       <mj-image width="100px" src="https://order.henleyprint3d.com/favicon.png"></mj-image>

//       <mj-divider border-color="#F45E43"></mj-divider>

//       <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Order Confirmed</mj-text>
//       <mj-text font-size="12px" color="#F45E43" font-family="helvetica">Dear ${firstName}</mj-text>
//       <mj-text font-size="12px" color="#F45E43" font-family="helvetica">
//           Thank you for submitting your order! We have received it and our team will now review and approve it. An
//         invoice will be sent to you shortly and upon receipt of payment, your order will be moved into
//         production. We appreciate your business and look forward to fulfilling your order.
//       </mj-text>
//       <mj-button href=${baseUrl} background-color="F45E43">Click To View Order</mj-button>
//       <mj-divider border-color="#F45E43"></mj-divider>
//       <mj-text font-size="20px" color="#F45E43" font-family="helvetica" align='center'>Shipping Details</mj-text>
    //
//       <mj-accordion>
//         <mj-accordion-element>
//           <mj-accordion-title color='#F45E43'>
//             <mj-text font-size="16px" color="#F45E43" font-family="helvetica">Address</mj-text>
//           </mj-accordion-title>
//           <mj-accordion-text>
//             <span style="line-height:20px; color:white;">
//               ${line1}
//             </span>

//           </mj-accordion-text>
//         </mj-accordion-element>
//       </mj-accordion>
    //
    //
//     </mj-column>
//   </mj-section>
// </mj-body>
// </mjml>
