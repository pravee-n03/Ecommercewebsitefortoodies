import { Order, CartItem, Product } from '../types';

export interface DesignSheetData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  item: CartItem;
  productName: string;
  variationName: string;
  companyName: string;
  companyContact: string;
}

export const downloadDesignSheetAsPDF = (data: DesignSheetData) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.item.customDesignUrl || '')}`;

  const sheetHTML = `
    <div style="background: white; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a202c; max-width: 800px; margin: auto; border: 1px solid #e2e8f0;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #2d3748;">
        <div>
          <h1 style="font-size: 28px; font-weight: 800; color: #2d3748; margin: 0;">TOODIES</h1>
          <p style="font-size: 14px; color: #718096; margin: 4px 0;">Production & Manufacturing</p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 18px; font-weight: 700; color: #2d3748; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Production Design Sheet</h2>
          <p style="font-size: 12px; color: #718096; margin: 4px 0;">Order ID: #${data.orderId.slice(-8).toUpperCase()}</p>
          <p style="font-size: 12px; color: #718096; margin: 4px 0;">Date: ${new Date(data.orderDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <!-- Main Info Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
        <!-- Customer Info -->
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #4a5568;">
          <h3 style="font-size: 14px; font-weight: 700; color: #4a5568; margin: 0 0 12px 0; text-transform: uppercase;">Customer Information</h3>
          <p style="font-size: 13px; margin: 4px 0;"><strong>Name:</strong> ${data.customerName}</p>
          <p style="font-size: 13px; margin: 4px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
          <p style="font-size: 13px; margin: 4px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
          <div style="margin-top: 10px;">
            <p style="font-size: 11px; font-weight: 600; color: #718096; margin: 0 0 4px 0;">SHIPPING ADDRESS:</p>
            <p style="font-size: 12px; color: #4a5568; line-height: 1.4; margin: 0;">${data.shippingAddress}</p>
          </div>
        </div>

        <!-- Product Details -->
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #38b2ac;">
          <h3 style="font-size: 14px; font-weight: 700; color: #2c7a7b; margin: 0 0 12px 0; text-transform: uppercase;">Product Details</h3>
          <p style="font-size: 15px; font-weight: 700; color: #1a202c; margin: 0 0 8px 0;">${data.productName}</p>
          <p style="font-size: 13px; margin: 4px 0;"><strong>Variation:</strong> ${data.variationName}</p>
          <p style="font-size: 13px; margin: 4px 0;"><strong>Quantity:</strong> ${data.item.quantity} Units</p>
          <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #cbd5e0;">
            <span style="display: inline-block; background: #38b2ac; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 800;">CUSTOM 3D DESIGN</span>
          </div>
        </div>
      </div>

      <!-- Design Reference -->
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 14px; font-weight: 700; color: #4a5568; margin: 0 0 15px 0; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Design Reference & QC</h3>
        
        <div style="display: flex; gap: 30px; align-items: flex-start;">
          <!-- QR Code and Link -->
          <div style="flex: 1; text-align: center; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
            <p style="font-size: 12px; font-weight: 700; color: #4a5568; margin: 0 0 15px 0;">SCAN TO VIEW 3D DESIGN</p>
            <img src="${qrCodeUrl}" width="150" height="150" style="display: block; margin: 0 auto 15px auto;" alt="Design QR Code" />
            <div style="background: #ebf8ff; border: 1px solid #bee3f8; padding: 10px; border-radius: 6px; word-break: break-all;">
              <p style="font-size: 9px; color: #2b6cb0; font-family: monospace; margin: 0;">${data.item.customDesignUrl}</p>
            </div>
          </div>

          <!-- Production Notes Area -->
          <div style="flex: 1.5;">
            <div style="height: 250px; border: 2px dashed #cbd5e0; border-radius: 12px; background: #fff; position: relative; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;">
              <div style="color: #a0aec0;">
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">PLACE DESIGN PREVIEW HERE</p>
                <p style="font-size: 11px; line-height: 1.5;">Admin: Use the design link to capture high-res screenshots of the front, back, and sides, then attach to this sheet for the production team.</p>
              </div>
            </div>
            <div style="margin-top: 15px;">
              <h4 style="font-size: 12px; font-weight: 700; color: #4a5568; margin: 0 0 8px 0;">PRODUCTION CHECKLIST:</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="font-size: 11px; color: #4a5568;"><input type="checkbox" style="margin-right: 6px;"> Correct Fabric Color</div>
                <div style="font-size: 11px; color: #4a5568;"><input type="checkbox" style="margin-right: 6px;"> Logo Placement Verified</div>
                <div style="font-size: 11px; color: #4a5568;"><input type="checkbox" style="margin-right: 6px;"> Print Quality Check</div>
                <div style="font-size: 11px; color: #4a5568;"><input type="checkbox" style="margin-right: 6px;"> Size Verification</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Printing Instructions -->
      <div style="background: #2d3748; color: white; padding: 20px; border-radius: 8px;">
        <h3 style="font-size: 12px; font-weight: 700; margin: 0 0 10px 0; text-transform: uppercase; color: #a0aec0;">Manufacturing Instructions</h3>
        <ul style="font-size: 11px; margin: 0; padding-left: 20px; line-height: 1.6;">
          <li>Access the 3D design link using the QR code for detailed placement.</li>
          <li>Ensure all colors match the digital preview specifically requested by the customer.</li>
          <li>For custom prints, use high-resolution DTF or Screen Printing as specified.</li>
          <li>Double-check the variation (Size: ${data.variationName}) before printing.</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #a0aec0;">
        <p>This is an internal manufacturing document generated by Toodies Admin Portal.</p>
        <p>© 2026 Toodies Apparel. All rights reserved.</p>
      </div>
    </div>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Design Sheet - ${data.orderId}</title>
          <style>
            body { margin: 0; padding: 20px; background-color: #f7fafc; }
            @media print {
              body { padding: 0; background-color: white; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${sheetHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};
