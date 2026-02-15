import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  Globe, 
  Save,
  ExternalLink,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Image as ImageIcon,
  Eye,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { storageUtils } from '../utils/storage';
import { SavedCustomerDesign } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export function ThreeDWebsiteSettings() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [designCategories, setDesignCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [allDesigns, setAllDesigns] = useState<Array<SavedCustomerDesign & { userId: string; userEmail: string }>>([]);
  const [selectedDesign, setSelectedDesign] = useState<SavedCustomerDesign | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadSettings();
    loadAllCustomerDesigns();
  }, []);

  const loadSettings = () => {
    const integration = storageUtils.get3DWebsiteIntegration();
    setWebsiteUrl(integration.websiteUrl);
    setIsEnabled(integration.isEnabled);
    setDesignCategories(integration.designCategories || []);
  };

  const loadAllCustomerDesigns = () => {
    const users = storageUtils.getUsers();
    const designs: Array<SavedCustomerDesign & { userId: string; userEmail: string }> = [];
    
    users.forEach(user => {
      if (user.savedCustomerDesigns && user.savedCustomerDesigns.length > 0) {
        user.savedCustomerDesigns.forEach(design => {
          designs.push({
            ...design,
            userId: user.id,
            userEmail: user.email
          });
        });
      }
    });
    
    // Sort by creation date, newest first
    designs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllDesigns(designs);
  };

  const handleSave = () => {
    if (!websiteUrl.trim()) {
      toast.error('Please enter a valid website URL');
      return;
    }

    storageUtils.update3DWebsiteIntegration({
      websiteUrl: websiteUrl.trim(),
      isEnabled,
      designCategories
    });

    toast.success('3D website integration settings saved!');
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    if (designCategories.includes(newCategory.trim())) {
      toast.error('Category already exists');
      return;
    }

    setDesignCategories([...designCategories, newCategory.trim()]);
    setNewCategory('');
    toast.success('Category added');
  };

  const handleRemoveCategory = (category: string) => {
    setDesignCategories(designCategories.filter(c => c !== category));
    toast.success('Category removed');
  };

  const handleDownloadPDF = async (design: SavedCustomerDesign & { userId: string; userEmail: string }) => {
    try {
      toast.info('PDF generation coming soon!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    }
  };

  const handleDownloadImage = async (design: SavedCustomerDesign) => {
    try {
      // Download the snapshot URL directly
      if (design.snapshotUrl) {
        const link = document.createElement('a');
        link.href = design.snapshotUrl;
        link.download = `design-${design.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Design image downloaded!');
      } else {
        toast.error('No snapshot available');
      }
    } catch (error) {
      toast.error('Failed to download image');
      console.error(error);
    }
  };

  const handlePreview = (design: SavedCustomerDesign) => {
    setSelectedDesign(design);
    setIsPreviewOpen(true);
  };

  const paidDesigns = allDesigns.filter(d => d.paymentStatus === 'paid');
  const unpaidDesigns = allDesigns.filter(d => d.paymentStatus !== 'paid');

  return (
    <div className="space-y-6">
      {/* Integration Settings */}
      <Card className="bg-[#0f1729]/50 border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Globe className="w-5 h-5" />
                3D Website Integration
              </CardTitle>
              <CardDescription>
                Configure external 3D designer website integration
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {isEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="websiteUrl" className="text-cyan-400">
              External 3D Designer URL
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="websiteUrl"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://your-3d-designer-website.com"
                className="bg-[#0a0f1e] border-cyan-500/30 text-white flex-1"
              />
              {websiteUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(websiteUrl, '_blank')}
                  className="border-cyan-500/30 hover:bg-cyan-500/10"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This URL will be opened when customers click "Create 3D Design"
            </p>
          </div>

          <div>
            <Label className="text-cyan-400">Design Categories</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                className="bg-[#0a0f1e] border-cyan-500/30 text-white"
              />
              <Button
                onClick={handleAddCategory}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {designCategories.map(category => (
                <Badge
                  key={category}
                  className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                >
                  {category}
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-2 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Paid Designs */}
      <Card className="bg-[#0f1729]/50 border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            Paid Designs ({paidDesigns.length})
          </CardTitle>
          <CardDescription>
            Customer designs with completed payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {paidDesigns.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No paid designs yet
                </p>
              ) : (
                paidDesigns.map(design => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#0a0f1e] border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{design.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Customer: {design.userEmail}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>Order: {design.orderId || 'N/A'}</span>
                          <span>•</span>
                          <span>{design.color} / {design.size}</span>
                          <span>•</span>
                          <span>₹{design.printingCost}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(design.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(design)}
                          className="border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadImage(design)}
                          className="border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadPDF(design)}
                          className="border-green-500/30 hover:bg-green-500/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Unpaid Designs */}
      <Card className="bg-[#0f1729]/50 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-400">
            <XCircle className="w-5 h-5" />
            Unpaid Designs ({unpaidDesigns.length})
          </CardTitle>
          <CardDescription>
            Customer designs awaiting payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {unpaidDesigns.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No unpaid designs
                </p>
              ) : (
                unpaidDesigns.map(design => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#0a0f1e] border border-yellow-500/20 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{design.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Customer: {design.userEmail}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>{design.color} / {design.size}</span>
                          <span>•</span>
                          <span>₹{design.printingCost}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(design.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreview(design)}
                          className="border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent 
          className="max-w-3xl bg-[#0f1729] border-cyan-500/30"
          aria-describedby="design-preview-description"
        >
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Design Preview</DialogTitle>
            <DialogDescription id="design-preview-description">
              View design details and uploaded images
            </DialogDescription>
          </DialogHeader>
          {selectedDesign && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Design Name</Label>
                  <p className="text-white">{selectedDesign.name}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Category</Label>
                  <p className="text-white">{selectedDesign.category || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Color</Label>
                  <p className="text-white">{selectedDesign.color}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Size</Label>
                  <p className="text-white">{selectedDesign.size}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Fabric</Label>
                  <p className="text-white">{selectedDesign.fabric}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Printing Method</Label>
                  <p className="text-white">{selectedDesign.printingMethod}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Printing Cost</Label>
                  <p className="text-white">₹{selectedDesign.printingCost}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Payment Status</Label>
                  <Badge className={selectedDesign.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                    {selectedDesign.paymentStatus || 'unpaid'}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-400">Design Uploads ({selectedDesign.designUploads.length})</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {selectedDesign.designUploads.map((upload, index) => (
                    <div key={upload.id} className="p-3 bg-[#0a0f1e] border border-cyan-500/20 rounded-lg">
                      <div className="aspect-square bg-[#1a1a2e] rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        <img 
                          src={upload.imageUrl} 
                          alt={`Design ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-gray-400">Area: {upload.area}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}