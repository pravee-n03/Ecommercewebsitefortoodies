import { Order, Invoice, InvoiceItem, Product } from '../types';
import { storageUtils } from './storage';

export const invoiceUtils = {
  generateInvoiceNumber: (orderId: string): string => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `INV-${year}${month}-${orderId.slice(0, 6).toUpperCase()}`;
  },

  calculateGST: (amount: number, gstRate: number, isInterState: boolean) => {
    const gstAmount = (amount * gstRate) / 100;
    
    if (isInterState) {
      // IGST for inter-state transactions
      return {
        cgst: 0,
        sgst: 0,
        igst: gstAmount,
        totalTax: gstAmount
      };
    } else {
      // CGST + SGST for intra-state transactions
      const halfGst = gstAmount / 2;
      return {
        cgst: halfGst,
        sgst: halfGst,
        igst: 0,
        totalTax: gstAmount
      };
    }
  },

  generateInvoiceFromOrder: (order: Order, isInterState: boolean = false): Invoice => {
    const products = storageUtils.getProducts();
    const settings = storageUtils.getAdminSettings();
    const user = storageUtils.getUserById(order.userId);
    
    // Get company details from settings or use defaults
    const companyDetails = {
      companyName: 'Toodies',
      companyAddress: '123 Fashion Street, Mumbai, Maharashtra - 400001, India',
      companyGSTIN: settings.companyGSTIN || '27XXXXX1234X1ZX',
      companyEmail: settings.gmail || 'orders@toodies.com',
      companyPhone: settings.whatsappNumber || '+91-9886510858',
      companyLogo: settings.companyLogo || ''
    };

    // Calculate GST (default 12% for apparel)
    const gstRate = 12;
    const subtotal = order.total - (order.discount || 0);
    const discount = order.discount || 0;
    const shippingCharges = 0; // Can be configured
    
    // Calculate taxable amount (amount before tax)
    const taxableAmount = subtotal / (1 + gstRate / 100);
    const gstCalculation = invoiceUtils.calculateGST(taxableAmount, gstRate, isInterState);
    
    // Generate invoice items
    const invoiceItems: InvoiceItem[] = order.items.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      const variation = product?.variations.find(v => v.id === cartItem.variationId);
      
      const unitPrice = variation?.price || 0;
      const itemSubtotal = unitPrice * cartItem.quantity;
      const itemDiscount = 0; // Can be calculated based on coupon
      const itemTaxableAmount = itemSubtotal / (1 + gstRate / 100);
      const itemGstAmount = (itemTaxableAmount * gstRate) / 100;
      
      return {
        id: cartItem.productId + cartItem.variationId,
        productName: product?.name || 'Product',
        description: `${variation?.color || ''} - ${variation?.size || ''}`,
        quantity: cartItem.quantity,
        unitPrice: itemTaxableAmount / cartItem.quantity,
        discount: itemDiscount,
        taxableAmount: itemTaxableAmount,
        gstRate: gstRate,
        gstAmount: itemGstAmount,
        total: itemSubtotal
      };
    });

    const invoice: Invoice = {
      invoiceNumber: invoiceUtils.generateInvoiceNumber(order.id),
      invoiceDate: order.date,
      dueDate: order.paymentMethod === 'cod' ? new Date(new Date(order.date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : order.date,
      
      ...companyDetails,
      
      customerName: user?.name || order.userEmail.split('@')[0],
      customerEmail: order.userEmail,
      customerPhone: order.userMobile,
      customerAddress: order.shippingAddress || user?.address || 'Address not provided',
      customerGSTIN: '',
      
      items: invoiceItems,
      
      subtotal: subtotal,
      discount: discount,
      taxableAmount: taxableAmount,
      cgst: gstCalculation.cgst,
      sgst: gstCalculation.sgst,
      igst: gstCalculation.igst,
      totalTax: gstCalculation.totalTax,
      shippingCharges: shippingCharges,
      grandTotal: order.total + shippingCharges,
      
      gstRate: gstRate,
      isInterState: isInterState,
      
      notes: 'Thank you for your business!',
      termsAndConditions: '1. Goods once sold cannot be returned.\n2. Custom designed items are non-refundable.\n3. Please check items before accepting delivery.',
      paymentMethod: order.paymentMethod || 'razorpay',
      bankDetails: {
        accountName: 'Toodies Pvt Ltd',
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        bankName: 'State Bank of India'
      }
    };

    return invoice;
  },

  updateInvoiceCalculations: (invoice: Invoice): Invoice => {
    // Recalculate all totals based on items
    const itemsSubtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const taxableAmount = invoice.items.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalGstAmount = invoice.items.reduce((sum, item) => sum + item.gstAmount, 0);
    
    const gstCalculation = invoiceUtils.calculateGST(taxableAmount, invoice.gstRate, invoice.isInterState);
    
    return {
      ...invoice,
      subtotal: itemsSubtotal,
      taxableAmount: taxableAmount,
      cgst: gstCalculation.cgst,
      sgst: gstCalculation.sgst,
      igst: gstCalculation.igst,
      totalTax: gstCalculation.totalTax,
      grandTotal: itemsSubtotal - invoice.discount + invoice.shippingCharges
    };
  }
};
