import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Edit3, ShoppingCart, Download, Clock, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { designDB, DesignData } from '../utils/indexedDB';
import { storageUtils } from '../utils/storage';
import { DesignCheckoutModal } from './DesignCheckoutModal';
import { submitDesignToFigma, downloadDesignFile } from '../utils/figmaSubmission';

interface StudioMyCustomDesignsProps {
  onEditDesign?: (designId: string) => void;
}

export function StudioMyCustomDesigns({ onEditDesign }: StudioMyCustomDesignsProps) {
  const [designs, setDesigns] = useState<DesignData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<DesignData | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const currentUser = storageUtils.getCurrentUser();

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      if (!currentUser) return;
      
      const userDesigns = await designDB.getUserDesigns(currentUser.id);
      
      // Sort by timestamp (newest first)
      userDesigns.sort((a, b) => b.timestamp - a.timestamp);
      
      setDesigns(userDesigns);
    } catch (error) {
      console.error('Failed to load designs:', error);
      toast.error('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (designId: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    try {
      await designDB.deleteDesign(designId);
      setDesigns(prev => prev.filter(d => d.id !== designId));
      toast.success('Design deleted');
    } catch (error) {
      console.error('Failed to delete design:', error);
      toast.error('Failed to delete design');
    }
  };

  const handleBuyNow = (design: DesignData) => {
    if (design.isLocked) {
      toast.error('This design has already been purchased');
      return;
    }
    
    setSelectedDesign(design);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = async (paymentDetails: any) => {
    if (!selectedDesign || !currentUser) return;

    try {
      // Get customer name and email
      const customerName = currentUser.name || currentUser.mobile;
      const customerEmail = currentUser.email || `${currentUser.mobile}@toodies.com`;

      // Submit design to Figma
      const figmaResult = await submitDesignToFigma(selectedDesign, {
        orderId: paymentDetails.orderId,
        paymentId: paymentDetails.paymentId,
        customerName,
        customerEmail,
        customerPhone: paymentDetails.phone,
        deliveryAddress: paymentDetails.deliveryAddress
      });

      if (figmaResult.success) {
        // Update design status in database
        await designDB.updateDesignStatus(selectedDesign.id, 'paid', {
          isLocked: true,
          orderId: paymentDetails.orderId,
          paymentId: paymentDetails.paymentId,
          figmaFileUrl: figmaResult.fileUrl
        });

        // Refresh designs
        await loadDesigns();

        toast.success('Order placed successfully!', {
          description: `Order ID: ${paymentDetails.orderId}`
        });
      } else {
        toast.error('Payment successful but Figma submission failed', {
          description: 'Please contact support with your order ID'
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Failed to process order');
    } finally {
      setShowCheckout(false);
      setSelectedDesign(null);
    }
  };

  const handleDownload = (design: DesignData) => {
    const fileName = `${design.productName}_${design.color}_${design.size}_${design.id}`;
    downloadDesignFile(design.fullResolutionSnapshot, fileName);
    toast.success('Design downloaded!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading your designs...</div>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="w-16 h-16 text-slate-600 mb-4" />
        <p className="text-slate-400 text-lg mb-2">No saved designs yet</p>
        <p className="text-slate-500 text-sm">Start creating your custom design!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {designs.map((design) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="glass-card border-cyan-500/20 overflow-hidden hover:border-cyan-500/40 transition-all">
                {/* Design Preview */}
                <div className="relative aspect-square bg-slate-900/50 group">
                  <img
                    src={design.previewSnapshot || design.fullResolutionSnapshot}
                    alt={design.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  {design.paymentStatus === 'paid' && (
                    <div className="absolute top-2 right-2 px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                      ✓ PAID
                    </div>
                  )}
                  
                  {design.isLocked && (
                    <div className="absolute top-2 left-2 px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                      🔒 MERGED
                    </div>
                  )}
                  
                  {/* Info badge showing it's a merged image */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs">
                    Model + {design.designLayers.length} Layer{design.designLayers.length > 1 ? 's' : ''}
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 text-white border-0"
                      onClick={() => handleDownload(design)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Design Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold mb-2 truncate">{design.productName}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-slate-500">Color:</span>
                      <span className="text-cyan-400 ml-1">{design.color}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Size:</span>
                      <span className="text-cyan-400 ml-1">{design.size}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Fabric:</span>
                      <span className="text-cyan-400 ml-1">{design.fabric}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Layers:</span>
                      <span className="text-cyan-400 ml-1">{design.designLayers.length}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3 p-2 bg-slate-900/50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Total Price:</span>
                      <span className="text-cyan-400 font-bold text-lg">
                        ₹{design.basePrice + design.printingCost}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Base: ₹{design.basePrice} + Printing: ₹{design.printingCost}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Clock className="w-3 h-3" />
                    {new Date(design.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {/* Actions */}
                  {design.paymentStatus === 'unpaid' ? (
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0"
                        onClick={() => handleBuyNow(design)}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Buy Now
                      </Button>
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => handleDownload(design)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download Design
                        </Button>
                        <p className="text-xs text-slate-500 mt-1 text-center">
                          2400x2400 PNG
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {design.orderId && (
                        <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-xs text-green-400 font-semibold">Order ID:</p>
                          <p className="text-xs text-white font-mono">{design.orderId}</p>
                        </div>
                      )}
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          onClick={() => handleDownload(design)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download High-Quality PNG
                        </Button>
                        <p className="text-xs text-slate-500 mt-1 text-center">
                          2400x2400 • 100% Quality
                        </p>
                      </div>
                      {design.figmaFileUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => window.open(design.figmaFileUrl, '_blank')}
                        >
                          View in Figma
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Delete Button (only for unpaid) */}
                  {design.paymentStatus === 'unpaid' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full mt-2 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDelete(design.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Checkout Modal */}
      {selectedDesign && (
        <DesignCheckoutModal
          open={showCheckout}
          onClose={() => {
            setShowCheckout(false);
            setSelectedDesign(null);
          }}
          designData={{
            productName: selectedDesign.productName,
            productPrice: selectedDesign.basePrice,
            customizationCost: selectedDesign.printingCost,
            designSnapshot: selectedDesign.fullResolutionSnapshot,
            color: selectedDesign.color,
            size: selectedDesign.size,
            fabric: selectedDesign.fabric
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
