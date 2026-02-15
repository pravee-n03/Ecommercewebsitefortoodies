import { useState, useEffect } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerAuth } from './components/CustomerAuth';
import { CustomerDashboard } from './components/CustomerDashboard';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { TwoDStudioPage } from './components/TwoDStudioPage';
import { StudioMyCustomDesigns } from './components/StudioMyCustomDesigns';
import { Button } from './components/ui/button';
import { storageUtils } from './utils/storage';
import { User, CustomDesign } from './types';
import { Toaster } from './components/ui/sonner';
import { Shield, Store, Sparkles, Palette, ShoppingBag, Phone, Mail, MapPin, Users, MessageCircle, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import toodiesLogo from 'figma:asset/d31f1d417f75594ba1ab67a4c64ef32e85ec2234.png';
import tigerIcon from 'figma:asset/0384d838979de15e8db05f2eef126aa9e88613fe.png';

type ViewMode = 'landing' | 'admin' | 'customer' | 'privacy' | 'terms' | '2dstudio';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for admin access via URL param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin_portal')) {
      setViewMode('admin');
    }

    // Check if user is already logged in
    const user = storageUtils.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setViewMode('customer');
      
      // Check if design URL is present in URL params (returned from 2D designer)
      handleDesignUrlFromParams(urlParams, user);
    }
    
    // Check if admin is already authenticated
    if (storageUtils.isAdminAuthenticated()) {
      setIsAdminAuthenticated(true);
      setViewMode('admin');
    }

    // Add some sample products if none exist
    const products = storageUtils.getProducts();
    if (products.length === 0) {
      initializeSampleProducts();
    }
  }, []);

  const handleDesignUrlFromParams = (urlParams: URLSearchParams, user: User) => {
    const designUrl = urlParams.get('designUrl');
    const productId = urlParams.get('productId');
    const designName = urlParams.get('designName');
    const color = urlParams.get('color');
    const size = urlParams.get('size');
    const category = urlParams.get('category');
    const variationId = urlParams.get('variationId');
    
    if (designUrl) {
      // Create a new custom design from the URL parameters
      const newDesign: CustomDesign = {
        id: Date.now().toString(),
        name: designName || `Custom Design - ${new Date().toLocaleDateString()}`,
        designUrl: designUrl,
        productId: productId || '1',
        variationId: variationId,
        color: color || undefined,
        size: size || undefined,
        category: category || undefined,
        createdAt: new Date().toISOString(),
      };
      
      // Add to user's saved designs
      const updatedUser = {
        ...user,
        savedDesigns: [...(user.savedDesigns || []), newDesign]
      };
      
      storageUtils.updateCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
      
      // Clean up URL by removing the design parameters
      window.history.replaceState({}, '', window.location.pathname);
      
      toast.success('Design saved successfully! Check "My Designs" tab to view it.', {
        duration: 5000,
      });
    }
  };

  const initializeSampleProducts = () => {
    const sampleProducts = [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        description: 'Premium quality cotton t-shirt, perfect for everyday wear and custom designs',
        category: 'T-Shirts',
        gender: 'unisex' as const,
        basePrice: 1999,
        image: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=500',
        images: [], // Multiple images can be added by admin
        variations: [
          { id: 'v1', color: 'White', size: 'S', price: 1999, stock: 50 },
          { id: 'v2', color: 'White', size: 'M', price: 1999, stock: 75 },
          { id: 'v3', color: 'White', size: 'L', price: 1999, stock: 60 },
          { id: 'v4', color: 'White', size: 'XL', price: 2199, stock: 40 },
          { id: 'v5', color: 'Black', size: 'M', price: 1999, stock: 65 },
          { id: 'v6', color: 'Black', size: 'L', price: 1999, stock: 55 },
        ],
        printingMethods: ['Screen Print', 'DTG', 'Vinyl'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Premium Hoodie',
        description: 'Comfortable and stylish hoodie, perfect for customization',
        category: 'Hoodies',
        gender: 'unisex' as const,
        basePrice: 3999,
        image: 'https://images.unsplash.com/photo-1646514336754-1c3fe17e28c2?w=500',
        images: [],
        variations: [
          { id: 'v7', color: 'Black', size: 'M', price: 3999, stock: 30 },
          { id: 'v8', color: 'Black', size: 'L', price: 3999, stock: 25 },
          { id: 'v9', color: 'Gray', size: 'M', price: 3999, stock: 35 },
          { id: 'v10', color: 'Gray', size: 'L', price: 3999, stock: 40 },
          { id: 'v11', color: 'Navy', size: 'L', price: 3999, stock: 20 },
        ],
        printingMethods: ['Embroidery', 'Screen Print', 'DTG'],
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Crew Neck Sweatshirt',
        description: 'Cozy sweatshirt for custom designs and everyday comfort',
        category: 'Sweatshirts',
        gender: 'unisex' as const,
        basePrice: 2999,
        image: 'https://images.unsplash.com/photo-1655183003965-619ad3fc5ed0?w=500',
        images: [],
        variations: [
          { id: 'v12', color: 'Beige', size: 'S', price: 2999, stock: 45 },
          { id: 'v13', color: 'Beige', size: 'M', price: 2999, stock: 50 },
          { id: 'v14', color: 'Beige', size: 'L', price: 2999, stock: 35 },
          { id: 'v15', color: 'Green', size: 'M', price: 2999, stock: 30 },
          { id: 'v16', color: 'Green', size: 'L', price: 2999, stock: 28 },
        ],
        printingMethods: ['Screen Print', 'DTG', 'Vinyl'],
        createdAt: new Date().toISOString()
      }
    ];

    sampleProducts.forEach(product => storageUtils.addProduct(product));
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setViewMode('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setViewMode('landing');
  };

  const handleCustomerLogin = (user: User) => {
    setCurrentUser(user);
    setViewMode('customer');
  };

  const handleCustomerLogout = () => {
    setCurrentUser(null);
    setViewMode('landing');
  };

  const goToCustomer = () => {
    setViewMode('customer');
  };

  const goToAdmin = () => {
    setViewMode('admin');
  };

  const goToPrivacy = () => {
    setViewMode('privacy');
  };

  const goToTerms = () => {
    setViewMode('terms');
  };

  const goToLanding = () => {
    setViewMode('landing');
  };

  const goTo2DStudio = () => {
    setViewMode('2dstudio');
  };

  // Privacy Policy View
  if (viewMode === 'privacy') {
    return (
      <>
        <Toaster />
        <PrivacyPolicy onBack={goToLanding} />
      </>
    );
  }

  // Terms and Conditions View
  if (viewMode === 'terms') {
    return (
      <>
        <Toaster />
        <TermsAndConditions onBack={goToLanding} />
      </>
    );
  }

  // Landing Page
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-slate-100 selection:bg-cyan-500/30">
        <Toaster />
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 glass-card border-b border-cyan-500/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <img src={toodiesLogo} alt="Toodies" className="h-10 w-auto" />
            </motion.div>
            
            <div className="flex items-center gap-8">
              <button onClick={goToCustomer} className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Shop</button>
              <button onClick={goToCustomer} className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Categories</button>
              <button onClick={goToAdmin} className="text-sm font-medium text-slate-500 hover:text-cyan-400 transition-colors">Admin</button>
              <Button 
                onClick={goToCustomer}
                className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white border-0 shadow-lg shadow-cyan-900/20"
              >
                Get Started
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6">
                <Sparkles className="w-3 h-3" />
                Future of Apparel
              </div>
              <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-br from-white via-white to-cyan-400 bg-clip-text text-transparent">
                Design Your <br />
                <span className="text-cyan-400">Digital Identity</span>
              </h1>
              <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
                Premium quality streetwear meets cutting-edge 3D customization. Create, visualize, and wear your imagination with Toodies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={goToCustomer}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white text-lg py-7 px-10 rounded-2xl glow-button border-0 group"
                >
                  Start Designing
                  <motion.span 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ShoppingBag className="ml-2 w-5 h-5" />
                  </motion.span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={goToCustomer}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 py-7 px-10 rounded-2xl text-lg backdrop-blur-sm"
                >
                  Explore Collection
                </Button>
              </div>

              {/* Bulk Orders CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8"
              >
                <Button
                  onClick={() => {
                    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 px-6 py-3 rounded-xl"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Contact for Bulk Orders
                </Button>
              </motion.div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-cyan-100">10k+</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Designs Made</span>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-cyan-100">4.9/5</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">User Rating</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-cyan-500/20 rounded-[40px] blur-3xl -z-10 animate-pulse" />
              <div className="relative glass-card rounded-[40px] p-4 border border-cyan-500/20 overflow-hidden group">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1756276900419-868625adff43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWVzdGhldGljJTIwc3RyZWV0d2VhciUyMGZhc2hpb258ZW58MXx8fHwxNzcwNjM0NTU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Streetwear Hero"
                  className="rounded-[30px] w-full aspect-[4/5] object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                
                {/* Floating UI Element */}
                <motion.div 
                  className="absolute bottom-10 right-10 glass-card p-4 rounded-2xl border border-white/10 backdrop-blur-md"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Active Customization</p>
                      <p className="text-sm font-bold text-white">3D Designer v2.0</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-24 bg-[#080b14]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Toodies?</h2>
              <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Palette className="w-8 h-8 text-cyan-400" />,
                  title: "Premium Fabrics",
                  desc: "We use only high-grade 100% cotton and recycled blends for ultimate comfort."
                },
                {
                  icon: <Sparkles className="w-8 h-8 text-teal-400" />,
                  title: "HD Printing",
                  desc: "State-of-the-art DTG and screen printing that won't fade or crack over time."
                },
                {
                  icon: <ShoppingBag className="w-8 h-8 text-blue-400" />,
                  title: "Fast Delivery",
                  desc: "Custom designed, printed, and delivered to your doorstep within 7-10 business days."
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact-section" className="py-24 bg-[#0a0e1a] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
                <Users className="w-3 h-3" />
                Bulk Orders
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Looking to place a bulk order? We offer special pricing and dedicated support for large quantities.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {(() => {
                const businessInfo = storageUtils.getBusinessInfo();
                const contactItems = [
                  {
                    icon: <Phone className="w-6 h-6" />,
                    title: "Phone",
                    value: businessInfo.phone || "+91 98865 10858",
                    link: `tel:${businessInfo.phone || "+919886510858"}`,
                    gradient: "from-cyan-500 to-blue-500"
                  },
                  {
                    icon: <Mail className="w-6 h-6" />,
                    title: "Email",
                    value: businessInfo.email || "hello@toodies.com",
                    link: `mailto:${businessInfo.email || "hello@toodies.com"}`,
                    gradient: "from-teal-500 to-cyan-500"
                  },
                  {
                    icon: <MapPin className="w-6 h-6" />,
                    title: "Location",
                    value: businessInfo.city && businessInfo.state ? `${businessInfo.city}, ${businessInfo.state}` : "India",
                    link: null,
                    gradient: "from-blue-500 to-purple-500"
                  }
                ];

                return contactItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {item.link ? (
                      <a
                        href={item.link}
                        className="block glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <div className="text-cyan-400">{item.icon}</div>
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{item.title}</h3>
                        <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">{item.value}</p>
                      </a>
                    ) : (
                      <div className="glass-card p-6 rounded-2xl border border-white/5">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} bg-opacity-20 flex items-center justify-center mb-4`}>
                          <div className="text-cyan-400">{item.icon}</div>
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{item.title}</h3>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    )}
                  </motion.div>
                ));
              })()}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="glass-card p-8 rounded-2xl border border-cyan-500/20 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-3">Bulk Order Benefits</h3>
                <ul className="text-slate-300 space-y-2 text-left max-w-md mx-auto">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <span>Special pricing for orders of 50+ units</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <span>Dedicated account manager for your project</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <span>Priority production and faster turnaround times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <span>Custom packaging and branding options available</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              <img src={toodiesLogo} alt="Toodies" className="h-8 w-auto opacity-50" />
              
              {/* Social Media Icons */}
              {(() => {
                const businessInfo = storageUtils.getBusinessInfo();
                const showSocial = businessInfo.visibility?.website.showSocialMedia !== false;
                const socialLinks = businessInfo.socialMedia;
                
                if (!showSocial || !socialLinks) return null;
                
                const icons = [
                  { 
                    Icon: Facebook, 
                    url: socialLinks.facebook, 
                    label: 'Facebook',
                    color: 'hover:text-blue-500'
                  },
                  { 
                    Icon: Instagram, 
                    url: socialLinks.instagram, 
                    label: 'Instagram',
                    color: 'hover:text-pink-500'
                  },
                  { 
                    Icon: Twitter, 
                    url: socialLinks.twitter, 
                    label: 'Twitter',
                    color: 'hover:text-sky-400'
                  },
                  { 
                    Icon: Linkedin, 
                    url: socialLinks.linkedin, 
                    label: 'LinkedIn',
                    color: 'hover:text-blue-600'
                  },
                ].filter(item => item.url && item.url.trim() !== '');
                
                if (icons.length === 0) return null;
                
                return (
                  <div className="flex items-center gap-4">
                    {icons.map(({ Icon, url, label, color }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 flex items-center justify-center text-slate-400 ${color} transition-all hover:scale-110 hover:bg-white/10`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                );
              })()}
              
              <div className="flex gap-6">
                <span className="text-slate-500 hover:text-cyan-400 cursor-pointer text-sm" onClick={goToPrivacy}>Privacy</span>
                <span className="text-slate-500 hover:text-cyan-400 cursor-pointer text-sm" onClick={goToTerms}>Terms</span>
                <span className="text-slate-500 hover:text-cyan-400 cursor-pointer text-sm">Contact</span>
              </div>
            </div>
            
            <div className="text-center pt-6 border-t border-white/5">
              <p className="text-slate-500 text-sm">© 2026 Toodies Apparel. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* WhatsApp Floating Button */}
        {(() => {
          const businessInfo = storageUtils.getBusinessInfo();
          if (businessInfo.visibility?.website.showWhatsApp === false) return null;
          
          const whatsappNumber = businessInfo.whatsapp || '+919876543210';
          const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
          const message = encodeURIComponent(`Hi! I'm interested in learning more about Toodies products.`);
          const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

          return (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 50,
              }}
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-2xl relative group overflow-hidden transition-all hover:scale-110 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-16 group-hover:translate-y-0 transition-transform duration-300" />
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8 relative z-10 pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping pointer-events-none" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full pointer-events-none" />
              </a>
            </motion.div>
          );
        })()}
      </div>
    );
  }

  // Admin View
  if (viewMode === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <>
          <Toaster />
          <AdminLogin onLogin={handleAdminLogin} />
        </>
      );
    }
    return (
      <>
        <Toaster />
        <AdminDashboard onLogout={handleAdminLogout} />
      </>
    );
  }

  // Customer View
  if (viewMode === '2dstudio') {
    if (!currentUser) {
      setViewMode('customer');
      return null;
    }
    return (
      <>
        <Toaster />
        <TwoDStudioPage 
          onBack={() => setViewMode('customer')} 
          user={currentUser}
          onUserUpdate={(updatedUser) => {
            setCurrentUser(updatedUser);
            storageUtils.updateCurrentUser(updatedUser);
          }}
        />
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Toaster />
        <CustomerAuth 
          onLogin={handleCustomerLogin} 
          onPrivacyClick={goToPrivacy}
          onTermsClick={goToTerms}
        />
      </>
    );
  }

  return (
    <>
      <Toaster />
      <CustomerDashboard 
        user={currentUser} 
        onLogout={handleCustomerLogout}
        onOpen2DStudio={goTo2DStudio}
      />
    </>
  );
}