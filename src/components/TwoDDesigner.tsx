import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { 
  Upload, 
  Trash2, 
  Download, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Save,
  ArrowLeft,
  Layers,
  Palette,
  Ruler,
  X,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Move,
  Maximize2,
  Image as ImageIcon,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { ThreeDModelConfig } from '../types';
import { storageUtils } from '../utils/storage';
import { DesignCheckoutModal } from './DesignCheckoutModal';
import { designDB } from '../utils/indexedDB';
import { generateFullQualityExport, submitDesignToFigma, captureCanvasScreenshot } from '../utils/figmaSubmission';

interface DesignElement {
  id: string;
  imageUrl: string;
  x: number; // percentage
  y: number; // percentage
  width: number; // pixels
  height: number; // pixels
  rotation: number; // degrees
  printingMethodId?: string; // Individual printing method for this layer
}

interface TwoDDesignerProps {
  isOpen: boolean;
  onClose: () => void;
  modelConfig: ThreeDModelConfig;
  productName: string;
  onSaveDesign: (design: {
    color: string;
    size: string;
    fabric: string;
    printingMethod: string;
    printingCost: number;
    designUploads: any[];
    thumbnailUrl?: string;
    canvasSnapshot?: string;
  }) => void;
  existingDesignId?: string;
}

export function TwoDDesigner({ 
  isOpen, 
  onClose, 
  modelConfig, 
  productName, 
  onSaveDesign,
  existingDesignId
}: TwoDDesignerProps) {
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Configuration with defaults
  const availableColors = modelConfig?.availableColors || ['Black', 'White', 'Navy', 'Red', 'Gray'];
  const availableSizes = modelConfig?.availableSizes || ['S', 'M', 'L', 'XL', 'XXL'];
  const availableFabrics = modelConfig?.availableFabrics || ['Cotton', 'Polyester', 'Cotton Blend'];
  const printingMethods = modelConfig?.printingMethods || [];
  
  // Get the 2D mockup image URL
  const mockupImageUrl = modelConfig?.modelUrl || '';
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedPrintingMethod, setSelectedPrintingMethod] = useState('');
  const [printingCost, setPrintingCost] = useState(0);
  const [canvasZoom, setCanvasZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Print resolution settings (from model config or defaults)
  const printDPI = modelConfig?.printDPI || 300; // Default 300 DPI for high quality printing
  const canvasWidthInches = modelConfig?.canvasWidthInches || 12; // Default 12" width
  const canvasHeightInches = modelConfig?.canvasHeightInches || 16; // Default 16" height
  
  // Convert pixels to inches based on DPI
  const pixelsToInches = (pixels: number): number => {
    // Canvas is 600px, which represents the physical print area
    const pixelsPerInch = 600 / canvasWidthInches; // e.g., 600px / 12" = 50px per inch
    return pixels / pixelsPerInch;
  };

  // Calculate cost for a design element based on its size in square inches
  const calculateLayerCost = (element: DesignElement): number => {
    if (!element.printingMethodId) return 0;
    
    const method = printingMethods.find(m => m.id === element.printingMethodId);
    if (!method) return 0;
    
    // Convert pixel dimensions to inches
    const widthInches = pixelsToInches(element.width);
    const heightInches = pixelsToInches(element.height);
    
    // Calculate area in square inches
    const areaSquareInches = widthInches * heightInches;
    
    // Calculate cost: area × cost per square inch
    const calculatedCost = areaSquareInches * method.costPerSquareInch;
    
    // Apply minimum charge if configured
    const finalCost = method.minimumCharge 
      ? Math.max(calculatedCost, method.minimumCharge)
      : calculatedCost;
    
    return Math.round(finalCost * 100) / 100; // Round to 2 decimal places
  };

  // Update printing cost when elements or methods change
  useEffect(() => {
    // Calculate total cost based on all layers' sizes and printing methods
    let totalCost = 0;
    designElements.forEach(element => {
      totalCost += calculateLayerCost(element);
    });
    setPrintingCost(totalCost);
  }, [designElements, printingMethods, canvasWidthInches, canvasHeightInches, printDPI]);
  
  // Calculate total price: model price + printing cost
  const modelPrice = modelConfig?.modelPrice || 0;
  const totalPrice = modelPrice + printingCost;
  
  // Get the selected printing method
  const printingMethod = printingMethods.find(m => m.id === selectedPrintingMethod) || null;

  // Initialize defaults when modal opens
  useEffect(() => {
    if (isOpen && !existingDesignId) {
      // Set default values on first open
      if (!selectedColor && availableColors.length > 0) {
        setSelectedColor(modelConfig?.defaultColor || availableColors[0]);
      }
      if (!selectedSize && availableSizes.length > 0) {
        setSelectedSize(modelConfig?.defaultSize || availableSizes[0]);
      }
      if (!selectedFabric && availableFabrics.length > 0) {
        setSelectedFabric(modelConfig?.defaultFabric || availableFabrics[0]);
      }
      if (!selectedPrintingMethod && printingMethods.length > 0) {
        const defaultMethod = printingMethods.find(m => m.isActive) || printingMethods[0];
        setSelectedPrintingMethod(defaultMethod.id);
      }
    }
  }, [isOpen, modelConfig, availableColors, availableSizes, availableFabrics, printingMethods]);

  // Load existing design
  useEffect(() => {
    if (isOpen && existingDesignId) {
      loadExistingDesign(existingDesignId);
    }
  }, [isOpen, existingDesignId]);

  // Auto-save every 3 seconds
  useEffect(() => {
    if (isOpen && designElements.length > 0) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveDesign();
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [designElements, selectedColor, selectedSize, selectedFabric, selectedPrintingMethod, printingCost]);

  const loadExistingDesign = (designId: string) => {
    const currentUser = storageUtils.getCurrentUser();
    if (!currentUser?.savedCustomerDesigns) return;
    
    const design = currentUser.savedCustomerDesigns.find(d => d.id === designId);
    if (!design) return;
    
    const elements: DesignElement[] = design.designUploads.map(upload => ({
      id: upload.id,
      imageUrl: upload.imageUrl,
      x: upload.x || 50,
      y: upload.y || 50,
      width: upload.width || 200,
      height: upload.height || 200,
      rotation: upload.rotationDegrees || 0,
      printingMethodId: upload.printingMethodId
    }));
    
    setDesignElements(elements);
    setSelectedColor(design.color);
    setSelectedSize(design.size);
    setSelectedFabric(design.fabric);
    setSelectedPrintingMethod(design.printingMethod);
    setPrintingCost(design.printingCost);
    
    toast.success('Design loaded for editing!');
  };

  const autoSaveDesign = async () => {
    const currentUser = storageUtils.getCurrentUser();
    if (!currentUser) return;

    try {
      // DON'T capture screenshots during auto-save (too large for localStorage!)
      // Only save positioning data - images will be captured on "Add to Cart"
      
      // Get canvas dimensions for accurate positioning reference
      const canvasElement = canvasRef.current;
      const canvasDimensions = canvasElement ? {
        width: canvasElement.offsetWidth,
        height: canvasElement.offsetHeight,
        actualWidth: 600,
        actualHeight: 600,
        zoom: canvasZoom
      } : { width: 600, height: 600, actualWidth: 600, actualHeight: 600, zoom: 100 };

      // Save only lightweight positioning data (NO base64 images!)
      const designUploads = designElements.map(element => {
        const absoluteX = (element.x / 100) * 600;
        const absoluteY = (element.y / 100) * 600;
        
        return {
          id: element.id,
          // Store a reference, not the actual base64 image
          hasImage: !!element.imageUrl,
          
          x: element.x,
          y: element.y,
          absoluteX: absoluteX,
          absoluteY: absoluteY,
          width: element.width,
          height: element.height,
          rotationDegrees: element.rotation,
          printingMethodId: element.printingMethodId,
          positioning: {
            percentageX: element.x,
            percentageY: element.y,
            pixelX: absoluteX,
            pixelY: absoluteY,
            canvasWidth: 600,
            canvasHeight: 600,
            anchorPoint: 'center'
          }
        };
      });

      const designData = {
        id: existingDesignId || `design_${Date.now()}`,
        name: `${productName} - Custom Design`,
        productId: modelConfig.productId,
        color: selectedColor || 'Not Selected',
        size: selectedSize || 'Not Selected',
        fabric: selectedFabric || 'Not Selected',
        printingMethod: selectedPrintingMethod || 'Not Selected',
        printingCost: printingCost || 0,
        designUploads, // Lightweight positioning data only
        
        canvasMetadata: {
          dimensions: canvasDimensions,
          mockupDimensions: { width: 600, height: 600 },
          zoom: canvasZoom,
          gridEnabled: showGrid,
          elementCount: designElements.length
        },
        
        createdAt: existingDesignId 
          ? currentUser.savedCustomerDesigns?.find(d => d.id === existingDesignId)?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // NO base64 images during auto-save!
        isAutoSave: true,
        
        category: modelConfig.category,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name || currentUser.email,
        paymentStatus: 'unpaid' as const
      };

      const updatedUser = { ...currentUser };
      updatedUser.savedCustomerDesigns = updatedUser.savedCustomerDesigns || [];
      
      const existingIndex = updatedUser.savedCustomerDesigns.findIndex(d => d.id === designData.id);
      if (existingIndex >= 0) {
        updatedUser.savedCustomerDesigns[existingIndex] = designData;
      } else {
        updatedUser.savedCustomerDesigns.push(designData);
      }
      
      storageUtils.updateCurrentUser(updatedUser);
      console.log('Design auto-saved successfully');
    } catch (error: any) {
      if (error?.name === 'QuotaExceededError') {
        // Notify user about storage limit
        toast.error('Storage limit reached! Only keeping recent designs.', {
          description: 'Older designs were automatically removed to save space.'
        });
      } else {
        console.error('Auto-save error:', error);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      const newElement: DesignElement = {
        id: Date.now().toString(),
        imageUrl,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0
      };
      setDesignElements([...designElements, newElement]);
      setSelectedElement(newElement.id);
      toast.success('Design uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      const newElement: DesignElement = {
        id: Date.now().toString(),
        imageUrl,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        rotation: 0
      };
      setDesignElements([...designElements, newElement]);
      setSelectedElement(newElement.id);
      toast.success('Design uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteElement = (id: string) => {
    setDesignElements(designElements.filter(e => e.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    toast.success('Design removed');
  };

  const handleElementMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElement(id);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setSelectedElement(id);
    
    const element = designElements.find(el => el.id === id);
    if (element) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && selectedElement && canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;
        
        setDesignElements(prev => prev.map(el => {
          if (el.id === selectedElement) {
            const newX = Math.max(0, Math.min(100, el.x + deltaX));
            const newY = Math.max(0, Math.min(100, el.y + deltaY));
            return { ...el, x: newX, y: newY };
          }
          return el;
        }));
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
      
      if (isResizing && selectedElement) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const delta = Math.max(deltaX, deltaY);
        
        setDesignElements(prev => prev.map(el => {
          if (el.id === selectedElement) {
            const newSize = Math.max(50, Math.min(500, resizeStart.width + delta));
            return { ...el, width: newSize, height: newSize };
          }
          return el;
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, selectedElement, dragStart, resizeStart]);

  const updateElementRotation = (id: string, delta: number) => {
    setDesignElements(prev => prev.map(el => {
      if (el.id === id) {
        return { ...el, rotation: (el.rotation + delta) % 360 };
      }
      return el;
    }));
  };

  // Get visual effect styles for a printing method
  const getPrintingMethodStyles = (methodId?: string): React.CSSProperties => {
    if (!methodId) return {};
    
    const method = printingMethods.find(m => m.id === methodId);
    if (!method) return {};
    
    const styles: React.CSSProperties = {};
    
    // If admin configured visual effects, use them
    if (method.visualEffect) {
      const effect = method.visualEffect;
      
      // Apply CSS filter
      if (effect.filter) {
        styles.filter = effect.filter;
      }
      
      // Apply shadow
      if (effect.shadow) {
        styles.boxShadow = `${effect.shadow.offsetX}px ${effect.shadow.offsetY}px ${effect.shadow.blur}px ${effect.shadow.color}`;
      }
      
      // Apply outline/border
      if (effect.outline) {
        styles.outline = `${effect.outline.width}px ${effect.outline.style} ${effect.outline.color}`;
        styles.outlineOffset = '2px';
      }
      
      // Apply emboss effect
      if (effect.emboss) {
        const existing = styles.filter || '';
        styles.filter = `${existing} drop-shadow(1px 1px 0px rgba(255,255,255,0.3)) drop-shadow(-1px -1px 0px rgba(0,0,0,0.3))`.trim();
      }
      
      // Apply glossy effect for vinyl
      if (effect.glossy) {
        const existing = styles.filter || '';
        styles.filter = `${existing} brightness(1.15) contrast(1.1)`.trim();
      }
    } else {
      // Auto-detect based on method name and apply default effects
      const methodName = method.name.toLowerCase();
      
      if (methodName.includes('embroid')) {
        // Embroidery effect: raised, textured, with outline
        styles.filter = 'contrast(1.3) brightness(0.95) drop-shadow(1px 1px 1px rgba(0,0,0,0.4)) drop-shadow(-1px -1px 1px rgba(255,255,255,0.3))';
        styles.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
      } else if (methodName.includes('vinyl') || methodName.includes('heat transfer')) {
        // Vinyl/Heat Transfer: glossy, smooth, vibrant
        styles.filter = 'brightness(1.2) contrast(1.15) saturate(1.2)';
        styles.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      } else if (methodName.includes('screen') || methodName.includes('silk')) {
        // Screen Print: flat, matte, slightly textured
        styles.filter = 'contrast(1.1) brightness(0.98) saturate(1.1)';
        styles.opacity = 0.95;
      } else if (methodName.includes('dtg') || methodName.includes('digital')) {
        // DTG (Direct to Garment): soft, integrated look
        styles.filter = 'contrast(1.05) brightness(0.98)';
        styles.opacity = 0.92;
      } else if (methodName.includes('sublim')) {
        // Sublimation: very vibrant, integrated
        styles.filter = 'saturate(1.3) brightness(1.1) contrast(1.1)';
      } else if (methodName.includes('discharge')) {
        // Discharge: soft, vintage look
        styles.filter = 'brightness(0.9) contrast(0.95) saturate(0.9)';
        styles.opacity = 0.9;
      } else if (methodName.includes('puff') || methodName.includes('3d')) {
        // Puff/3D Print: raised, bold
        styles.filter = 'drop-shadow(2px 2px 3px rgba(0,0,0,0.5)) drop-shadow(-1px -1px 1px rgba(255,255,255,0.4)) brightness(1.1)';
        styles.transform = 'translateZ(2px)';
      } else if (methodName.includes('foil') || methodName.includes('metallic')) {
        // Foil/Metallic: shiny, reflective
        styles.filter = 'brightness(1.3) contrast(1.2) saturate(0.8)';
        styles.boxShadow = '0 0 10px rgba(255,255,255,0.4), inset 0 0 5px rgba(255,255,255,0.3)';
      } else if (methodName.includes('glow') || methodName.includes('reflective')) {
        // Glow in dark / Reflective
        styles.filter = 'brightness(1.4) contrast(1.1)';
        styles.boxShadow = '0 0 15px rgba(255,255,255,0.6)';
      } else {
        // Default: subtle enhancement
        styles.filter = 'contrast(1.1) brightness(1.0)';
      }
    }
    
    return styles;
  };

  const handleExportDesign = async () => {
    if (designElements.length === 0) {
      toast.error('Please add at least one design element');
      return;
    }

    // Check if all layers have printing methods
    const layersWithoutMethod = designElements.filter(el => !el.printingMethodId);
    if (layersWithoutMethod.length > 0) {
      toast.error('Please select a printing method for all layers');
      return;
    }

    if (!selectedColor || !selectedSize || !selectedFabric) {
      toast.error('Please select color, size, and fabric');
      return;
    }

    try {
      // Auto-create guest user if not logged in
      const currentUser = storageUtils.getOrCreateGuestUser();

      console.log('🎨 Starting design export process...');
      console.log('📋 DEBUG INFO:');
      console.log('  Mockup URL:', mockupImageUrl);
      console.log('  Design Elements:', designElements.map(el => ({
        id: el.id,
        x: el.x,
        y: el.y,
        width: el.width,
        height: el.height,
        rotation: el.rotation
      })));
      
      toast('🎨 Capturing your design...', { duration: 2000 });

      // Step 1: Capture EXACT SCREENSHOT of the canvas (pixel-perfect accuracy!)
      // This captures EXACTLY what you see - no coordinate mapping needed
      const canvasElement = document.getElementById('design-canvas');
      if (!canvasElement) {
        toast.error('Canvas not found');
        return;
      }

      const fullQualityExport = await captureCanvasScreenshot(canvasElement as HTMLElement);

      console.log('✅ Canvas Screenshot Captured:', {
        method: 'html2canvas (pixel-perfect)',
        scale: '4x (600px → 2400px)',
        dataSize: `${(fullQualityExport.length / 1024 / 1024).toFixed(2)} MB`,
        format: 'PNG (100% quality, no compression)',
        description: 'Exact screenshot of what you see on screen'
      });

      // Step 2: For preview, use the same screenshot (it's already perfect)
      const previewImage = fullQualityExport;

      console.log('✅ Using same screenshot for preview');

      // Save to IndexedDB with full quality
      const canvasW = 2400;
      const canvasH = 2400;
      
      // Define printable area (center area where designs can be placed)
      const printableArea = {
        x: canvasW * 0.25,
        y: canvasH * 0.2,
        width: canvasW * 0.5,
        height: canvasH * 0.6
      };
      
      const designData = {
        id: existingDesignId || `design_${Date.now()}`,
        userId: currentUser.id,
        productId: modelConfig.productId,
        name: `${productName} - Custom Design`,
        timestamp: Date.now(),
        
        // MERGED IMAGES: Mockup + Layers combined as ONE image
        // This ensures exact placement is preserved!
        fullResolutionSnapshot: fullQualityExport, // 2400x2400 PNG (for Figma submission & download)
        previewSnapshot: previewImage, // 600x600 PNG (for UI display)
        
        // Individual layer data (for manufacturing/editing)
        originalMockup: mockupImageUrl,
        designLayers: designElements.map(el => {
          const printingMethod = modelConfig.printingMethods.find(pm => pm.id === el.printingMethodId);
          
          // Calculate dimensions in inches
          const widthInches = pixelsToInches(el.width);
          const heightInches = pixelsToInches(el.height);
          const areaSquareInches = widthInches * heightInches;
          const layerCost = calculateLayerCost(el);
          
          // Calculate relative positions within printable area
          const relX = ((el.x - printableArea.x) / printableArea.width) * 100;
          const relY = ((el.y - printableArea.y) / printableArea.height) * 100;
          const relW = (el.width / printableArea.width) * 100;
          const relH = (el.height / printableArea.height) * 100;
          
          return {
            id: el.id,
            originalImage: el.imageUrl,
            x: el.x,
            y: el.y,
            width: el.width,
            height: el.height,
            widthInches: Math.round(widthInches * 100) / 100,
            heightInches: Math.round(heightInches * 100) / 100,
            areaSquareInches: Math.round(areaSquareInches * 100) / 100,
            rotation: el.rotation,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            relativeX: Math.round(relX * 100) / 100,
            relativeY: Math.round(relY * 100) / 100,
            relativeWidth: Math.round(relW * 100) / 100,
            relativeHeight: Math.round(relH * 100) / 100,
            printingMethodId: el.printingMethodId || '',
            printingMethodName: printingMethod?.name || '',
            printingCost: layerCost
          };
        }),
        
        printableArea: printableArea,
        
        mockupBounds: {
          x: 0,
          y: 0,
          width: canvasW,
          height: canvasH
        },
        
        // Product details
        productName: productName,
        color: selectedColor,
        size: selectedSize,
        fabric: selectedFabric,
        printingMethod: selectedPrintingMethod,
        printingCost: printingCost,
        basePrice: modelPrice,
        
        // Canvas metadata
        canvasWidth: canvasW,
        canvasHeight: canvasH,
        canvasScale: canvasZoom / 100,
        
        // Status
        paymentStatus: 'unpaid' as const,
        isLocked: true  // Lock immediately to prevent editing
      };

      await designDB.saveDesign(designData);
      
      // Show success message with cost breakdown
      const totalArea = designElements.reduce((sum, el) => {
        const w = pixelsToInches(el.width);
        const h = pixelsToInches(el.height);
        return sum + (w * h);
      }, 0);
      
      toast.success('Design saved & locked! 🎨', {
        description: `✓ Model + ${designElements.length} layer(s) merged into one image | ${totalArea.toFixed(2)} sq.in | ₹${printingCost.toFixed(2)} | 2400x2400 PNG ready`
      });
      
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to save design');
    }
  };

  // Capture the composed design (design ON model)
  const captureComposedDesign = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set optimized canvas size (600x600 for balance of quality and file size)
        canvas.width = 600;
        canvas.height = 600;

        // Enable high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Load and draw mockup image
        const mockupImg = new Image();
        mockupImg.crossOrigin = 'anonymous';
        
        mockupImg.onload = () => {
          // Draw mockup background
          ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

          // Draw all design elements ON the mockup
          let loadedCount = 0;
          const totalElements = designElements.length;

          if (totalElements === 0) {
            // If no elements, just capture the mockup - use JPEG at 70% quality
            resolve(canvas.toDataURL('image/jpeg', 0.7));
            return;
          }

          designElements.forEach((element) => {
            const designImg = new Image();
            designImg.crossOrigin = 'anonymous';
            
            designImg.onload = () => {
              ctx.save();

              // Calculate position and size (scaled to 600x600)
              const scale = canvas.width / 600; // Scale factor (1:1 since both are 600)
              const x = (element.x / 100) * canvas.width;
              const y = (element.y / 100) * canvas.height;
              const width = element.width * scale;
              const height = element.height * scale;

              // Apply transformations
              ctx.translate(x, y);
              ctx.rotate((element.rotation * Math.PI) / 180);

              // Apply printing method visual effects
              const method = printingMethods.find(m => m.id === element.printingMethodId);
              if (method) {
                applyCanvasFilters(ctx, method, scale);
              }

              // Draw the design element
              ctx.drawImage(designImg, -width / 2, -height / 2, width, height);
              
              ctx.restore();

              loadedCount++;
              if (loadedCount === totalElements) {
                // All elements loaded - export as JPEG at 70% quality for smaller file
                resolve(canvas.toDataURL('image/jpeg', 0.7));
              }
            };

            designImg.onerror = () => {
              console.error('Failed to load design element:', element.id);
              loadedCount++;
              if (loadedCount === totalElements) {
                resolve(canvas.toDataURL('image/jpeg', 0.7));
              }
            };

            designImg.src = element.imageUrl;
          });
        };

        mockupImg.onerror = () => {
          reject(new Error('Failed to load mockup image'));
        };

        mockupImg.src = mockupImageUrl || '';
      } catch (error) {
        reject(error);
      }
    });
  };

  // Apply visual effects to canvas context
  const applyCanvasFilters = (ctx: CanvasRenderingContext2D, method: any, scale: number = 1) => {
    const methodName = method.name.toLowerCase();
    
    if (methodName.includes('embroid')) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 3 * scale;
      ctx.shadowOffsetX = 1.5 * scale;
      ctx.shadowOffsetY = 1.5 * scale;
    } else if (methodName.includes('vinyl') || methodName.includes('heat')) {
      ctx.globalAlpha = 1.0;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 5 * scale;
    } else if (methodName.includes('puff') || methodName.includes('3d')) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 6 * scale;
      ctx.shadowOffsetX = 2.5 * scale;
      ctx.shadowOffsetY = 2.5 * scale;
    }
  };

  if (!isOpen) return null;

  const selectedEl = designElements.find(el => el.id === selectedElement);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="h-5 w-px bg-slate-800" />
          <div>
            <h1 className="text-sm font-semibold text-white">{productName}</h1>
            <p className="text-xs text-slate-500">Design Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Total Cost Breakdown */}
          <div className="flex items-center gap-3">
            {modelPrice > 0 && (
              <>
                <div className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <p className="text-xs text-slate-500">Model</p>
                  <p className="text-sm font-semibold text-white">₹{modelPrice}</p>
                </div>
                {printingCost > 0 && (
                  <>
                    <Plus className="w-3 h-3 text-slate-600" />
                    <div className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <p className="text-xs text-slate-500">Printing</p>
                      <p className="text-sm font-semibold text-white">₹{printingCost}</p>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="h-8 w-px bg-slate-700" />
            <div className="px-4 py-1.5 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-cyan-400/70">Total Amount</p>
              <p className="text-lg font-bold text-cyan-400">₹{totalPrice}</p>
            </div>
            <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-xs text-purple-400/70">Export Quality</p>
              <p className="text-xs font-semibold text-purple-400">2400x2400 PNG</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Design will be locked after saving. Download high-quality PNG from Studio.</span>
            </p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleExportDesign}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20"
          >
            <Save className="w-4 h-4 mr-2" />
            Save & Lock Design
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-20 border-r border-slate-800 bg-slate-900/50 flex flex-col items-center py-4 gap-3">
          {/* Upload Tool */}
          <div className="relative">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 rounded-xl bg-slate-800 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center group transition-all"
              title="Upload Design"
            >
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Layers Tool */}
          <button
            className="w-14 h-14 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex flex-col items-center justify-center group transition-all"
            title="Layers"
          >
            <Layers className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            {designElements.length > 0 && (
              <span className="text-xs text-cyan-400 font-bold mt-0.5">{designElements.length}</span>
            )}
          </button>

          <div className="h-px w-10 bg-slate-800 my-2" />

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`w-14 h-14 rounded-xl border border-slate-700 flex items-center justify-center group transition-all ${
              showGrid 
                ? 'bg-cyan-500/10 border-cyan-500/50' 
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title="Toggle Grid"
          >
            <Grid3x3 className={`w-5 h-5 transition-colors ${
              showGrid ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'
            }`} />
          </button>

          <div className="flex-1" />

          {/* Zoom Controls */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setCanvasZoom(Math.min(200, canvasZoom + 10))}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all"
              title="Zoom In"
            >
              <Plus className="w-4 h-4 text-slate-400" />
            </button>
            <div className="text-xs text-center text-slate-500 font-mono">{canvasZoom}%</div>
            <button
              onClick={() => setCanvasZoom(Math.max(50, canvasZoom - 10))}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Canvas Toolbar */}
          <div className="h-12 border-b border-slate-800/50 flex items-center justify-center gap-4 px-4 bg-slate-900/30">
            {selectedEl && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Move className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs text-slate-400">Selected Layer</span>
                </div>

                <div className="h-5 w-px bg-slate-800" />

                {/* Size Controls */}
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="number"
                    value={Math.round(selectedEl.width)}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 50;
                      setDesignElements(prev => prev.map(el => 
                        el.id === selectedElement ? { ...el, width: value, height: value } : el
                      ));
                    }}
                    className="w-16 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white text-center"
                  />
                  <span className="text-xs text-slate-500">px</span>
                </div>

                <div className="h-5 w-px bg-slate-800" />

                {/* Rotation Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 hover:bg-slate-700"
                    onClick={() => updateElementRotation(selectedElement!, -15)}
                  >
                    <RotateCw className="w-3 h-3 text-slate-400 rotate-180" />
                  </Button>
                  <span className="text-xs text-slate-400 font-mono w-10 text-center">
                    {Math.round(selectedEl.rotation)}°
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 hover:bg-slate-700"
                    onClick={() => updateElementRotation(selectedElement!, 15)}
                  >
                    <RotateCw className="w-3 h-3 text-slate-400" />
                  </Button>
                </div>

                <div className="h-5 w-px bg-slate-800" />

                {/* Delete Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => handleDeleteElement(selectedElement!)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </motion.div>
            )}
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="relative">
              <div
                id="design-canvas"
                ref={canvasRef}
                className="relative rounded-xl shadow-2xl overflow-hidden"
                style={{
                  width: `${600 * (canvasZoom / 100)}px`,
                  height: `${600 * (canvasZoom / 100)}px`,
                  backgroundImage: mockupImageUrl 
                    ? `url(${mockupImageUrl})` 
                    : 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
                onMouseDown={() => setSelectedElement(null)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {/* Grid Overlay - Only if enabled */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.05) 0px, rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 40px)',
                      backgroundSize: '40px 40px'
                    }}
                  />
                )}

                {/* DEBUG GRIDLINES - Always visible for positioning accuracy */}
                <div className="absolute inset-0 pointer-events-none z-50">
                  {/* Vertical center line (50%) */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyan-500/50" style={{ transform: 'translateX(-50%)' }} />
                  {/* Horizontal center line (50%) */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-500/50" style={{ transform: 'translateY(-50%)' }} />
                  
                  {/* Quarter lines (25%, 75%) */}
                  <div className="absolute left-1/4 top-0 bottom-0 w-px bg-cyan-400/30" style={{ transform: 'translateX(-50%)' }} />
                  <div className="absolute left-3/4 top-0 bottom-0 w-px bg-cyan-400/30" style={{ transform: 'translateX(-50%)' }} />
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400/30" style={{ transform: 'translateY(-50%)' }} />
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400/30" style={{ transform: 'translateY(-50%)' }} />
                  
                  {/* Percentage labels */}
                  <div className="absolute left-1/2 top-1 text-xs font-mono bg-cyan-500 text-white px-1 rounded" style={{ transform: 'translateX(-50%)' }}>50%</div>
                  <div className="absolute left-1 top-1/2 text-xs font-mono bg-cyan-500 text-white px-1 rounded" style={{ transform: 'translateY(-50%)' }}>50%</div>
                  <div className="absolute left-1/4 top-1 text-xs font-mono bg-cyan-400/70 text-white px-1 rounded" style={{ transform: 'translateX(-50%)' }}>25%</div>
                  <div className="absolute left-3/4 top-1 text-xs font-mono bg-cyan-400/70 text-white px-1 rounded" style={{ transform: 'translateX(-50%)' }}>75%</div>
                  
                  {/* Corner marker (0,0) */}
                  <div className="absolute left-0 top-0 text-xs font-mono bg-red-500 text-white px-1 rounded">0,0</div>
                  {/* Corner marker (100,100) */}
                  <div className="absolute right-0 bottom-0 text-xs font-mono bg-red-500 text-white px-1 rounded">100,100</div>
                </div>

                {/* Empty State */}
                {designElements.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-dashed border-cyan-500/30 shadow-xl">
                      <ImageIcon className="w-12 h-12 text-cyan-400/70 mx-auto mb-3" />
                      <p className="text-slate-700 font-semibold text-sm">Upload Your Design</p>
                      <p className="text-slate-500 text-xs mt-1">Drag & drop or click upload button</p>
                      <p className="text-slate-400 text-xs mt-2">PNG, JPG (Max 5MB)</p>
                    </div>
                  </motion.div>
                )}

                {/* Design Elements */}
                <AnimatePresence>
                  {designElements.map((element) => {
                    const elementStyles = getPrintingMethodStyles(element.printingMethodId);
                    
                    return (
                      <motion.div
                        key={element.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={`design-control absolute cursor-move select-none ${
                          selectedElement === element.id ? 'z-10' : 'z-0'
                        }`}
                        style={{
                          left: `${element.x}%`,
                          top: `${element.y}%`,
                          width: `${element.width * (canvasZoom / 100)}px`,
                          height: `${element.height * (canvasZoom / 100)}px`,
                          transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
                        }}
                        onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                      >
                        <img
                          src={element.imageUrl}
                          alt="Design"
                          className="w-full h-full object-contain pointer-events-none select-none"
                          style={elementStyles}
                          draggable={false}
                        />
                        
                        {selectedElement === element.id && (
                          <>
                            <div className="absolute inset-0 border-2 border-cyan-500 rounded pointer-events-none shadow-lg shadow-cyan-500/50" />
                            
                            {/* Center crosshair - shows exact center point */}
                            <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                              {/* Vertical line */}
                              <div className="absolute left-1/2 w-0.5 h-8 bg-red-500" style={{ top: '-16px', transform: 'translateX(-50%)' }} />
                              {/* Horizontal line */}
                              <div className="absolute top-1/2 h-0.5 w-8 bg-red-500" style={{ left: '-16px', transform: 'translateY(-50%)' }} />
                              {/* Center dot */}
                              <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-red-500 rounded-full" style={{ transform: 'translate(-50%, -50%)' }} />
                            </div>
                            
                            {/* Position label */}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-mono px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                              {element.x.toFixed(0)}%, {element.y.toFixed(0)}%
                            </div>
                            
                            <div
                              className="absolute -bottom-3 -right-3 w-6 h-6 bg-cyan-500 rounded-full border-2 border-white cursor-nwse-resize shadow-lg hover:scale-110 transition-transform"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                handleResizeMouseDown(e, element.id);
                              }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 border-t-2 border-r-2 border-white transform rotate-45" />
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-900/50 flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="h-12 border-b border-slate-800 flex items-center px-4">
            <Palette className="w-4 h-4 text-cyan-400 mr-2" />
            <h2 className="text-sm font-semibold text-white">Product Options</h2>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
            {/* Export Info */}
            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <ImageIcon className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-purple-300">Merged Export</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Your design will be merged with the model background into one image
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="px-2 py-1 bg-slate-900/50 rounded text-slate-300">
                  Model BG
                </div>
                <span className="text-purple-400">+</span>
                <div className="px-2 py-1 bg-slate-900/50 rounded text-slate-300">
                  Your Layers
                </div>
                <span className="text-purple-400">=</span>
                <div className="px-2 py-1 bg-purple-500/20 rounded text-purple-300 font-bold">
                  Final PNG
                </div>
              </div>
            </div>

            {/* Printing Method */}
            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Printing Method
              </Label>
              {printingMethods.length > 0 ? (
                <>
                  <Select value={selectedPrintingMethod} onValueChange={setSelectedPrintingMethod}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-11">
                      <SelectValue placeholder="Select method..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {printingMethods.filter(m => m.isActive).map(method => (
                        <SelectItem key={method.id} value={method.id} className="text-white">
                          <div className="flex items-center justify-between w-full">
                            <span>{method.name}</span>
                            <span className="text-cyan-400 ml-3">₹{method.costPerSquareInch}/inch²</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {printingMethod && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-slate-500"
                    >
                      {printingMethod.description}
                    </motion.p>
                  )}
                </>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-400">Not configured</p>
                      <p className="text-xs text-amber-400/70 mt-0.5">Contact admin</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Color
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-20 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                      selectedColor === color
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                        : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white/20 shadow-inner" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-slate-300">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Size
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600 bg-slate-800/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Selection */}
            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Fabric
              </Label>
              <Select value={selectedFabric} onValueChange={setSelectedFabric}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-11">
                  <SelectValue placeholder="Select fabric..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {availableFabrics.map(fabric => (
                    <SelectItem key={fabric} value={fabric} className="text-white">
                      {fabric}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layers Panel */}
            {designElements.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Layers ({designElements.length})
                  </Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs text-slate-500 hover:text-white px-2"
                    onClick={() => {
                      setDesignElements([]);
                      setSelectedElement(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1.5 layer-panel">
                  <AnimatePresence>
                    {designElements.map((element, index) => {
                      const layerMethod = printingMethods.find(m => m.id === element.printingMethodId);
                      
                      return (
                        <motion.div
                          key={element.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`group rounded-lg border transition-all ${
                            selectedElement === element.id
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-slate-800 hover:border-slate-700 bg-slate-800/30'
                          }`}
                        >
                          {/* Layer Header */}
                          <div 
                            className="flex items-center gap-2 p-2 cursor-pointer"
                            onClick={() => setSelectedElement(element.id)}
                          >
                            <img
                              src={element.imageUrl}
                              alt={`Layer ${index + 1}`}
                              className="w-10 h-10 object-cover rounded border border-slate-700"
                              style={getPrintingMethodStyles(element.printingMethodId)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white truncate">
                                Layer {designElements.length - index}
                              </p>
                              <p className="text-xs text-slate-500">
                                {pixelsToInches(element.width).toFixed(1)}" × {pixelsToInches(element.height).toFixed(1)}"
                              </p>
                              {element.printingMethodId && (
                                <p className="text-xs text-cyan-400 font-medium">
                                  ₹{calculateLayerCost(element).toFixed(2)}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElement(element.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Per-Layer Printing Method */}
                          <div className="px-2 pb-2">
                            <Select 
                              value={element.printingMethodId || ''} 
                              onValueChange={(value) => {
                                setDesignElements(prev => prev.map(el => 
                                  el.id === element.id ? { ...el, printingMethodId: value } : el
                                ));
                                toast.success('Printing method applied!');
                              }}
                            >
                              <SelectTrigger className="bg-slate-900 border-slate-700 text-white h-9 text-xs">
                                <SelectValue placeholder="Select printing..." />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {printingMethods.filter(m => m.isActive).map(method => (
                                  <SelectItem key={method.id} value={method.id} className="text-white text-xs">
                                    <div className="flex items-center justify-between w-full gap-2">
                                      <span className="truncate">{method.name}</span>
                                      <span className="text-cyan-400 font-medium">₹{method.costPerSquareInch}/inch²</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {/* Show visual effect badge */}
                            {layerMethod?.visualEffect && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400 flex items-center gap-1.5"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span className="truncate">{layerMethod.visualEffect.type}</span>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Summary */}
            {(selectedColor || selectedSize || selectedFabric || selectedPrintingMethod) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700 rounded-xl space-y-2"
              >
                <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Summary
                </Label>
                {selectedPrintingMethod && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Method:</span>
                    <span className="text-white font-medium">{printingMethod?.name}</span>
                  </div>
                )}
                {selectedColor && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Color:</span>
                    <span className="text-white">{selectedColor}</span>
                  </div>
                )}
                {selectedSize && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-white">{selectedSize}</span>
                  </div>
                )}
                {selectedFabric && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Fabric:</span>
                    <span className="text-white">{selectedFabric}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Total:</span>
                    <span className="text-xl font-bold text-cyan-400">₹{printingCost}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}