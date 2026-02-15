import jsPDF from 'jspdf';

interface LayerInfo {
  id: string;
  originalImage: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  relativeX?: number;
  relativeY?: number;
  relativeWidth?: number;
  relativeHeight?: number;
  printingMethodName?: string;
  printingCost?: number;
}

interface PDFDesignData {
  finalDesignImage: string;
  originalMockup: string;
  layers: LayerInfo[];
  productName: string;
  color: string;
  size: string;
  fabric: string;
  basePrice: number;
  printingCost: number;
  totalPrice: number;
  orderId?: string;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderDate: string;
  canvasWidth: number;
  canvasHeight: number;
  printableArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  mockupBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  deliveryAddress?: string;
}

export async function generateDesignPDF(data: PDFDesignData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;

  const addText = (text: string, size: number = 10, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.text(text, margin, yPos);
    yPos += size * 0.4;
  };

  const addLine = () => {
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;
  };

  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // ===== PAGE 1: HEADER AND ORDER INFO =====
  
  pdf.setFillColor(0, 200, 200);
  pdf.rect(0, 0, pageWidth, 20, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOODIES', margin, 13);
  pdf.setFontSize(11);
  pdf.text('MANUFACTURING ORDER SHEET', pageWidth - margin - 70, 13);
  yPos = 25;

  // Order Number Box (Big and prominent)
  if (data.orderNumber || data.orderId) {
    pdf.setFillColor(0, 200, 200);
    pdf.rect(margin, yPos, contentWidth, 15, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`ORDER #${data.orderNumber || data.orderId}`, margin + 5, yPos + 10);
    yPos += 20;
  }

  // Order Information
  pdf.setDrawColor(0, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPos, contentWidth, 35);
  
  yPos += 7;
  pdf.setTextColor(0, 0, 0);
  addText(`Order Date: ${data.orderDate}`, 11, true);
  addText(`Customer: ${data.customerName || data.customerEmail || 'N/A'}`, 10);
  if (data.customerPhone) {
    addText(`Phone: ${data.customerPhone}`, 10);
  }
  if (data.customerEmail) {
    addText(`Email: ${data.customerEmail}`, 9);
  }
  yPos += 5;

  // Product Details
  checkNewPage(45);
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPos, contentWidth, 45, 'F');
  pdf.setDrawColor(100, 100, 100);
  pdf.rect(margin, yPos, contentWidth, 45);
  
  yPos += 7;
  addText('PRODUCT SPECIFICATIONS', 12, true, [0, 150, 150]);
  yPos += 2;
  addText(`Product: ${data.productName}`, 10, true);
  addText(`Color: ${data.color}`, 10);
  addText(`Size: ${data.size}`, 10);
  addText(`Fabric: ${data.fabric}`, 10);
  yPos += 5;

  // Pricing
  checkNewPage(30);
  pdf.setFillColor(250, 250, 250);
  pdf.rect(margin, yPos, contentWidth, 25, 'F');
  pdf.rect(margin, yPos, contentWidth, 25);
  
  yPos += 7;
  addText('PRICING', 11, true, [0, 150, 150]);
  yPos += 2;
  addText(`Base Price: ₹${data.basePrice}`, 10);
  addText(`Printing Cost: ₹${data.printingCost}`, 10);
  addText(`TOTAL: ₹${data.totalPrice}`, 12, true, [0, 128, 0]);
  yPos += 8;

  // Final Design Preview
  checkNewPage(115);
  pdf.setFillColor(255, 255, 200);
  pdf.rect(margin, yPos, contentWidth, 8, 'F');
  addText('✓ FINAL DESIGN (What Customer Ordered)', 12, true, [0, 0, 0]);
  yPos += 3;
  
  try {
    const imgWidth = 100;
    const imgHeight = 100;
    pdf.addImage(data.finalDesignImage, 'PNG', margin + (contentWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
    yPos += imgHeight + 10;
  } catch (error) {
    console.error('Error adding final design:', error);
    addText('Error loading final design image', 10, false, [255, 0, 0]);
    yPos += 10;
  }

  // ===== PAGE 2: LAYER DETAILS WITH POSITIONING =====
  pdf.addPage();
  yPos = margin;

  pdf.setFillColor(0, 200, 200);
  pdf.rect(0, 0, pageWidth, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DESIGN LAYERS & EXACT POSITIONING', margin, 8);
  yPos = 17;

  pdf.setTextColor(0, 0, 0);
  addText(`Total Layers: ${data.layers.length}`, 11, true);
  addText(`Canvas: ${data.canvasWidth}px × ${data.canvasHeight}px`, 10);
  if (data.printableArea) {
    addText(`Printable Area: ${Math.round(data.printableArea.width)}px × ${Math.round(data.printableArea.height)}px`, 9, false, [100, 100, 100]);
  }
  yPos += 5;
  addLine();

  // Each layer on detail
  data.layers.forEach((layer, index) => {
    checkNewPage(110);

    // Layer Header
    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, yPos, contentWidth, 8, 'F');
    pdf.setDrawColor(0, 150, 150);
    pdf.rect(margin, yPos, contentWidth, 8);
    addText(`LAYER ${index + 1} of ${data.layers.length}`, 11, true, [0, 100, 150]);
    yPos += 3;

    // Layer Image
    try {
      const layerImgSize = 55;
      pdf.addImage(layer.originalImage, 'PNG', margin, yPos, layerImgSize, layerImgSize);
      
      // Position details next to image
      const detailsX = margin + layerImgSize + 8;
      const startY = yPos;
      yPos = startY + 5;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ABSOLUTE POSITION:', detailsX, yPos);
      yPos += 5;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`X: ${Math.round(layer.x)}px  |  Y: ${Math.round(layer.y)}px`, detailsX, yPos);
      yPos += 4;
      pdf.text(`Width: ${Math.round(layer.width)}px  |  Height: ${Math.round(layer.height)}px`, detailsX, yPos);
      yPos += 4;
      pdf.text(`Rotation: ${Math.round(layer.rotation)}°`, detailsX, yPos);
      
      // Relative position
      if (layer.relativeX !== undefined && layer.relativeY !== undefined) {
        yPos += 6;
        pdf.setFont('helvetica', 'bold');
        pdf.text('RELATIVE POSITION (% of printable area):', detailsX, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Left: ${layer.relativeX.toFixed(1)}%  |  Top: ${layer.relativeY.toFixed(1)}%`, detailsX, yPos);
        yPos += 4;
        pdf.text(`Width: ${layer.relativeWidth?.toFixed(1)}%  |  Height: ${layer.relativeHeight?.toFixed(1)}%`, detailsX, yPos);
      }
      
      // Printing method
      if (layer.printingMethodName) {
        yPos += 6;
        pdf.setFillColor(200, 255, 200);
        const methodBoxY = yPos - 3;
        pdf.rect(detailsX, methodBoxY, 70, 10, 'F');
        pdf.setDrawColor(0, 150, 0);
        pdf.rect(detailsX, methodBoxY, 70, 10);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text(`Method: ${layer.printingMethodName}`, detailsX + 2, yPos + 3);
        if (layer.printingCost) {
          pdf.text(`₹${layer.printingCost}`, detailsX + 50, yPos + 3);
        }
        yPos += 7;
      }
      
      yPos = Math.max(yPos, startY + layerImgSize) + 3;
    } catch (error) {
      console.error(`Error adding layer ${index + 1}:`, error);
      addText(`Error loading layer ${index + 1} image`, 9, false, [255, 0, 0]);
      yPos += 5;
    }

    // Visual diagram of placement
    if (data.printableArea && (layer.relativeX !== undefined)) {
      const diagramWidth = contentWidth - 10;
      const diagramHeight = 40;
      const diagramX = margin + 5;
      const diagramY = yPos;
      
      // Printable area box
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.3);
      pdf.rect(diagramX, diagramY, diagramWidth, diagramHeight);
      
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Printable Area', diagramX + 2, diagramY - 1);
      
      // Layer position within printable area
      const layerX = diagramX + (layer.relativeX! / 100) * diagramWidth;
      const layerY = diagramY + (layer.relativeY! / 100) * diagramHeight;
      const layerW = ((layer.relativeWidth || 10) / 100) * diagramWidth;
      const layerH = ((layer.relativeHeight || 10) / 100) * diagramHeight;
      
      pdf.setFillColor(0, 200, 200, 0.3);
      pdf.setDrawColor(0, 200, 200);
      pdf.setLineWidth(1);
      pdf.rect(layerX, layerY, Math.min(layerW, diagramWidth - (layerX - diagramX)), Math.min(layerH, diagramHeight - (layerY - diagramY)), 'FD');
      
      pdf.setFontSize(6);
      pdf.setTextColor(0, 100, 100);
      pdf.text(`Layer ${index + 1}`, layerX + 2, layerY + 4);
      
      yPos += diagramHeight + 5;
    }

    addLine();
  });

  // ===== PAGE 3: ORIGINAL MOCKUP =====
  pdf.addPage();
  yPos = margin;

  pdf.setFillColor(0, 200, 200);
  pdf.rect(0, 0, pageWidth, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.text('ORIGINAL MOCKUP TEMPLATE', margin, 8);
  yPos = 17;

  pdf.setTextColor(100, 100, 100);
  addText('(Base product without any design)', 10);
  yPos += 5;

  try {
    const mockupWidth = 130;
    const mockupHeight = 130;
    pdf.addImage(data.originalMockup, 'PNG', margin + (contentWidth - mockupWidth) / 2, yPos, mockupWidth, mockupHeight);
    yPos += mockupHeight + 10;
  } catch (error) {
    console.error('Error adding mockup:', error);
    addText('Error loading mockup image', 10, false, [255, 0, 0]);
  }

  // ===== PAGE 4: MANUFACTURING INSTRUCTIONS =====
  pdf.addPage();
  yPos = margin;

  pdf.setFillColor(0, 200, 200);
  pdf.rect(0, 0, pageWidth, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.text('MANUFACTURING INSTRUCTIONS', margin, 8);
  yPos = 17;

  pdf.setFillColor(255, 250, 200);
  pdf.rect(margin, yPos, contentWidth, 80, 'F');
  pdf.setDrawColor(200, 150, 0);
  pdf.setLineWidth(0.8);
  pdf.rect(margin, yPos, contentWidth, 80);
  
  yPos += 8;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(150, 100, 0);
  pdf.text('⚠ CRITICAL MANUFACTURING NOTES:', margin + 3, yPos);
  yPos += 7;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  const notes = [
    '1. Use ABSOLUTE POSITION (X, Y coordinates) for precise placement',
    '2. RELATIVE POSITION shows % within printable area for reference',
    '3. Maintain exact rotation angles as specified',
    '4. All measurements are in pixels based on canvas dimensions',
    '5. Apply specified printing method for each layer',
    '6. Verify final result matches "FINAL DESIGN" on page 1',
    '7. Check color accuracy before production',
    '8. Maintain high resolution - DO NOT compress images',
    '',
    'Canvas Dimensions: ' + data.canvasWidth + 'px × ' + data.canvasHeight + 'px',
  ];

  if (data.printableArea) {
    notes.push(`Printable Area: ${Math.round(data.printableArea.width)}px × ${Math.round(data.printableArea.height)}px`);
    notes.push(`Printable Start: X=${Math.round(data.printableArea.x)}px, Y=${Math.round(data.printableArea.y)}px`);
  }

  notes.forEach(note => {
    pdf.text(note, margin + 5, yPos);
    yPos += 5;
  });

  yPos += 10;

  // Delivery Address
  if (data.deliveryAddress) {
    checkNewPage(35);
    pdf.setFillColor(240, 240, 255);
    pdf.rect(margin, yPos, contentWidth, 30, 'F');
    pdf.setDrawColor(100, 100, 200);
    pdf.rect(margin, yPos, contentWidth, 30);
    
    yPos += 7;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DELIVERY ADDRESS:', margin + 3, yPos);
    yPos += 6;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const addressLines = pdf.splitTextToSize(data.deliveryAddress, contentWidth - 10);
    pdf.text(addressLines, margin + 3, yPos);
    yPos += 30;
  }

  yPos += 15;
  checkNewPage(25);
  
  // Quality Control
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPos, contentWidth, 20);
  yPos += 7;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('QUALITY CONTROL:', margin + 3, yPos);
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.text('☐ Design placement verified     ☐ Colors checked     ☐ Quality approved', margin + 5, yPos);
  yPos += 6;
  pdf.text('Signature: _________________________     Date: __________', margin + 5, yPos);

  // Footer on all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `Toodies Manufacturing | Order: ${data.orderNumber || data.orderId || 'N/A'} | Page ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
    pdf.setFontSize(6);
    pdf.text(
      `Generated: ${new Date().toLocaleString('en-IN')} | DO NOT MODIFY`,
      pageWidth / 2,
      pageHeight - 4,
      { align: 'center' }
    );
  }

  return pdf.output('blob');
}

export function downloadPDF(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
