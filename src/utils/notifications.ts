import { Order } from '../types';

/**
 * Notification service — sends WhatsApp / email notifications.
 * In production, wire these up to a real messaging API.
 * Currently logs to console as a mock implementation.
 */
export const notificationService = {
  sendWhatsAppNotification: (mobile: string | undefined, order: Order) => {
    const adminWhatsApp = 'Not configured';
    const orderId = order.id;
    const total = order.total?.toFixed(2) ?? '0.00';
    const status = order.status ?? 'pending';
    const tracking = order.trackingNumber ?? 'Tracking will be updated soon';

    const message = `
🎉 Order Confirmed - Toodies

Order ID: ${orderId}
Total: ₹${total}
Status: ${status}

${tracking}

For any queries, contact us on WhatsApp:
📱 ${adminWhatsApp}

Thank you for shopping with Toodies! 🛍️
    `.trim();

    console.log('📱 WhatsApp Notification (mock):', mobile);
    console.log('Message:', message);

    const cleanNumber = (mobile ?? '').replace(/[^0-9]/g, '');
    const whatsappUrl = cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
      : '#';

    return { success: true, message: 'WhatsApp notification queued', url: whatsappUrl };
  },

  sendEmailNotification: (email: string, order: Order) => {
    const orderId = order.id;
    const total = order.total?.toFixed(2) ?? '0.00';
    const status = order.status ?? 'pending';

    const subject = `Order Confirmation - ${orderId}`;
    const body = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e0e7ff; padding: 20px;">
        <h1 style="color: #d4af37;">Toodies</h1>
        <h2>Order Confirmed! 🎉</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <p>Thank you for shopping with Toodies!</p>
      </div>
    `;

    console.log('📧 Email Notification (mock)');
    console.log('To:', email);
    console.log('Subject:', subject);

    return { success: true, message: 'Email notification sent', preview: body };
  },

  sendTrackingUpdate: (email: string, mobile: string | undefined, order: Order) => {
    return {
      whatsapp: notificationService.sendWhatsAppNotification(mobile, order),
      email: notificationService.sendEmailNotification(email, order),
    };
  },
};
