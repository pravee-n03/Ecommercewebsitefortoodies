import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Home, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { TwoDDesigner } from './TwoDDesigner';
import { storageUtils } from '../utils/storage';
import { Product, User, ThreeDModelConfig } from '../types';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';

interface TwoDStudioPageProps {
  onBack: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export function TwoDStudioPage({ onBack, user, onUserUpdate }: TwoDStudioPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modelConfig, setModelConfig] = useState<ThreeDModelConfig | null>(null);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [user]);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, selectedBrand, products]);

  const loadProducts = () => {
    const allProducts = storageUtils.getProducts();
    const productsWithModels = allProducts.filter(p => {
      const config = storageUtils.get3DModelConfigByProductId(p.id);
      return config !== null;
    });
    setProducts(productsWithModels);

    console.log('=== 2D STUDIO PAGE LOADED ===');
    console.log('Total products in store:', allProducts.length);
    console.log('Products with 2D models:', productsWithModels.length);
    console.log('Products with models:', productsWithModels.map(p => ({ id: p.id, name: p.name, category: p.category })));
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Brand filtering could be added here if you have a brand field in products
    // For now, we'll keep it simple with just category filtering

    setFilteredProducts(filtered);
  };

  const handleProductSelect = (product: Product) => {
    const config = storageUtils.get3DModelConfigByProductId(product.id);
    if (!config) {
      toast.error('2D configuration not found for this product');
      return;
    }

    // Validate configuration has required fields
    const errors: string[] = [];
    
    if (!config.availableColors || config.availableColors.length === 0) {
      errors.push('colors');
    }
    if (!config.availableSizes || config.availableSizes.length === 0) {
      errors.push('sizes');
    }
    if (!config.availableFabrics || config.availableFabrics.length === 0) {
      errors.push('fabrics');
    }
    if (!config.printingMethods || config.printingMethods.length === 0) {
      errors.push('printing methods');
    }

    if (errors.length > 0) {
      toast.error(
        `Configuration incomplete: Missing ${errors.join(', ')}`,
        {
          description: 'Please complete the model configuration in Admin Panel → 2D Model Manager'
        }
      );
      return;
    }

    // All validations passed, open designer
    setSelectedProduct(product);
    setModelConfig(config);
    setIsDesignerOpen(true);
  };

  const handleSaveDesign = (design: any) => {
    const updatedUser = { ...user };
    updatedUser.savedCustomerDesigns = updatedUser.savedCustomerDesigns || [];
    
    const savedDesign = {
      id: Date.now().toString(),
      name: `${selectedProduct?.name} - Custom Design`,
      productId: selectedProduct!.id,
      color: design.color,
      size: design.size,
      fabric: design.fabric,
      printingMethod: design.printingMethod,
      printingCost: design.printingCost,
      designUploads: design.designUploads,
      createdAt: new Date().toISOString(),
      thumbnailUrl: design.thumbnailUrl,
      category: selectedProduct?.category
    };

    updatedUser.savedCustomerDesigns.push(savedDesign);
    storageUtils.updateCurrentUser(updatedUser);
    onUserUpdate(updatedUser);

    toast.success('Design saved successfully!', {
      description: 'Your custom design has been saved to your profile.'
    });

    setIsDesignerOpen(false);
    setSelectedProduct(null);
  };

  // Get unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  
  // Count products per category
  const getCategoryCount = (category: string) => {
    if (category === 'All') return products.length;
    return products.filter(p => p.category === category).length;
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    loadProducts();
    toast.info('Viewing all models');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              onClick={() => {
                console.log('=== DEBUG: ALL CONFIGS ===');
                const allConfigs = storageUtils.get3DModelConfigs();
                console.log('Total configs:', allConfigs.length);
                allConfigs.forEach((config, i) => {
                  console.log(`\nConfig ${i + 1}:`, {
                    id: config.id,
                    productId: config.productId,
                    productName: config.productName,
                    mockupImageUrl: config.mockupImageUrl ? config.mockupImageUrl.substring(0, 50) + '...' : 'NONE',
                    modelUrl: config.modelUrl ? config.modelUrl.substring(0, 50) + '...' : 'NONE',
                    hasImage: !!(config.mockupImageUrl || config.modelUrl)
                  });
                });
                
                console.log('\n=== DEBUG: ALL PRODUCTS ===');
                const allProducts = storageUtils.getProducts();
                console.log('Total products:', allProducts.length);
                allProducts.forEach((product, i) => {
                  const hasConfig = storageUtils.get3DModelConfigByProductId(product.id);
                  console.log(`\nProduct ${i + 1}:`, {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    hasConfig: !!hasConfig
                  });
                });
                
                toast.success('Check browser console for debug info');
              }}
              className="bg-cyan-500 text-white hover:bg-cyan-600"
            >
              🔍 Debug Configs
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {!isDesignerOpen ? (
          <div className="space-y-8">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Free Online 2D Mockup Studio
              </h1>
              <p className="text-gray-600 text-lg">
                Choose a Mockup, Upload Your Design, and Export - <span className="font-semibold">no complex software or file downloads required</span>
              </p>
            </motion.div>

            {/* Category Filter Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-md font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Brand/Subcategory Filter Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center flex-wrap gap-3"
            >
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors border-gray-300 text-gray-700"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({getCategoryCount(category)})
                </Badge>
              ))}
            </motion.div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
              >
                {filteredProducts.map((product, index) => {
                  const config = storageUtils.get3DModelConfigByProductId(product.id);
                  const mockupImage = config?.mockupImageUrl || config?.modelUrl;

                  // Debug logging
                  console.log(`Product: ${product.name} (ID: ${product.id})`);
                  console.log('Config:', config);
                  console.log('Mockup Image URL:', mockupImage);

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group cursor-pointer"
                      onClick={() => handleProductSelect(product)}
                    >
                      <Card className="overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-all hover:shadow-xl bg-white">
                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {mockupImage ? (
                            <img
                              src={mockupImage}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Palette className="w-20 h-20 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-center space-y-3">
                              <Button className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-6 text-lg">
                                <Palette className="w-5 h-5 mr-2" />
                                Start Designing
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <CardContent className="p-4 bg-white">
                          <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-1">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-black font-bold text-xl">
                                ₹{Math.min(...product.variations.map(v => v.price))}
                              </span>
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <Card className="max-w-md mx-auto border-2 border-gray-200">
                  <CardContent className="pt-12 pb-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                      <Palette className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 text-2xl font-bold mb-3">No Models Available</h3>
                    <p className="text-gray-600 mb-6">
                      {selectedCategory === 'All' 
                        ? 'There are no 2D models configured yet. Please configure them in the Admin Panel.'
                        : `No 2D models available in the "${selectedCategory}" category. Try selecting a different category.`
                      }
                    </p>
                <Button
                  onClick={resetFilters}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  View Models
                </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        ) : null}
      </div>

      {/* 2D Designer Modal */}
      {isDesignerOpen && selectedProduct && modelConfig && (
        <TwoDDesigner
          isOpen={isDesignerOpen}
          modelConfig={modelConfig}
          productName={selectedProduct.name}
          onClose={() => {
            setIsDesignerOpen(false);
            setSelectedProduct(null);
            setModelConfig(null);
          }}
          onSaveDesign={(design) => {
            console.log('Design saved from studio page:', design);
            toast.success('Design saved successfully!');
            setIsDesignerOpen(false);
            setSelectedProduct(null);
            setModelConfig(null);
            // Refresh user data
            const updatedUser = storageUtils.getCurrentUser();
            if (updatedUser) {
              onUserUpdate(updatedUser);
            }
          }}
          existingDesignId={undefined}
        />
      )}
    </div>
  );
}
