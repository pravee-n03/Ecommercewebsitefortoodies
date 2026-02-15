import { Order } from '../types';
import { storageUtils } from './storage';

// Helper function to replace variables in template
const replaceVariables = (template: string, order: Order, adminSettings: any): string => {
  const user = storageUtils.getUsers().find(u => u.id === order.userId);
  
  const variables: Record<string, string> = {
    orderId: order.id,
    total: `₹${order.total.toFixed(2)}`,
    status: order.status,
    date: new Date(order.date).toLocaleDateString(),
    customerName: user?.name || 'Customer',
    customerEmail: order.userEmail,
    customerMobile: order.userMobile,
    trackingNumber: order.trackingNumber || 'Not available yet',
    trackingUrl: order.trackingUrl || '',
    adminWhatsApp: adminSettings.whatsappNumber || 'Not configured',
    adminEmail: adminSettings.gmail || 'support@toodies.com',
    shippingAddress: order.shippingAddress || 'Not provided'
  };

  let result = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, variables[key]);
  });

  return result;
};

// Get active template by type
const getActiveTemplate = (type: 'whatsapp' | 'email' | 'tracking_update') => {
  const templates = storageUtils.getMessageTemplates();
  return templates.find(t => t.type === type && t.isActive);
};

// Mock notification service - in production, this would connect to real APIs
export const notificationService = {
  sendWhatsAppNotification: (mobile: string, order: Order) => {
    const adminSettings = storageUtils.getAdminSettings();
    const template = getActiveTemplate('whatsapp');
    
    let message: string;
    
    if (template) {
      // Use custom template
      message = replaceVariables(template.content, order, adminSettings);
    } else {
      // Use default template
      const adminWhatsApp = adminSettings.whatsappNumber || 'Not configured';
      message = `
🎉 Order Confirmed - Toodies

Order ID: ${order.id}
Total: ₹${order.total.toFixed(2)}
Status: ${order.status}
Date: ${new Date(order.date).toLocaleDateString()}

${order.trackingNumber ? `Tracking Number: ${order.trackingNumber}` : 'Tracking will be updated soon'}

For any queries, contact us on WhatsApp:
📱 ${adminWhatsApp}

Thank you for shopping with Toodies! 🛍️
      `.trim();
    }
    
    // Simulate API call
    console.log('📱 WhatsApp Notification Sent to Customer:', mobile);
    console.log('📱 Admin WhatsApp for customer support:', adminSettings.whatsappNumber);
    console.log('Message:', message);
    
    // Mock WhatsApp Web URL (for demo purposes)
    const whatsappUrl = `https://wa.me/${mobile.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    return {
      success: true,
      message: 'WhatsApp notification queued',
      url: whatsappUrl,
      adminContact: adminSettings.whatsappNumber
    };
  },

  sendEmailNotification: (email: string, order: Order) => {
    const adminSettings = storageUtils.getAdminSettings();
    const template = getActiveTemplate('email');
    
    let subject: string;
    let body: string;
    
    if (template) {
      // Use custom template
      subject = template.subject ? replaceVariables(template.subject, order, adminSettings) : `Order Confirmation - ${order.id}`;
      body = replaceVariables(template.content, order, adminSettings);
    } else {
      // Use default template
      subject = `Order Confirmation - ${order.id}`;
      const adminEmail = adminSettings.gmail || 'support@toodies.com';
      body = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0e1a 0%, #0f172a 100%); color: #e0e7ff; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #06b6d4; text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);">Toodies</h1>
            <p style="color: #94a3b8;">Custom Apparel & Design Platform</p>
          </div>
          
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 16px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #06b6d4; margin-top: 0;">Order Confirmed! 🎉</h2>
            
            <div style="margin: 20px 0;">
              <p><strong style="color: #14b8a6;">Order ID:</strong> ${order.id}</p>
              <p><strong style="color: #14b8a6;">Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
              <p><strong style="color: #14b8a6;">Status:</strong> <span style="color: #22d3ee;">${order.status}</span></p>
              <p><strong style="color: #14b8a6;">Total:</strong> <span style="color: #06b6d4; font-size: 24px;">₹${order.total.toFixed(2)}</span></p>
            </div>
            
            ${order.trackingNumber ? `
              <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 12px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0;"><strong style="color: #14b8a6;">Tracking Number:</strong></p>
                <p style="color: #22d3ee; font-size: 18px; margin: 5px 0;">${order.trackingNumber}</p>
                ${order.trackingUrl ? `<a href="${order.trackingUrl}" style="color: #06b6d4; text-decoration: none;">Track Your Order →</a>` : ''}
              </div>
            ` : `
              <div style="background: rgba(148, 163, 184, 0.1); border: 1px solid rgba(148, 163, 184, 0.3); border-radius: 12px; padding: 15px; margin-top: 20px;">
                <p style="margin: 0; color: #94a3b8;">Tracking information will be updated once your order is shipped.</p>
              </div>
            `}
          </div>
          
          <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #14b8a6; margin-top: 0; font-size: 16px;">Need Help?</h3>
            <p style="margin: 5px 0; color: #e0e7ff;"><strong>Email:</strong> <a href="mailto:${adminEmail}" style="color: #06b6d4; text-decoration: none;">${adminEmail}</a></p>
            ${adminSettings.whatsappNumber ? `<p style="margin: 5px 0; color: #e0e7ff;"><strong>WhatsApp:</strong> <a href="https://wa.me/${adminSettings.whatsappNumber.replace(/[^0-9]/g, '')}" style="color: #14b8a6; text-decoration: none;">${adminSettings.whatsappNumber}</a></p>` : ''}
          </div>
          
          <div style="text-align: center; color: #94a3b8; font-size: 14px;">
            <p>Thank you for shopping with Toodies!</p>
            <p>This email was sent from ${adminEmail}</p>
          </div>
        </div>
      `;
    }

    // Simulate API call
    console.log('📧 Email Notification Sent');
    console.log('From:', adminSettings.gmail);
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Body:', body);
    
    return {
      success: true,
      message: 'Email notification sent',
      preview: body,
      from: adminSettings.gmail
    };
  },

  sendTrackingUpdate: (email: string, mobile: string, order: Order) => {
    // Send both WhatsApp and Email when tracking is updated
    const whatsappResult = notificationService.sendWhatsAppNotification(mobile, order);
    const emailResult = notificationService.sendEmailNotification(email, order);
    
    return {
      whatsapp: whatsappResult,
      email: emailResult
    };
  }
};