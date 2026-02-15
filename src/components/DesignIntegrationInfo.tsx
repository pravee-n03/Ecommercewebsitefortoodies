import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { ExternalLink, ArrowRight, CheckCircle2, Upload, ShoppingCart, FileText, Palette, Copy, Link as LinkIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

export function DesignIntegrationInfo() {
  const steps = [
    {
      icon: Palette,
      title: 'Launch 3D Designer',
      description: 'Click "Launch 3D Studio" to open the external 3D designer tool in a new tab',
      color: 'cyan'
    },
    {
      icon: ExternalLink,
      title: 'Create Your Design',
      description: 'Use the 3D designer to customize your product with colors, text, images, and graphics',
      color: 'teal'
    },
    {
      icon: Upload,
      title: 'Save & Return',
      description: 'The 3D designer automatically saves your design and returns you to Toodies with the design URL',
      color: 'cyan'
    },
    {
      icon: CheckCircle2,
      title: 'Auto-Save to Studio',
      description: 'Your design is automatically saved to your "Studio" tab where you can view all saved designs',
      color: 'teal'
    },
    {
      icon: ShoppingCart,
      title: 'Add to Cart',
      description: 'From your Studio, click "Add to Cart" on any design to purchase it',
      color: 'cyan'
    },
    {
      icon: FileText,
      title: 'Order Processing',
      description: 'Admin receives your design URL and can download it for production',
      color: 'teal'
    }
  ];

  const urlExample = `https://toodies.com/?designUrl=YOUR_DESIGN_FILE&productId=T001&designName=Custom_Design&color=Red&size=L&category=T-Shirts&variationId=v5`;

  const copyUrlExample = () => {
    navigator.clipboard.writeText(urlExample);
    toast.success('Example URL copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <Card className="glass-card border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-teal-500/5">
        <CardHeader>
          <CardTitle className="text-cyan-100 text-2xl flex items-center gap-3">
            <Palette className="w-6 h-6 text-cyan-400" />
            How 3D Design Integration Works
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            Learn how custom designs flow from external 3D designer tools into your Toodies orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Workflow Steps */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full" />
              Complete Workflow
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className={`glass-card border-${step.color}-500/20 bg-gradient-to-br from-${step.color}-500/5 to-transparent h-full`}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-${step.color}-500/10 border border-${step.color}-500/30 flex items-center justify-center`}>
                          <step.icon className={`w-5 h-5 text-${step.color}-400`} />
                        </div>
                        <span className={`text-xs font-black text-${step.color}-500/50 tracking-wider`}>
                          STEP {index + 1}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-base">{step.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow connector (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-cyan-500/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* URL Return Mechanism */}
          <div className="border-t border-white/5 pt-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full" />
              Technical: URL Return Mechanism
            </h3>
            
            <p className="text-slate-400 text-sm">
              When you finish designing, the 3D designer tool redirects you back to Toodies with your design information encoded in the URL:
            </p>

            <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-4 overflow-x-auto">
              <code className="text-cyan-400 text-xs font-mono whitespace-nowrap block">
                {urlExample}
              </code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800/40 border border-teal-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full" />
                  <span className="text-[10px] font-black text-teal-400 uppercase tracking-wider">Required</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">designUrl</p>
                <p className="text-slate-500 text-xs">Link to your saved design file</p>
              </div>

              <div className="bg-slate-800/40 border border-teal-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Optional</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">productId</p>
                <p className="text-slate-500 text-xs">Product being customized (e.g., T001)</p>
              </div>

              <div className="bg-slate-800/40 border border-teal-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">Optional</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">designName</p>
                <p className="text-slate-500 text-xs">Custom name for your design</p>
              </div>

              <div className="bg-slate-800/40 border border-pink-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-wider">Optional</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">color</p>
                <p className="text-slate-500 text-xs">Product color variant (e.g., Red, Blue)</p>
              </div>

              <div className="bg-slate-800/40 border border-pink-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-wider">Optional</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">size</p>
                <p className="text-slate-500 text-xs">Product size variant (e.g., S, M, L, XL)</p>
              </div>

              <div className="bg-slate-800/40 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Optional</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">category</p>
                <p className="text-slate-500 text-xs">Product category (e.g., T-Shirts, Hoodies)</p>
              </div>

              <div className="bg-slate-800/40 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">Optional</span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">variationId</p>
                <p className="text-slate-500 text-xs">Specific product variation ID</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={copyUrlExample}
                variant="outline"
                size="sm"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Copy className="w-3 h-3 mr-2" />
                Copy Example URL
              </Button>
            </div>
          </div>

          {/* NEW: Product Variation Tracking */}
          <div className="border-t border-white/5 pt-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
              Product Variation Tracking
            </h3>
            
            <p className="text-slate-400 text-sm">
              The system now captures detailed product variation information along with your design:
            </p>

            <Card className="glass-card border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-pink-400 font-bold text-sm mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Captured Automatically
                    </h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-pink-500 mt-1 font-bold">→</span>
                        <span><strong className="text-white">Color:</strong> The specific color variant (e.g., "Black", "White", "Navy")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-500 mt-1 font-bold">→</span>
                        <span><strong className="text-white">Size:</strong> The size selected (e.g., "S", "M", "L", "XL", "XXL")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-500 mt-1 font-bold">→</span>
                        <span><strong className="text-white">Category:</strong> Product category (e.g., "T-Shirts", "Hoodies", "Sweatshirts")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-500 mt-1 font-bold">→</span>
                        <span><strong className="text-white">Variation ID:</strong> Unique identifier for exact product variant</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-purple-400 font-bold text-sm mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Why This Matters
                    </h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1 font-bold">✓</span>
                        <span><strong className="text-white">Accurate Production:</strong> Admin knows exact product specs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1 font-bold">✓</span>
                        <span><strong className="text-white">Inventory Tracking:</strong> System can track stock by variation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1 font-bold">✓</span>
                        <span><strong className="text-white">Order Fulfillment:</strong> No confusion about which variant to print</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1 font-bold">✓</span>
                        <span><strong className="text-white">Customer History:</strong> Customers can see which variant they designed</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-black/20 rounded-lg border border-pink-500/20">
                  <p className="text-xs text-pink-300 uppercase tracking-wider mb-2 font-bold">Example Scenario</p>
                  <p className="text-slate-300 text-sm">
                    Customer designs a logo on a <strong className="text-white">Red, Size L</strong> t-shirt. When they save the design, the system records: 
                    <span className="text-pink-400"> designUrl + productId + color=Red + size=L + category=T-Shirts</span>. 
                    Admin can see all these details in the "Customer Designs" tab.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Storage */}
          <div className="border-t border-white/5 pt-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full" />
              What Gets Saved
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl p-6 space-y-3">
                <h4 className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  In Your Studio
                </h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    <span>Design URL (link to your design file)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    <span>Design name and creation date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    <span>Associated product information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    <span>Preview thumbnail (if available)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-xl p-6 space-y-3">
                <h4 className="text-teal-400 font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  In Your Orders
                </h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Product details with custom design flag</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Direct link to your design file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Admin can view/download for production</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span>Included in order invoice/PDF</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="border-t border-white/5 pt-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full" />
              Quick Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex gap-3 p-4 bg-slate-800/40 border border-cyan-500/10 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Save Multiple Designs</p>
                  <p className="text-slate-400 text-xs">You can save unlimited designs to your Studio and add them to cart later</p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-slate-800/40 border border-cyan-500/10 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Manual URL Entry</p>
                  <p className="text-slate-400 text-xs">You can also manually paste a design URL if you have one from a previous session</p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-slate-800/40 border border-cyan-500/10 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Design Indicator</p>
                  <p className="text-slate-400 text-xs">Cart items with custom designs show a "Custom Design Linked" badge</p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-slate-800/40 border border-cyan-500/10 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm mb-1">High Resolution</p>
                  <p className="text-slate-400 text-xs">Design files should be high-resolution (300 DPI minimum) for best print quality</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}