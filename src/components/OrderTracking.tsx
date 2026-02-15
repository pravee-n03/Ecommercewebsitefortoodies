import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Package, Truck, MapPin, CheckCircle, Clock, ExternalLink, Palette, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Order, Product } from '../types';
import { storageUtils } from '../utils/storage';

interface OrderTrackingProps {
  user: User;
}

export function OrderTracking({ user }: OrderTrackingProps) {
  // Safety check for user
  if (!user) {
    return (
      <Card className="glass-card border-dashed border-cyan-500/20 py-16">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-600" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">Unable to load orders</p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
              Please log in to view your orders.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Sort orders by date, newest first
    const sortedOrders = [...(user.orders || [])].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setOrders(sortedOrders);
    setProducts(storageUtils.getProducts());
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shipped': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'processing': return <Package className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 p-3 rounded-xl glow-border">
          <Package className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Track Your Orders</h2>
          <p className="text-slate-400">Monitor the status of your purchases</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="glass-card border-cyan-500/20">
          <CardContent className="pt-12 pb-12 text-center">
            <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-lg text-white font-bold mb-2">No orders yet</p>
            <p className="text-sm text-slate-500">Your order history will appear here once you make a purchase.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`glass-card border-2 transition-all duration-300 ${
                expandedOrder === order.id ? 'border-cyan-500/40' : 'border-cyan-500/20'
              } overflow-hidden`}>
                <CardHeader className="cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-cyan-100 flex items-center gap-2 mb-2">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <p className="text-xs text-slate-400">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`${getStatusColor(order.status)} font-bold`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1.5 capitalize">{order.status}</span>
                        </Badge>
                        {expandedOrder === order.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CardContent className="pt-6 border-t border-cyan-500/10 space-y-6">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                            <span>Order Status</span>
                            <span className="text-cyan-400">{getProgressPercentage(order.status)}% Complete</span>
                          </div>
                          <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${getProgressPercentage(order.status)}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full relative"
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </motion.div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ordered Items</h4>
                          <div className="grid gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0f172a]/30 border border-white/5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-sm">{getProductName(item.productId)}</p>
                                    <p className="text-[10px] text-slate-500 font-bold">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                {item.customDesignUrl && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 h-8 text-[10px] font-bold uppercase tracking-widest"
                                    onClick={() => window.open(item.customDesignUrl, '_blank')}
                                  >
                                    <Palette className="w-3 h-3 mr-2" />
                                    View Design
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tracking Information */}
                        {order.trackingNumber ? (
                          <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-2xl p-4">
                            <div className="flex items-start gap-4">
                              <div className="bg-cyan-500/20 p-2.5 rounded-xl">
                                <MapPin className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-white mb-1">Logistics Detail</p>
                                <p className="text-lg text-cyan-300 font-mono tracking-wider mb-3">{order.trackingNumber}</p>
                                {order.trackingUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 rounded-xl px-6"
                                    onClick={() => window.open(order.trackingUrl, '_blank')}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Track Live Package
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4">
                            <Clock className="w-5 h-5 text-slate-600" />
                            <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
                              Logistics information pending dispatch
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}