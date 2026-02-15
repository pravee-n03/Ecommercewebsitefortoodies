import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, CheckCircle2, Loader2, Camera, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { CustomDesign, Product } from '../types';
import { storageUtils } from '../utils/storage';

interface DesignerBridgeProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (design: Partial<CustomDesign>) => void;
  product: Product | null;
}

export function DesignerBridge({ isOpen, onClose, onSave, product }: DesignerBridgeProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [designerUrl, setDesignerUrl] = useState('');

  useEffect(() => {
    // Load the 3D designer URL from admin settings
    const settings = storageUtils.getAdminSettings();
    setDesignerUrl(settings.designerUrl || '');
  }, []);

  // This effect simulates listening to an external 3D website via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In a real scenario, check event.origin for security
      if (event.data?.type === 'TOODIES_DESIGN_COMPLETE') {
        processIncomingDesign(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const processIncomingDesign = (payload: any) => {
    setIsImporting(true);
    
    // Simulate processing the "All Angles" photos and 3D data
    setTimeout(() => {
      const newDesign: Partial<CustomDesign> = {
        name: `Custom ${product?.name || 'Item'} - ${new Date().toLocaleDateString()}`,
        designUrl: payload.url || 'https://3d-tool.com/design/xyz',
        allAnglesImages: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400', // Front
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400', // Side
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400', // Back
        ],
        productId: product?.id || '1',
      };
      
      onSave(newDesign);
      setIsImporting(false);
      onClose();
      toast.success('Design successfully imported from 3D Tool!');
    }, 2000);
  };

  const openExternalDesigner = () => {
    if (!designerUrl) {
      toast.error('3D Designer URL not configured. Please contact admin.', {
        description: 'Admin needs to set up the 3D Designer URL in Settings.'
      });
      return;
    }

    if (!product) {
      toast.error('Product information missing');
      return;
    }

    // Get current user for customerId
    const user = storageUtils.getCurrentUser();
    
    // Build the URL with parameters for the external designer
    const params = new URLSearchParams({
      productId: product.id,
      productName: product.name,
      category: product.category,
      returnUrl: window.location.origin, // Where to redirect after design is complete
      customerId: user?.id || 'guest'
    });

    const fullDesignerUrl = `${designerUrl}?${params.toString()}`;
    
    // Open the external 3D designer in a new tab
    window.open(fullDesignerUrl, '_blank', 'noopener,noreferrer');
    
    toast.success('Opening 3D Designer...', {
      description: 'When you finish designing, save it and you\'ll be redirected back here.'
    });
    
    // Close the bridge modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
        
        <motion.div 
          className={`relative glass-card border-cyan-500/30 flex flex-col overflow-hidden transition-all duration-500 rounded-3xl ${
            isFullScreen ? 'w-full h-full' : 'w-full max-w-6xl h-[85vh]'
          }`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          {/* Bridge Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#0f172a]/80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-white font-bold flex items-center gap-2">
                3D Designer Integration 
                <span className="text-cyan-400 text-xs font-normal border border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-500/10 uppercase tracking-widest">
                  Active Connection
                </span>
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-white"
                onClick={() => setIsFullScreen(!isFullScreen)}
              >
                {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-red-400"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Iframe Area */}
          <div className="flex-1 bg-slate-900 relative">
            {isImporting ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-md">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">Importing Your 3D Assets</h4>
                <p className="text-slate-400 text-center max-w-xs">Capturing detailed photos from all angles for the production team...</p>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-16 h-16 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-cyan-400/50" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                <div className="max-w-2xl w-full">
                  <div className="w-24 h-24 bg-purple-500/10 border-2 border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20">
                    <ExternalLink className="w-12 h-12 text-purple-400" />
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-4">Ready to Design?</h4>
                  <p className="text-slate-400 mb-3 leading-relaxed text-lg">
                    Click below to open your custom 3D designer tool in a new tab.
                  </p>
                  <p className="text-slate-500 mb-10 text-sm max-w-md mx-auto">
                    After you finish designing, your 3D tool should redirect you back here with the design URL. The design will be automatically saved to your account.
                  </p>
                  
                  <div className="flex flex-col gap-4 items-center">
                    {designerUrl ? (
                      <>
                        <Button 
                          onClick={openExternalDesigner}
                          className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-400 hover:via-pink-400 hover:to-cyan-400 text-white px-10 h-16 rounded-2xl glow-button text-lg font-bold shadow-2xl shadow-purple-500/30"
                        >
                          <ExternalLink className="w-6 h-6 mr-3" />
                          Open 3D Designer
                        </Button>
                        
                        <div className="mt-6 glass-card p-4 rounded-xl border border-cyan-500/20 max-w-lg">
                          <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">Designer URL:</p>
                          <p className="text-sm text-cyan-400 font-mono break-all">{designerUrl}</p>
                        </div>
                      </>
                    ) : (
                      <div className="glass-card p-6 rounded-2xl border border-red-500/30 bg-red-500/5 max-w-md">
                        <p className="text-red-400 font-semibold mb-2">⚠️ 3D Designer Not Configured</p>
                        <p className="text-slate-400 text-sm">
                          The admin needs to set up the 3D Designer URL in the Admin Settings panel before you can use this feature.
                        </p>
                      </div>
                    )}
                    
                    {/* SIMULATION BUTTON FOR DEMO - Only show if designer URL is not configured */}
                    {!designerUrl && (
                      <div className="mt-8 pt-8 border-t border-slate-800">
                        <p className="text-slate-500 text-xs mb-4 uppercase tracking-wider font-bold">Demo Mode</p>
                        <Button 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 h-12 rounded-2xl"
                          onClick={() => processIncomingDesign({ url: 'https://demo-3d-tool.com/save/123' })}
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Simulate Design Save
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* The Actual Iframe (Commented out until ready) */}
            {/* <iframe 
                src="https://your-3d-tool.com?embedded=true&primaryColor=teal" 
                className="w-full h-full border-0"
                allow="camera; microphone; fullscreen; display-capture"
            /> */}
          </div>

          <div className="px-6 py-4 bg-[#0a0e1a] border-t border-cyan-500/20 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex justify-between items-center">
            <span>Encrypted Tunnel Active</span>
            <span className="text-cyan-400">Toodies Data Bridge v1.0</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}