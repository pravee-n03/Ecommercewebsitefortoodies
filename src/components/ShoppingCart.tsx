import { CartItem, Product } from '../types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';
import { ShoppingCart as CartIcon, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'motion/react';

interface ShoppingCartProps {
  cart: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, variationId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variationId: string) => void;
  onCheckout: () => void;
}

export function ShoppingCart({ cart, products, onUpdateQuantity, onRemoveItem, onCheckout }: ShoppingCartProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartItemDetails = (item: CartItem) => {
    const product = products.find(p => p.id === item.productId);
    const variation = product?.variations.find(v => v.id === item.variationId);
    return { product, variation };
  };

  const subtotal = cart.reduce((sum, item) => {
    const { variation } = getCartItemDetails(item);
    return sum + (variation?.price || 0) * item.quantity;
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative h-11 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-xl px-4 group">
          <CartIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-cyan-500 to-teal-500 border-0 shadow-lg shadow-cyan-900/50 min-w-[20px] justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-[#0a0e1a] border-l border-cyan-500/20 p-0 overflow-hidden">
        <SheetHeader className="p-6 border-b border-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <SheetTitle className="text-white text-xl">Your Cart</SheetTitle>
              <SheetDescription className="text-slate-500">
                {totalItems} items ready for checkout
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center">
                <CartIcon className="w-10 h-10 text-slate-600" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Your cart is empty</p>
                <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-xl mt-4">
                  Start Shopping
                </Button>
              </SheetTrigger>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {cart.map((item) => {
                  const { product, variation } = getCartItemDetails(item);
                  if (!product || !variation) return null;

                  return (
                    <motion.div 
                      key={`${item.productId}-${item.variationId}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative flex gap-4 bg-[#0f172a]/40 border border-white/5 p-4 rounded-2xl hover:border-cyan-500/30 transition-all"
                    >
                      <div className="w-20 h-20 bg-slate-800/50 rounded-xl flex-shrink-0 overflow-hidden border border-white/5">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-sm truncate pr-2">{product.name}</h4>
                            <button
                              onClick={() => onRemoveItem(item.productId, item.variationId)}
                              className="text-slate-600 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">
                            {variation.color} • {variation.size}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-bold text-cyan-400 text-sm">
                            ₹{variation.price.toLocaleString('en-IN')}
                          </p>
                          <div className="flex items-center bg-[#0a0e1a] rounded-lg border border-white/10 p-1">
                            <button
                              onClick={() => onUpdateQuantity(item.productId, item.variationId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 hover:bg-white/5 rounded text-slate-400 disabled:opacity-30 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.productId, item.variationId, item.quantity + 1)}
                              disabled={item.quantity >= variation.stock}
                              className="p-1 hover:bg-white/5 rounded text-slate-400 disabled:opacity-30 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        {item.customDesignUrl && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit">
                            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                            <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Custom Design Linked</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-6 bg-[#0f172a]/50 border-t border-cyan-500/10 sm:flex-col space-y-4">
            <div className="space-y-3 w-full">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm uppercase tracking-widest font-bold">Subtotal</span>
                <span className="text-white font-bold text-lg">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500 uppercase tracking-widest font-bold">Shipping & Tax</span>
                <span className="text-slate-400 font-bold">Calculated at checkout</span>
              </div>
            </div>

            <Button 
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-lg border-0 glow-button rounded-2xl group shadow-2xl"
              onClick={onCheckout}
            >
              Checkout Now
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold">
              Secure Checkout Powered by Toodies
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
