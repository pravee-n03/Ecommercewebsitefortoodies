import { Invoice } from '../types';
import { useRef } from 'react';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div ref={invoiceRef} className="bg-white p-8 max-w-4xl mx-auto" id="invoice-preview">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-300">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{invoice.companyName}</h1>
          <p className="text-sm text-gray-600 mt-2 max-w-xs">{invoice.companyAddress}</p>
          <p className="text-sm text-gray-600 mt-1">GSTIN: {invoice.companyGSTIN}</p>
          <p className="text-sm text-gray-600">Email: {invoice.companyEmail}</p>
          <p className="text-sm text-gray-600">Phone: {invoice.companyPhone}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-900">TAX INVOICE</h2>
          <p className="text-sm text-gray-600 mt-2">Invoice #: {invoice.invoiceNumber}</p>
          <p className="text-sm text-gray-600">Date: {formatDate(invoice.invoiceDate)}</p>
          {invoice.dueDate && (
            <p className="text-sm text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
          )}
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
        <p className="text-sm font-semibold text-gray-900">{invoice.customerName}</p>
        <p className="text-sm text-gray-600 max-w-xs">{invoice.customerAddress}</p>
        {invoice.customerGSTIN && (
          <p className="text-sm text-gray-600">GSTIN: {invoice.customerGSTIN}</p>
        )}
        <p className="text-sm text-gray-600">Email: {invoice.customerEmail}</p>
        <p className="text-sm text-gray-600">Phone: {invoice.customerPhone}</p>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-y-2 border-gray-300">
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Item</th>
              <th className="text-center p-3 text-sm font-semibold text-gray-900">Qty</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-900">Unit Price</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-900">Taxable Amt</th>
              <th className="text-center p-3 text-sm font-semibold text-gray-900">GST Rate</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-900">GST</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 text-sm text-gray-900 border-b border-gray-200">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500">{item.description}</p>
                    )}
                  </div>
                </td>
                <td className="p-3 text-sm text-center text-gray-900 border-b border-gray-200">
                  {item.quantity}
                </td>
                <td className="p-3 text-sm text-right text-gray-900 border-b border-gray-200">
                  ₹{item.unitPrice.toFixed(2)}
                </td>
                <td className="p-3 text-sm text-right text-gray-900 border-b border-gray-200">
                  ₹{item.taxableAmount.toFixed(2)}
                </td>
                <td className="p-3 text-sm text-center text-gray-900 border-b border-gray-200">
                  {item.gstRate}%
                </td>
                <td className="p-3 text-sm text-right text-gray-900 border-b border-gray-200">
                  ₹{item.gstAmount.toFixed(2)}
                </td>
                <td className="p-3 text-sm text-right font-semibold text-gray-900 border-b border-gray-200">
                  ₹{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>Discount:</span>
                <span>-₹{invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-700">
              <span>Taxable Amount:</span>
              <span>₹{invoice.taxableAmount.toFixed(2)}</span>
            </div>
            {!invoice.isInterState ? (
              <>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>CGST ({invoice.gstRate / 2}%):</span>
                  <span>₹{invoice.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>SGST ({invoice.gstRate / 2}%):</span>
                  <span>₹{invoice.sgst.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm text-gray-700">
                <span>IGST ({invoice.gstRate}%):</span>
                <span>₹{invoice.igst.toFixed(2)}</span>
              </div>
            )}
            {invoice.shippingCharges > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>Shipping Charges:</span>
                <span>₹{invoice.shippingCharges.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
              <span>Grand Total:</span>
              <span>₹{invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {invoice.paymentMethod && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Method</h3>
          <p className="text-sm text-gray-700 capitalize">{invoice.paymentMethod}</p>
        </div>
      )}

      {/* Bank Details */}
      {invoice.bankDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Bank Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>
              <span className="font-medium">Account Name:</span> {invoice.bankDetails.accountName}
            </div>
            <div>
              <span className="font-medium">Account Number:</span> {invoice.bankDetails.accountNumber}
            </div>
            <div>
              <span className="font-medium">IFSC Code:</span> {invoice.bankDetails.ifscCode}
            </div>
            <div>
              <span className="font-medium">Bank Name:</span> {invoice.bankDetails.bankName}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {/* Terms & Conditions */}
      {invoice.termsAndConditions && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.termsAndConditions}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
        <p className="text-sm text-gray-600">This is a computer-generated invoice and does not require a signature.</p>
        <p className="text-xs text-gray-500 mt-2">Thank you for your business!</p>
      </div>
    </div>
  );
}

// Utility function to download invoice as PDF
export const downloadInvoiceAsPDF = async (invoice: Invoice) => {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  // Render invoice
  const invoiceHTML = `
    <div style="background: white; padding: 40px; font-family: Arial, sans-serif;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #333;">
        <div>
          <h1 style="font-size: 24px; font-weight: bold; color: #111; margin: 0 0 12px 0;">${invoice.companyName}</h1>
          <p style="font-size: 12px; color: #666; margin: 4px 0; max-width: 300px;">${invoice.companyAddress}</p>
          <p style="font-size: 12px; color: #666; margin: 4px 0;">GSTIN: ${invoice.companyGSTIN}</p>
          <p style="font-size: 12px; color: #666; margin: 4px 0;">Email: ${invoice.companyEmail}</p>
          <p style="font-size: 12px; color: #666; margin: 4px 0;">Phone: ${invoice.companyPhone}</p>
        </div>
        <div style="text-align: right;">
          <h2 style="font-size: 20px; font-weight: bold; color: #111; margin: 0 0 12px 0;">TAX INVOICE</h2>
          <p style="font-size: 12px; color: #666; margin: 4px 0;">Invoice #: ${invoice.invoiceNumber}</p>
          <p style="font-size: 12px; color: #666; margin: 4px 0;">Date: ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 14px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Bill To:</h3>
        <p style="font-size: 12px; font-weight: 600; color: #111; margin: 4px 0;">${invoice.customerName}</p>
        <p style="font-size: 12px; color: #666; margin: 4px 0; max-width: 300px;">${invoice.customerAddress}</p>
        ${invoice.customerGSTIN ? `<p style="font-size: 12px; color: #666; margin: 4px 0;">GSTIN: ${invoice.customerGSTIN}</p>` : ''}
        <p style="font-size: 12px; color: #666; margin: 4px 0;">Email: ${invoice.customerEmail}</p>
        <p style="font-size: 12px; color: #666; margin: 4px 0;">Phone: ${invoice.customerPhone}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
        <thead>
          <tr style="background: #f5f5f5; border-top: 2px solid #333; border-bottom: 2px solid #333;">
            <th style="text-align: left; padding: 12px; font-size: 12px; font-weight: 600; color: #111;">Item</th>
            <th style="text-align: center; padding: 12px; font-size: 12px; font-weight: 600; color: #111;">Qty</th>
            <th style="text-align: right; padding: 12px; font-size: 12px; font-weight: 600; color: #111;">Unit Price</th>
            <th style="text-align: right; padding: 12px; font-size: 12px; font-weight: 600; color: #111;">Taxable Amt</th>
            <th style="text-align: center; padding: 12px; font-size: 12px; font-weight: 600; color: #111;">GST Rate</th>
            <th style="text-align: right; padding: 12px; font-size: 12px; font-weight: 600; color: #111;">GST</th>
            <th style="text-align: right; padding: 12px; font-size: 12px; font-weight: 600; color: #111;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr style="background: ${index % 2 === 0 ? 'white' : '#fafafa'};">
              <td style="padding: 12px; font-size: 12px; color: #111; border-bottom: 1px solid #ddd;">
                <div>
                  <p style="font-weight: 500; margin: 0;">${item.productName}</p>
                  ${item.description ? `<p style="font-size: 10px; color: #666; margin: 2px 0 0 0;">${item.description}</p>` : ''}
                </div>
              </td>
              <td style="padding: 12px; font-size: 12px; text-align: center; color: #111; border-bottom: 1px solid #ddd;">${item.quantity}</td>
              <td style="padding: 12px; font-size: 12px; text-align: right; color: #111; border-bottom: 1px solid #ddd;">₹${item.unitPrice.toFixed(2)}</td>
              <td style="padding: 12px; font-size: 12px; text-align: right; color: #111; border-bottom: 1px solid #ddd;">₹${item.taxableAmount.toFixed(2)}</td>
              <td style="padding: 12px; font-size: 12px; text-align: center; color: #111; border-bottom: 1px solid #ddd;">${item.gstRate}%</td>
              <td style="padding: 12px; font-size: 12px; text-align: right; color: #111; border-bottom: 1px solid #ddd;">₹${item.gstAmount.toFixed(2)}</td>
              <td style="padding: 12px; font-size: 12px; text-align: right; font-weight: 600; color: #111; border-bottom: 1px solid #ddd;">₹${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 320px;">
          <div style="padding: 16px; background: #f9f9f9; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666;">
              <span>Subtotal:</span>
              <span>₹${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666;">
              <span>Taxable Amount:</span>
              <span>₹${invoice.taxableAmount.toFixed(2)}</span>
            </div>
            ${!invoice.isInterState ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666;">
                <span>CGST (${invoice.gstRate / 2}%):</span>
                <span>₹${invoice.cgst.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666;">
                <span>SGST (${invoice.gstRate / 2}%):</span>
                <span>₹${invoice.sgst.toFixed(2)}</span>
              </div>
            ` : `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666;">
                <span>IGST (${invoice.gstRate}%):</span>
                <span>₹${invoice.igst.toFixed(2)}</span>
              </div>
            `}
            ${invoice.shippingCharges > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666;">
                <span>Shipping Charges:</span>
                <span>₹${invoice.shippingCharges.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-between; padding-top: 12px; margin-top: 12px; border-top: 2px solid #333; font-size: 16px; font-weight: bold; color: #111;">
              <span>Grand Total:</span>
              <span>₹${invoice.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      ${invoice.notes ? `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 12px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Notes</h3>
          <p style="font-size: 11px; color: #666; white-space: pre-line; margin: 0;">${invoice.notes}</p>
        </div>
      ` : ''}

      ${invoice.termsAndConditions ? `
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 12px; font-weight: 600; color: #111; margin: 0 0 8px 0;">Terms & Conditions</h3>
          <p style="font-size: 11px; color: #666; white-space: pre-line; margin: 0;">${invoice.termsAndConditions}</p>
        </div>
      ` : ''}

      <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #333; text-align: center;">
        <p style="font-size: 11px; color: #666; margin: 0;">This is a computer-generated invoice and does not require a signature.</p>
        <p style="font-size: 10px; color: #999; margin: 8px 0 0 0;">Thank you for your business!</p>
      </div>
    </div>
  `;

  container.innerHTML = invoiceHTML;

  // Use window.print() for now - a simple solution
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${invoiceHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 100);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Cleanup
  document.body.removeChild(container);
};
