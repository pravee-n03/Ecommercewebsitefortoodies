import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Package, Plus, Edit, Trash2, LogOut, ShoppingBag, Settings, Upload, X, Ticket, Users, Tag, MessageSquare, Bell, LayoutDashboard, TrendingUp, AlertTriangle, DollarSign, HeadphonesIcon, Building2, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, ProductVariation } from '../types';
import { storageUtils } from '../utils/storage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { OrderManagement } from './OrderManagement';
import { AdminSettings } from './AdminSettings';
import { CategoryManagement } from './CategoryManagement';
import { CouponManagement } from './CouponManagement';
import { CustomerManagement } from './CustomerManagement';
import { MessageTemplateManagement } from './MessageTemplateManagement';
import { PopupManagement } from './PopupManagement';
import { HelpCenterManagement } from './HelpCenterManagement';
import { BusinessSettings } from './BusinessSettings';
import { DesignIntegrationInfo } from './DesignIntegrationInfo';
import { CustomerDesignsManagement } from './CustomerDesignsManagement';
import { AdminDesignOrders } from './AdminDesignOrders';
import { ThreeDModelManager } from './ThreeDModelManager';
import { ThreeDWebsiteSettings } from './ThreeDWebsiteSettings';
import { PrintingMethodsManagement } from './PrintingMethodsManagement';
import { ProductModelStatus } from './ProductModelStatus';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
  });

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [basePrice, setBasePrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [printingMethods, setPrintingMethods] = useState<string[]>([]);

  // Variation form
  const [varColor, setVarColor] = useState('#000000');
  const [varColorName, setVarColorName] = useState('');
  const [varSize, setVarSize] = useState('');
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('');

  // Printing method
  const [newPrintMethod, setNewPrintMethod] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  const loadProducts = () => {
    setProducts(storageUtils.getProducts());
  };

  const loadStats = () => {
    const totalProducts = storageUtils.getProducts().length;
    const totalOrders = storageUtils.getOrders().length;
    const totalCustomers = storageUtils.getUsers().length;
    const totalRevenue = storageUtils.getOrders().reduce((acc, order) => acc + order.total, 0);
    const pendingOrders = storageUtils.getOrders().filter(order => order.status === 'pending').length;
    const lowStockProducts = storageUtils.getProducts().filter(product => product.variations.some(variation => variation.stock < 10)).length;

    setStats({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
    });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setGender('unisex');
    setBasePrice('');
    setImage('');
    setImages([]);
    setVariations([]);
    setPrintingMethods([]);
    setEditingProduct(null);
  };

  const handleAddVariation = () => {
    if (!varColor || !varSize || !varPrice || !varStock) {
      toast.error('Please fill all variation fields');
      return;
    }

    const newVariation: ProductVariation = {
      id: Date.now().toString(),
      color: varColor,
      size: varSize,
      price: parseFloat(varPrice),
      stock: parseInt(varStock)
    };

    setVariations([...variations, newVariation]);
    setVarColor('#000000');
    setVarColorName('');
    setVarSize('');
    setVarPrice('');
    setVarStock('');
    toast.success('Variation added');
  };

  const handleRemoveVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const handleAddPrintingMethod = () => {
    if (!newPrintMethod) return;
    if (!printingMethods.includes(newPrintMethod)) {
      setPrintingMethods([...printingMethods, newPrintMethod]);
      setNewPrintMethod('');
      toast.success('Printing method added');
    }
  };

  const handleRemovePrintingMethod = (method: string) => {
    setPrintingMethods(printingMethods.filter(m => m !== method));
  };

  const handleAddImage = () => {
    if (!newImageUrl) return;
    if (images.length >= 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    if (!images.includes(newImageUrl)) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
      toast.success('Image added');
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setImages(images.filter(img => img !== imageUrl));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
          toast.success(`${file.name} uploaded`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category || !basePrice || variations.length === 0) {
      toast.error('Please fill all required fields and add at least one variation');
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name,
      description,
      category,
      gender,
      basePrice: parseFloat(basePrice),
      image,
      images,
      variations,
      printingMethods,
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    };

    if (editingProduct) {
      storageUtils.updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully');
    } else {
      storageUtils.addProduct(productData);
      toast.success('Product added successfully');
    }

    loadProducts();
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setCategory(product.category);
    setGender(product.gender);
    setBasePrice(product.basePrice.toString());
    setImage(product.image);
    setImages(product.images);
    setVariations([...product.variations]);
    setPrintingMethods([...product.printingMethods]);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      storageUtils.deleteProduct(productId);
      loadProducts();
      toast.success('Product deleted');
    }
  };

  const handleLogout = () => {
    storageUtils.logoutAdmin();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-cyan-100 glow-text">Admin Dashboard</h1>
            <p className="text-slate-400">Manage Toodies Products & Orders</p>
          </div>
          <div className="flex gap-4">
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card border-cyan-500/30 bg-[#0f172a]">
                <DialogHeader>
                  <DialogTitle className="text-cyan-100">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    {editingProduct ? 'Edit the product details below' : 'Add a new product to your store'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-cyan-100">Product Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Classic T-Shirt"
                        className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-cyan-100">Category *</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {storageUtils.getCategories().map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-400">
                        Manage categories in the Categories tab
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-cyan-100">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product description"
                      rows={3}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-cyan-100">Gender</Label>
                      <Select value={gender} onValueChange={(value: any) => setGender(value)}>
                        <SelectTrigger className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                          <SelectItem value="unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="basePrice" className="text-cyan-100">Base Price *</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        placeholder="1999"
                        className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-cyan-100">Main Image URL</Label>
                      <Input
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                        className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Variations */}
                  <div className="space-y-3">
                    <Label className="text-cyan-100">Product Variations *</Label>
                    <Card className="glass-card border-cyan-500/20">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-6 gap-2 mb-3">
                          <div className="col-span-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={varColor}
                                onChange={(e) => setVarColor(e.target.value)}
                                className="w-12 h-10 rounded cursor-pointer bg-transparent border border-cyan-500/30"
                                title="Pick a color"
                              />
                              <Input
                                placeholder="Hex Code (e.g., #000000)"
                                value={varColor}
                                onChange={(e) => setVarColor(e.target.value)}
                                className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 font-mono text-sm flex-1"
                              />
                            </div>
                          </div>
                          <Input
                            placeholder="Size"
                            value={varSize}
                            onChange={(e) => setVarSize(e.target.value)}
                            className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                          />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={varPrice}
                            onChange={(e) => setVarPrice(e.target.value)}
                            className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                          />
                          <Input
                            type="number"
                            placeholder="Stock"
                            value={varStock}
                            onChange={(e) => setVarStock(e.target.value)}
                            className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddVariation}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"
                          >
                            Add
                          </Button>
                        </div>
                        {variations.length > 0 && (
                          <div className="space-y-2">
                            {variations.map((v) => (
                              <div key={v.id} className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-8 h-8 rounded-md border-2 border-white/20 shadow-lg"
                                    style={{ backgroundColor: v.color }}
                                    title={v.color}
                                  />
                                  <span className="text-sm text-cyan-100">
                                    <span className="font-mono text-xs text-slate-400">{v.color}</span> - {v.size} - ₹{v.price} ({v.stock} in stock)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveVariation(v.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Printing Methods */}
                  <div className="space-y-3">
                    <Label className="text-cyan-100">Printing Methods</Label>
                    <Card className="glass-card border-cyan-500/20">
                      <CardContent className="pt-6">
                        <div className="flex gap-2 mb-3">
                          <Input
                            placeholder="e.g., Screen Print, DTG, Embroidery"
                            value={newPrintMethod}
                            onChange={(e) => setNewPrintMethod(e.target.value)}
                            className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddPrintingMethod}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"
                          >
                            Add
                          </Button>
                        </div>
                        {printingMethods.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {printingMethods.map((method) => (
                              <div key={method} className="bg-teal-500/20 border border-teal-500/30 text-teal-200 px-3 py-1 rounded-full flex items-center gap-2">
                                <span className="text-sm">{method}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePrintingMethod(method)}
                                  className="hover:bg-teal-500/30 rounded-full p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Images */}
                  <div className="space-y-3">
                    <Label className="text-cyan-100">Product Images (3-4 recommended)</Label>
                    <p className="text-xs text-slate-400">Add multiple images to show in carousel on hover</p>
                    <Card className="glass-card border-cyan-500/20">
                      <CardContent className="pt-6">
                        <div className="flex gap-2 mb-3">
                          <Input
                            placeholder="Image URL"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddImage}
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400"
                          >
                            Add URL
                          </Button>
                        </div>
                        <div className="flex gap-2 mb-3">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageFileUpload}
                            className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                          />
                        </div>
                        {images.length > 0 && (
                          <div className="space-y-2">
                            {images.map((imageUrl, index) => (
                              <div key={index} className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xs text-cyan-400 font-mono">#{index + 1}</span>
                                  <span className="text-sm text-cyan-100 truncate">{imageUrl.substring(0, 50)}...</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveImage(imageUrl)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-2"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-[#0f172a]/50 border border-cyan-500/20 p-1 rounded-2xl h-auto flex flex-wrap gap-2 justify-start">
            <TabsTrigger 
              value="dashboard"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="categories"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Tag className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="coupons"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Coupons
            </TabsTrigger>
            <TabsTrigger 
              value="customers"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger 
              value="orders"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger 
              value="helpcenter"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <HeadphonesIcon className="w-4 h-4 mr-2" />
              Help Center
            </TabsTrigger>
            <TabsTrigger 
              value="messages"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="popups"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Bell className="w-4 h-4 mr-2" />
              Popups
            </TabsTrigger>
            <TabsTrigger 
              value="business"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Business Info
            </TabsTrigger>
            <TabsTrigger 
              value="3dintegration"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Palette className="w-4 h-4 mr-2" />
              2D Integration
            </TabsTrigger>
            <TabsTrigger 
              value="customerdesigns"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Palette className="w-4 h-4 mr-2" />
              Customer Designs
            </TabsTrigger>
            <TabsTrigger 
              value="3dmodels"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Palette className="w-4 h-4 mr-2" />
              2D Models
            </TabsTrigger>
            <TabsTrigger 
              value="3dwebsite"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Palette className="w-4 h-4 mr-2" />
              2D Website
            </TabsTrigger>
            <TabsTrigger 
              value="printingmethods"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Palette className="w-4 h-4 mr-2" />
              Printing Methods
            </TabsTrigger>
            <TabsTrigger 
              value="designorders"
              className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all whitespace-nowrap"
            >
              <Package className="w-4 h-4 mr-2" />
              Design Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <Card className="glass-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-100">Dashboard Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm text-cyan-300">Total Products</h3>
                          <h2 className="text-xl font-bold text-cyan-100">{stats.totalProducts}</h2>
                        </div>
                        <Package className="w-6 h-6 text-cyan-500" />
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm text-cyan-300">Total Orders</h3>
                          <h2 className="text-xl font-bold text-cyan-100">{stats.totalOrders}</h2>
                        </div>
                        <ShoppingBag className="w-6 h-6 text-cyan-500" />
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm text-cyan-300">Total Customers</h3>
                          <h2 className="text-xl font-bold text-cyan-100">{stats.totalCustomers}</h2>
                        </div>
                        <Users className="w-6 h-6 text-cyan-500" />
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm text-cyan-300">Total Revenue</h3>
                          <h2 className="text-xl font-bold text-cyan-100">₹{stats.totalRevenue.toFixed(2)}</h2>
                        </div>
                        <DollarSign className="w-6 h-6 text-cyan-500" />
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm text-cyan-300">Pending Orders</h3>
                          <h2 className="text-xl font-bold text-cyan-100">{stats.pendingOrders}</h2>
                        </div>
                        <AlertTriangle className="w-6 h-6 text-cyan-500" />
                      </div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm text-cyan-300">Low Stock Products</h3>
                          <h2 className="text-xl font-bold text-cyan-100">{stats.lowStockProducts}</h2>
                        </div>
                        <AlertTriangle className="w-6 h-6 text-cyan-500" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product & 2D Model Status */}
              <ProductModelStatus />
            </div>
          </TabsContent>
          
          <TabsContent value="products">
            <Card className="glass-card border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-100">Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No products yet. Add your first product!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-cyan-500/20 hover:bg-transparent">
                          <TableHead className="text-cyan-300">Name</TableHead>
                          <TableHead className="text-cyan-300">Category</TableHead>
                          <TableHead className="text-cyan-300">Gender</TableHead>
                          <TableHead className="text-cyan-300">Base Price</TableHead>
                          <TableHead className="text-cyan-300">Variations</TableHead>
                          <TableHead className="text-cyan-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} className="border-cyan-500/10 hover:bg-cyan-500/5">
                            <TableCell className="font-medium text-cyan-100">{product.name}</TableCell>
                            <TableCell className="text-slate-300">{product.category}</TableCell>
                            <TableCell className="capitalize text-slate-300">{product.gender}</TableCell>
                            <TableCell className="text-teal-400">₹{product.basePrice.toFixed(2)}</TableCell>
                            <TableCell className="text-slate-300">{product.variations.length}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(product)}
                                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(product.id)}
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
          
          <TabsContent value="coupons">
            <CouponManagement />
          </TabsContent>
          
          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
          
          <TabsContent value="helpcenter">
            <HelpCenterManagement />
          </TabsContent>
          
          <TabsContent value="messages">
            <MessageTemplateManagement />
          </TabsContent>
          
          <TabsContent value="popups">
            <PopupManagement />
          </TabsContent>
          
          <TabsContent value="business">
            <BusinessSettings />
          </TabsContent>
          
          <TabsContent value="3dintegration">
            <DesignIntegrationInfo />
          </TabsContent>
          
          <TabsContent value="customerdesigns">
            <CustomerDesignsManagement />
          </TabsContent>
          
          <TabsContent value="3dmodels">
            <ThreeDModelManager />
          </TabsContent>
          
          <TabsContent value="3dwebsite">
            <ThreeDWebsiteSettings />
          </TabsContent>
          
          <TabsContent value="printingmethods">
            <PrintingMethodsManagement />
          </TabsContent>
          
          <TabsContent value="designorders">
            <AdminDesignOrders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}