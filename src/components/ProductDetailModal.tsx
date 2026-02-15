import { useState, useEffect } from 'react';
import { Product, ProductVariation } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { ShoppingCart, Check, Palette, Ruler, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { TwoDDesigner } from './TwoDDesigner';
import { storageUtils } from '../utils/storage';
import { toast } from 'sonner';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, variationId: string, quantity: number) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [is2DDesignerOpen, setIs2DDesignerOpen] = useState(false);
  const [modelConfig, setModelConfig] = useState<any>(null);

  // Initialize selected variation based on color and size
  useEffect(() => {
    if (product) {
      if (selectedColor && selectedSize) {
        const variation = product.variations.find(v => v.color === selectedColor && v.size === selectedSize);
        setSelectedVariation(variation || null);
      } else if (selectedColor) {
        const variation = product.variations.find(v => v.color === selectedColor);
        // Don't auto-set variation yet, wait for size
      }
    }
  }, [selectedColor, selectedSize, product]);

  // Reset state when opening a new product
  useEffect(() => {
    if (isOpen) {
      setSelectedVariation(null);
      setQuantity(1);
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [isOpen, product]);

  // Load 3D model config for this product
  useEffect(() => {
    if (product) {
      const config = storageUtils.get3DModelConfigByProductId(product.id);
      setModelConfig(config);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (selectedVariation) {
      onAddToCart(product.id, selectedVariation.id, quantity);
      onClose();
    }
  };

  const handle2DDesignerClick = () => {
    // Check if external 3D website integration is enabled
    const integration = storageUtils.get3DWebsiteIntegration();
    
    if (integration.isEnabled && integration.websiteUrl) {
      // Open external 3D designer website in new tab
      window.open(integration.websiteUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening 3D Designer...', {
        description: 'Create your design and it will be saved to your account'
      });
      return;
    }
    
    // Fallback to internal 3D designer
    if (!modelConfig) {
      toast.error('3D Designer not configured for this product', {
        description: 'Please contact admin to set up 3D customization'
      });
      return;
    }
    setIs2DDesignerOpen(true);
  };

  const handleSaveDesign = (design: any) => {
    const currentUser = storageUtils.getCurrentUser();
    if (!currentUser) {
      toast.error('Please login to save designs');
      return;
    }

    const savedDesign = {
      id: Date.now().toString(),
      name: `${product.name} - Custom Design`,
      productId: product.id,
      color: design.color,
      size: design.size,
      fabric: design.fabric,
      printingMethod: design.printingMethod,
      printingCost: design.printingCost,
      designUploads: design.designUploads,
      createdAt: new Date().toISOString(),
      thumbnailUrl: design.thumbnailUrl,
      category: product.category,
      canvasSnapshot: design.canvasSnapshot,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name || currentUser.email,
      paymentStatus: 'unpaid' as const
    };

    currentUser.savedCustomerDesigns = currentUser.savedCustomerDesigns || [];
    currentUser.savedCustomerDesigns.push(savedDesign);
    storageUtils.updateCurrentUser(currentUser);

    toast.success('Design saved to your Studio!');
    setIs2DDesignerOpen(false);
  };

  const uniqueColors = [...new Set(product.variations.map(v => v.color))];
  const uniqueSizes = [...new Set(product.variations.map(v => v.size))];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0e1a] border-cyan-500/20 glass-card p-0 rounded-3xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 h-full">
          {/* Left Side: Image Gallery */}
          <div className="relative bg-[#0f172a]/50 p-6 flex items-center justify-center border-r border-cyan-500/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl border border-white/5"
              >
                <ImageWithFallback
                  src={product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute top-10 left-10">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                Premium Collection
              </span>
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="p-8 space-y-8">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-cyan-400">{product.gender}</span>
              </div>
              <DialogTitle className="text-3xl font-bold text-white tracking-tight">
                {product.name}
              </DialogTitle>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  ₹{selectedVariation ? selectedVariation.price.toLocaleString('en-IN') : product.basePrice.toLocaleString('en-IN')}
                </span>
                {selectedVariation && selectedVariation.price > product.basePrice && (
                  <span className="text-slate-500 line-through text-sm">₹{product.basePrice.toLocaleString('en-IN')}</span>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <p className="text-slate-400 leading-relaxed text-sm">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3 h-3" />
                    Color: <span className="text-cyan-400">{selectedColor || 'Select'}</span>
                  </Label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative w-10 h-10 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor === color ? 'border-cyan-400 scale-110' : 'border-white/10 hover:border-white/30'
                      }`}
                      title={color}
                    >
                      <div 
                        className="w-full h-full rounded-full shadow-inner" 
                        style={{ backgroundColor: color.toLowerCase() }} 
                      />
                      {selectedColor === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className={`w-4 h-4 ${['white', 'yellow', 'beige'].includes(color.toLowerCase()) ? 'text-black' : 'text-white'}`} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Ruler className="w-3 h-3" />
                    Size: <span className="text-cyan-400">{selectedSize || 'Select'}</span>
                  </Label>
                  <button className="text-[10px] text-slate-500 hover:text-cyan-400 underline uppercase tracking-widest transition-colors font-bold">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueSizes.map((size) => {
                    const isAvailable = product.variations.some(v => v.size === size && (selectedColor ? v.color === selectedColor : true));
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[50px] h-10 px-3 rounded-lg border text-sm font-bold transition-all ${
                          selectedSize === size
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : isAvailable
                            ? 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/10'
                            : 'bg-transparent border-white/5 text-slate-700 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & Stock Info */}
              {selectedVariation && (
                <div className="flex items-end gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3 flex-1">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      Quantity
                    </Label>
                    <Select
                      value={quantity.toString()}
                      onValueChange={(val) => setQuantity(parseInt(val))}
                    >
                      <SelectTrigger className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f172a] border-cyan-500/30 text-slate-200">
                        {Array.from({ length: Math.min(selectedVariation.stock, 10) }, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-3">
                    <p className={`text-xs font-bold uppercase tracking-wider ${selectedVariation.stock < 10 ? 'text-orange-400' : 'text-green-400'}`}>
                      {selectedVariation.stock < 10 ? `Only ${selectedVariation.stock} left!` : 'In Stock'}
                    </p>
                  </div>
                </div>
              )}

              {/* Printing Methods Tag */}
              {product.printingMethods.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Available Print Methods</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.printingMethods.map((method) => (
                      <span key={method} className="bg-white/5 border border-white/10 text-slate-400 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-4">
              {/* 3D Designer Button */}
              {modelConfig && (
                <Button
                  className="w-full py-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold border-0 glow-button shadow-2xl transition-all active:scale-[0.98]"
                  onClick={handle2DDesignerClick}
                >
                  <Palette className="w-5 h-5 mr-3" />
                  Create 3D Design
                </Button>
              )}
              
              <Button
                className="w-full py-7 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-lg border-0 glow-button shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={!selectedVariation}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                {selectedVariation 
                  ? `Add to Cart • ₹${(selectedVariation.price * quantity).toLocaleString('en-IN')}` 
                  : 'Select Color & Size'}
              </Button>
              
              <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  10-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* 3D Designer Modal */}
      {modelConfig && (
        <TwoDDesigner
          isOpen={is2DDesignerOpen}
          onClose={() => setIs2DDesignerOpen(false)}
          modelConfig={modelConfig}
          productName={product.name}
          onSaveDesign={handleSaveDesign}
        />
      )}
    </Dialog>
  );
}