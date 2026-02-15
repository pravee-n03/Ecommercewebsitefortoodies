import { Product } from '../types';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart, Sparkles, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { storageUtils } from '../utils/storage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDesigner?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onOpenDesigner }: ProductCardProps) {
  const minPrice = Math.min(...product.variations.map(v => v.price));
  const maxPrice = Math.max(...product.variations.map(v => v.price));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [has2DModel, setHas2DModel] = useState(false);

  useEffect(() => {
    const config = storageUtils.get3DModelConfigByProductId(product.id);
    setHas2DModel(!!config);
  }, [product.id]);
  
  // Use multiple images if available, otherwise fall back to single image
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];

  // Auto-rotate images on hover
  useEffect(() => {
    if (!isHovered || displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }, 1000); // Change image every 1 second

    return () => clearInterval(interval);
  }, [isHovered, displayImages.length]);

  // Reset to first image when not hovering
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden glass-card glass-card-hover border-cyan-500/20">
        <div className="aspect-square overflow-hidden bg-[#0f172a]/30 relative">
          {displayImages.length > 0 ? (
            <>
              <ImageWithFallback
                src={displayImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent opacity-60" />
              {/* Image indicators */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                  {displayImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'w-6 bg-cyan-400'
                          : 'w-1.5 bg-slate-500/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No Image
            </div>
          )}
          <div className="absolute top-3 right-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-cyan-500/30 to-teal-500/30 p-2 rounded-lg backdrop-blur-sm border border-cyan-500/30"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </motion.div>
          </div>
        </div>
        <CardContent className="pt-4">
          <h3 className="font-semibold text-lg mb-1 text-cyan-100">{product.name}</h3>
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                ₹{minPrice.toFixed(2)}
                {minPrice !== maxPrice && ` - ₹${maxPrice.toFixed(2)}`}
              </p>
              <p className="text-xs text-slate-500 capitalize">{product.gender}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.variations.slice(0, 3).map((v) => (
                <motion.div
                  key={v.id}
                  whileHover={{ scale: 1.2 }}
                  className="w-5 h-5 rounded-full border-2 border-cyan-500/40 shadow-lg"
                  style={{ backgroundColor: v.color.toLowerCase() }}
                  title={v.color}
                />
              ))}
              {product.variations.length > 3 && (
                <span className="text-xs text-slate-400 flex items-center">+{product.variations.length - 3}</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {has2DModel && onOpenDesigner && (
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold border-0 rounded-xl glow-button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDesigner(product);
              }}
            >
              <Palette className="w-4 h-4 mr-2" />
              Create 2D Design
            </Button>
          )}
          <Button
            className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white glow-button border-0 rounded-xl"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}