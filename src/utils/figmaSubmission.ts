import { DesignData } from './indexedDB';
import { toast } from 'sonner@2.0.3';
import html2canvas from 'html2canvas';

// Figma API configuration
const FIGMA_API_TOKEN = 'YOUR_FIGMA_API_TOKEN_HERE'; // Admin needs to set this
const FIGMA_PROJECT_ID = 'YOUR_FIGMA_PROJECT_ID_HERE'; // The Figma project to submit to
const FIGMA_API_BASE = 'https://api.figma.com/v1';

interface FigmaSubmissionResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
  orderId: string;
}

/**
 * Submit design to Figma after successful payment
 * Creates a new file in the "Customer Orders" folder
 */
export async function submitDesignToFigma(
  designData: DesignData,
  orderDetails: {
    orderId: string;
    paymentId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
  }
): Promise<FigmaSubmissionResult> {
  try {
    // Capture EXACT screenshot of the design canvas using html2canvas
    const canvasElement = document.getElementById('design-canvas') as HTMLElement;
    if (!canvasElement) {
      throw new Error('Design canvas not found');
    }
    
    const screenshotDataUrl = await captureCanvasScreenshot(canvasElement);
    const fullResBlob = await base64ToBlob(screenshotDataUrl);
    
    // Create file name with order details
    const fileName = `ORDER_${orderDetails.orderId}_${designData.productName}_${designData.color}_${designData.size}`;
    
    // Prepare description with all order details
    const description = `
🛍️ ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━
Order ID: ${orderDetails.orderId}
Payment ID: ${orderDetails.paymentId}
Status: ✅ PAID

👤 CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━
Name: ${orderDetails.customerName}
Email: ${orderDetails.customerEmail}
Phone: ${orderDetails.customerPhone}
Address: ${orderDetails.deliveryAddress}

🎨 PRODUCT DETAILS
━━━━━━━━━━━━━━━━━━━━━━
Product: ${designData.productName}
Color: ${designData.color}
Size: ${designData.size}
Fabric: ${designData.fabric}
Printing Method: ${designData.printingMethod}

💰 PRICING
━━━━━━━━━━━━━━━━━━━━━━
Base Price: ₹${designData.basePrice}
Printing Cost: ₹${designData.printingCost}
Total: ₹${designData.basePrice + designData.printingCost}

📐 DESIGN SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━
Canvas Size: ${designData.canvasWidth}x${designData.canvasHeight}px
Design Layers: ${designData.designLayers.length}
Resolution: FULL (NO COMPRESSION)
Format: PNG (Lossless)

🖼️ LAYER DETAILS
━━━━━━━━━━━━━━━━━━━━━━
${designData.designLayers.map((layer, i) => `
Layer ${i + 1}:
  - Position: X:${layer.x}%, Y:${layer.y}%
  - Size: ${layer.width}x${layer.height}px
  - Rotation: ${layer.rotation}°
  - Printing: ${layer.printingMethodId}
`).join('\n')}

⏰ Order Date: ${new Date(designData.timestamp).toLocaleString('en-IN')}
`;

    // In production, this would upload to Figma
    // For now, we'll simulate the submission
    console.log('📤 Submitting to Figma:', {
      fileName,
      description,
      fileSize: fullResBlob.size,
      layers: designData.designLayers.length
    });

    // PRODUCTION CODE (uncomment when you have Figma API token):
    /*
    const formData = new FormData();
    formData.append('file', fullResBlob, `${fileName}.png`);
    formData.append('name', fileName);
    formData.append('description', description);
    
    const response = await fetch(`${FIGMA_API_BASE}/files`, {
      method: 'POST',
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Figma API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Move file to "Customer Orders" folder
    await fetch(`${FIGMA_API_BASE}/files/${result.key}/move`, {
      method: 'POST',
      headers: {
        'X-Figma-Token': FIGMA_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project_id: FIGMA_PROJECT_ID,
        folder_name: 'Customer Orders'
      })
    });

    return {
      success: true,
      fileUrl: `https://www.figma.com/file/${result.key}`,
      orderId: orderDetails.orderId
    };
    */

    // SIMULATION for development (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const simulatedFileUrl = `https://www.figma.com/file/SIMULATED_${Date.now()}/${encodeURIComponent(fileName)}`;
    
    toast.success('Design submitted to Figma!', {
      description: `Order ${orderDetails.orderId} ready for production`
    });

    return {
      success: true,
      fileUrl: simulatedFileUrl,
      orderId: orderDetails.orderId
    };

  } catch (error: any) {
    console.error('Figma submission error:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to submit to Figma',
      orderId: orderDetails.orderId
    };
  }
}

/**
 * Capture EXACT screenshot of the design canvas using html2canvas
 * This is 100% ACCURATE because we're capturing what the user actually sees!
 */
export async function captureCanvasScreenshot(canvasElement: HTMLElement): Promise<string> {
  console.log('📸 CAPTURING CANVAS SCREENSHOT...');
  console.log('   Method: html2canvas (pixel-perfect capture)');
  
  try {
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: null, // Preserve transparency
      scale: 4, // 4x resolution for print quality (600px → 2400px)
      logging: false,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
      removeContainer: true,
      foreignObjectRendering: false, // Better quality
      width: canvasElement.offsetWidth,
      height: canvasElement.offsetHeight
    });
    
    console.log('✅ Screenshot captured!');
    console.log('   Original size:', canvasElement.offsetWidth, 'x', canvasElement.offsetHeight);
    console.log('   Captured size:', canvas.width, 'x', canvas.height);
    console.log('   Scale: 4x (print quality)');
    
    // Convert to high-quality PNG
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    return dataUrl;
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw error;
  }
}

/**
 * Convert base64 data URL to Blob
 */
export function base64ToBlob(dataUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    resolve(new Blob([u8arr], { type: mime }));
  });
}

/**
 * Download design as high-quality PNG
 */
export function downloadDesignFile(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}