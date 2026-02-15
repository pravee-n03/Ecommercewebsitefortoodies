import JSZip from 'jszip';

// Download a single file from base64
export function downloadBase64File(base64Data: string, fileName: string) {
  const link = document.createElement('a');
  link.href = base64Data;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Convert base64 to blob
function base64ToBlob(base64: string): Blob {
  const parts = base64.split(',');
  const contentType = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const raw = atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

interface DesignLayer {
  id: string;
  originalImage: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  printingMethodName?: string;
}

interface DownloadPackageData {
  orderNumber: string;
  productName: string;
  finalDesign: string;
  originalMockup: string;
  layers: DesignLayer[];
}

// Download all design files as ZIP
export async function downloadDesignFilesAsZip(data: DownloadPackageData): Promise<void> {
  const zip = new JSZip();
  
  const folderName = `TOODIES_${data.orderNumber}_${data.productName.replace(/\s+/g, '_')}`;
  const designFolder = zip.folder(folderName);
  
  if (!designFolder) {
    throw new Error('Failed to create ZIP folder');
  }

  // Add final designed model (2400x2400, 100% quality, no compression)
  try {
    const finalDesignBlob = base64ToBlob(data.finalDesign);
    designFolder.file('00_FINAL_DESIGN_2400x2400_NO_COMPRESSION.png', finalDesignBlob);
  } catch (error) {
    console.error('Error adding final design:', error);
  }

  // Add original mockup
  try {
    const mockupBlob = base64ToBlob(data.originalMockup);
    designFolder.file('01_ORIGINAL_MOCKUP.png', mockupBlob);
  } catch (error) {
    console.error('Error adding mockup:', error);
  }

  // Add customer uploaded layers
  const layersFolder = designFolder.folder('CUSTOMER_UPLOADED_LAYERS');
  
  if (layersFolder) {
    for (let i = 0; i < data.layers.length; i++) {
      const layer = data.layers[i];
      try {
        const layerBlob = base64ToBlob(layer.originalImage);
        const layerFileName = `Layer_${i + 1}_${layer.printingMethodName || 'NoMethod'}.png`;
        layersFolder.file(layerFileName, layerBlob);
      } catch (error) {
        console.error(`Error adding layer ${i + 1}:`, error);
      }
    }
  }

  // Add metadata JSON
  const metadata = {
    orderNumber: data.orderNumber,
    productName: data.productName,
    totalLayers: data.layers.length,
    layers: data.layers.map((layer, index) => ({
      layerNumber: index + 1,
      fileName: `Layer_${index + 1}_${layer.printingMethodName || 'NoMethod'}.png`,
      position: {
        x: layer.x,
        y: layer.y,
        width: layer.width,
        height: layer.height,
        rotation: layer.rotation
      },
      printingMethod: layer.printingMethodName || 'Not specified'
    })),
    downloadedAt: new Date().toISOString()
  };

  designFolder.file('DESIGN_INFO.json', JSON.stringify(metadata, null, 2));

  // Add README with quality information
  const readme = `TOODIES DESIGN PACKAGE
Order: ${data.orderNumber}
Product: ${data.productName}
Downloaded: ${new Date().toLocaleString('en-IN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 WHAT YOU'RE GETTING:

This package contains a MERGED, PRODUCTION-READY design image where:
✓ Model/Mockup is the BACKGROUND
✓ Customer's uploaded designs are LAYERS placed on top
✓ Everything is MERGED into ONE SINGLE IMAGE
✓ Exact positioning as placed by customer
✓ LOCKED - cannot be edited

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FILES INCLUDED:

📁 00_FINAL_DESIGN_2400x2400_NO_COMPRESSION.png
   ✓ THIS IS THE MAIN FILE FOR PRODUCTION
   ✓ Complete merged design (mockup + all layers in ONE image)
   ✓ Shows EXACTLY where customer placed their designs
   ✓ Resolution: 2400x2400 pixels
   ✓ Format: PNG (Lossless)
   ✓ Quality: 100% (No compression)
   ✓ Ready for high-quality printing
   ✓ LOCKED design - cannot be edited
   
   HOW IT WAS CREATED:
   1. Model/Mockup drawn as background
   2. Each customer design layer placed on top at exact position
   3. All merged into single image
   4. Exported at maximum quality

📁 01_ORIGINAL_MOCKUP.png
   - Base product mockup without designs
   - For reference only

📁 CUSTOMER_UPLOADED_LAYERS/
   - Individual design files uploaded by customer
   - Separate PNG files before merging
   - Use for reference or custom workflows
   - Each layer includes printing method information

📁 DESIGN_INFO.json
   - Complete design metadata
   - Layer positions (X, Y coordinates)
   - Layer sizes and rotations
   - Printing method for each layer
   - Order details and timestamp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT NOTES:

1. USE THE "00_FINAL_DESIGN..." FILE FOR PRODUCTION
   → This shows the complete design as customer intended
   → Model is background, designs are placed on top
   → Everything merged into one image

2. The design is LOCKED and cannot be edited
   → This ensures accuracy
   → What you see is exactly what customer designed

3. NO quality loss or compression applied
   → Maximum resolution preserved
   → All colors accurate
   → Perfect for printing

4. Positioning is EXACT
   → Customer placed designs at specific positions
   → All coordinates preserved
   → Rotation and scaling maintained

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For support: contact@toodies.com
Toodies - Custom T-Shirt Design Platform
`;

  designFolder.file('README.txt', readme);

  // Generate and download ZIP
  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipBlob);
  link.download = `${folderName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// Download individual layer
export function downloadLayer(layerImage: string, layerNumber: number, printingMethod?: string) {
  const fileName = `Layer_${layerNumber}_${printingMethod || 'NoMethod'}.png`;
  downloadBase64File(layerImage, fileName);
}

// Download final design (high-quality, locked)
export function downloadFinalDesign(finalDesignImage: string, orderNumber: string, productName: string) {
  const fileName = `FINAL_DESIGN_2400x2400_${orderNumber}_${productName.replace(/\s+/g, '_')}.png`;
  downloadBase64File(finalDesignImage, fileName);
}

// Download original mockup
export function downloadOriginalMockup(mockupImage: string, orderNumber: string, productName: string) {
  const fileName = `ORIGINAL_MOCKUP_${orderNumber}_${productName.replace(/\s+/g, '_')}.png`;
  downloadBase64File(mockupImage, fileName);
}
