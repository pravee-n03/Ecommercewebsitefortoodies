import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Palette, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { ThreeDModelConfig } from '../types';
import { storageUtils } from '../utils/storage';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ModelsBrowserProps {
  onSelectModel: (config: ThreeDModelConfig) => void;
}

export function ModelsBrowser({ onSelectModel }: ModelsBrowserProps) {
  const [models, setModels] = useState<ThreeDModelConfig[]>([]);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = () => {
    const allModels = storageUtils.get3DModelConfigs();
    setModels(allModels);
  };

  if (models.length === 0) {
    return (
      <Card className=\"glass-card border-cyan-500/20 p-12 text-center\">
        <Palette className=\"w-16 h-16 text-slate-600 mx-auto mb-4\" />
        <h3 className=\"text-xl font-bold text-slate-400 mb-2\">No Models Available Yet</h3>
        <p className=\"text-slate-500\">Admin hasn't uploaded any design models. Check back soon!</p>
      </Card>
    );
  }

  return (
    <div className=\"space-y-6\">
      <div className=\"flex items-center justify-between\">
        <div>
          <h3 className=\"text-xl font-bold text-white\">Available Models</h3>
          <p className=\"text-slate-500 text-sm\">Choose a model to start designing</p>
        </div>
        <div className=\"px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20\">
          <span className=\"text-cyan-400 font-bold\">{models.length} Model{models.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6\">
        {models.map((model, index) => {
          // Get the product associated with this model
          const products = storageUtils.getProducts();
          const product = products.find(p => p.id === model.productId);

          return (
            <motion.div
              key={model.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className=\"group overflow-hidden glass-card glass-card-hover border-cyan-500/20 cursor-pointer\"
                onClick={() => onSelectModel(model)}
              >
                {/* Model Preview */}
                <div className=\"aspect-square overflow-hidden bg-[#0f172a]/30 relative\">
                  {model.modelUrl ? (
                    <>
                      <ImageWithFallback
                        src={model.modelUrl}
                        alt={product?.name || 'Design Model'}
                        className=\"w-full h-full object-cover group-hover:scale-110 transition-transform duration-500\"
                      />
                      <div className=\"absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent opacity-60\" />
                    </>
                  ) : (
                    <div className=\"w-full h-full flex items-center justify-center text-slate-500\">
                      <Palette className=\"w-12 h-12\" />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className=\"absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center\">
                    <Button className=\"bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0\">
                      <Palette className=\"w-4 h-4 mr-2\" />
                      Start Designing
                    </Button>
                  </div>

                  {/* Badge */}
                  <div className=\"absolute top-3 right-3\">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className=\"bg-gradient-to-br from-cyan-500/30 to-teal-500/30 p-2 rounded-lg backdrop-blur-sm border border-cyan-500/30\"
                    >
                      <Sparkles className=\"w-4 h-4 text-cyan-400\" />
                    </motion.div>
                  </div>
                </div>

                {/* Model Info */}
                <CardContent className=\"pt-4\">
                  <h3 className=\"font-semibold text-lg mb-2 text-cyan-100\">
                    {product?.name || 'Design Template'}
                  </h3>
                  
                  <div className=\"space-y-2 text-xs text-slate-400\">
                    <div className=\"flex items-center justify-between\">
                      <span>Colors:</span>
                      <span className=\"text-cyan-400 font-bold\">{model.availableColors?.length || 0}</span>
                    </div>
                    <div className=\"flex items-center justify-between\">
                      <span>Sizes:</span>
                      <span className=\"text-cyan-400 font-bold\">{model.availableSizes?.length || 0}</span>
                    </div>
                    <div className=\"flex items-center justify-between\">
                      <span>Print Methods:</span>
                      <span className=\"text-cyan-400 font-bold\">{model.printingMethods?.length || 0}</span>
                    </div>
                  </div>

                  <div className=\"mt-3 pt-3 border-t border-white/10\">
                    <p className=\"font-bold text-xl bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent\">
                      From ₹{model.modelPrice?.toFixed(2) || '0.00'}
                    </p>
                    <p className=\"text-[10px] text-slate-500 uppercase tracking-wide\">
                      {product?.category || 'Custom Design'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
