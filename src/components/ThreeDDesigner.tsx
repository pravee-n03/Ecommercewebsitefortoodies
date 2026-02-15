import React, { useState, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  Upload, 
  Trash2, 
  ShoppingCart, 
  Image as ImageIcon,
  X,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { ThreeDModelConfig, CustomerDesignUpload } from '../types';

interface ThreeDDesignerProps {
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
    designUploads: CustomerDesignUpload[];
  }) => void;
}

export function ThreeDDesigner({
  isOpen,
  onClose,
  modelConfig,
  productName,
  onSaveDesign
}: ThreeDDesignerProps) {
  const [selectedColor, setSelectedColor] = useState(modelConfig.defaultColor || modelConfig.availableColors[0]);
  const [selectedSize, setSelectedSize] = useState(modelConfig.defaultSize || modelConfig.availableSizes[0]);
  const [selectedFabric, setSelectedFabric] = useState(modelConfig.defaultFabric || modelConfig.availableFabrics[0]);
  const [selectedPrintingMethod, setSelectedPrintingMethod] = useState(
    modelConfig.printingMethods.find(m => m.isActive)?.id || modelConfig.printingMethods[0]?.id
  );
  const [designUploads, setDesignUploads] = useState<CustomerDesignUpload[]>([]);
  const [selectedUpload, setSelectedUpload] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const printingMethod = modelConfig.printingMethods.find(m => m.id === selectedPrintingMethod);
  const totalPrintingCost = printingMethod ? printingMethod.costPerUnit * designUploads.length : 0;

  const modelDisplayUrl = modelConfig.glbFileUrl || modelConfig.modelUrl;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newUpload: CustomerDesignUpload = {
        id: Date.now().toString(),
        imageUrl,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        area: 'Front'
      };
      setDesignUploads([...designUploads, newUpload]);
      toast.success('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteUpload = (id: string) => {
    setDesignUploads(designUploads.filter(u => u.id !== id));
    if (selectedUpload === id) {
      setSelectedUpload(null);
    }
    toast.success('Design removed');
  };

  const handleSave = () => {
    if (designUploads.length === 0) {
      toast.error('Please add at least one design');
      return;
    }

    if (!printingMethod) {
      toast.error('Please select a printing method');
      return;
    }

    onSaveDesign({
      color: selectedColor,
      size: selectedSize,
      fabric: selectedFabric,
      printingMethod: printingMethod.name,
      printingCost: totalPrintingCost,
      designUploads
    });

    toast.success('Design saved to your Studio!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`glass-card border-cyan-500/30 ${isFullscreen ? 'max-w-[95vw] h-[95vh]' : 'max-w-6xl'}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-cyan-100 text-2xl flex items-center gap-3">
                <span className="text-3xl">🎨</span>
                Toodies 3D Studio
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Customize {productName} with your own designs
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-slate-400 hover:text-white"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="space-y-6">
            <Card className="glass-card border-cyan-500/20">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className="text-cyan-300 text-xs uppercase tracking-wider mb-2 block">
                    Product Color
                  </Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-5 rounded border border-white/30" 
                            style={{ backgroundColor: selectedColor }}
                          />
                          <span>{selectedColor}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="glass-card border-cyan-500/30">
                      {modelConfig.availableColors.map(color => (
                        <SelectItem key={color} value={color} className="text-white">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 rounded border border-white/30" 
                              style={{ backgroundColor: color }}
                            />
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-cyan-300 text-xs uppercase tracking-wider mb-2 block">
                    Size
                  </Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-cyan-500/30">
                      {modelConfig.availableSizes.map(size => (
                        <SelectItem key={size} value={size} className="text-white">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-cyan-300 text-xs uppercase tracking-wider mb-2 block">
                    Fabric
                  </Label>
                  <Select value={selectedFabric} onValueChange={setSelectedFabric}>
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-cyan-500/30">
                      {modelConfig.availableFabrics.map(fabric => (
                        <SelectItem key={fabric} value={fabric} className="text-white">
                          {fabric}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-cyan-300 text-xs uppercase tracking-wider mb-2 block">
                    Printing Method
                  </Label>
                  <Select value={selectedPrintingMethod} onValueChange={setSelectedPrintingMethod}>
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-cyan-500/30">
                      {modelConfig.printingMethods.filter(m => m.isActive).map(method => (
                        <SelectItem key={method.id} value={method.id} className="text-white">
                          <div>
                            <div className="font-bold">{method.name}</div>
                            <div className="text-xs text-slate-400">₹{method.costPerUnit} per design</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {printingMethod && (
                    <div className="mt-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-300">
                          {printingMethod.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Printing Cost:</span>
                  <span className="text-pink-400 font-bold">₹{totalPrintingCost}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {designUploads.length} design(s) × ₹{printingMethod?.costPerUnit || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <Card className="glass-card border-cyan-500/20 overflow-hidden">
              <CardContent className="p-0">
                <div style={{ height: isFullscreen ? '70vh' : '500px' }} className="relative bg-[#0a0e1a]">
                  {modelDisplayUrl ? (
                    <div className="w-full h-full relative flex items-center justify-center">
                      {/* 2D Mockup Background */}
                      <img
                        src={modelDisplayUrl}
                        alt="Product Mockup"
                        className="w-full h-full object-contain"
                        style={{ filter: `hue-rotate(${selectedColor === 'red' ? '0deg' : selectedColor === 'blue' ? '240deg' : selectedColor === 'green' ? '120deg' : '0deg'})` }}
                      />
                      
                      {/* Overlaid Customer Designs */}
                      {designUploads.map((upload, index) => (
                        <div
                          key={upload.id}
                          className="absolute"
                          style={{
                            top: '30%',
                            left: '50%',
                            transform: `translate(-50%, -50%) translateX(${index * 10}px)`,
                            width: '30%',
                            maxWidth: '200px',
                            opacity: 0.9
                          }}
                        >
                          <img
                            src={upload.imageUrl}
                            alt={`Design ${index + 1}`}
                            className="w-full h-auto object-contain rounded-lg shadow-2xl"
                          />
                        </div>
                      ))}
                      
                      {/* Info Overlay */}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <p className="text-cyan-400 text-xs font-bold">
                          {printingMethod?.name || 'Select Printing Method'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-slate-500">No 2D mockup configured for this product</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-cyan-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-sm">Your Designs ({designUploads.length})</h3>
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {designUploads.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {designUploads.map(upload => (
                      <motion.div
                        key={upload.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 ${
                          selectedUpload === upload.id ? 'border-cyan-500' : 'border-slate-700'
                        }`}
                        onClick={() => setSelectedUpload(upload.id)}
                      >
                        <img
                          src={upload.imageUrl}
                          alt="Design"
                          className="w-full h-20 object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUpload(upload.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No designs uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-6 text-lg"
                disabled={designUploads.length === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Save Design (��{totalPrintingCost} printing)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}