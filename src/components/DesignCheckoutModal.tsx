import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card } from './ui/card';
import { CreditCard, Smartphone, Truck, Lock, ShieldCheck, CheckCircle2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { designDB } from '../utils/indexedDB';
import { submitDesignToFigma } from '../utils/figmaSubmission';

interface DesignCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  designData: {
    productName: string;
    productPrice: number;
    customizationCost: number;
    designSnapshot: string;
    color: string;
    size: string;
    fabric: string;
  };
  onPaymentSuccess: (paymentDetails: any) => void;
}

export function DesignCheckoutModal({
  open,
  onClose,
  designData,
  onPaymentSuccess
}: DesignCheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');
  
  // Form data
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  // Calculate pricing
  const productCost = designData.productPrice;
  const customizationCost = designData.customizationCost;
  const subtotal = productCost + customizationCost;
  const gst = Math.round(subtotal * 0.18); // 18% GST
  const shipping = paymentMethod === 'cod' ? 50 : 0; // COD charges
  const total = subtotal + gst + shipping;

  const handleProceedToPayment = () => {
    if (!address || !pincode || !phone) {
      toast.error('Please fill in all delivery details');
      return;
    }
    setPaymentStep('payment');
  };

  const handlePayment = async () => {
    // Validate payment details
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter UPI ID');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) {
      toast.error('Please fill in all card details');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = `ORD${Date.now()}`;
      const paymentId = `PAY${Date.now()}`;

      const paymentDetails = {
        orderId,
        paymentId,
        paymentMethod,
        amount: total,
        timestamp: new Date().toISOString(),
        deliveryAddress: address,
        pincode,
        phone,
        status: 'confirmed'
      };

      onPaymentSuccess(paymentDetails);
      setPaymentStep('success');
      setIsProcessing(false);

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setPaymentStep('details');
      }, 2000);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {paymentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Design Preview */}
              <Card className="glass-card border-cyan-500/20 p-4">
                <h3 className="text-white font-bold mb-3">Your Custom Design</h3>
                <div className="flex gap-4">
                  <img
                    src={designData.designSnapshot}
                    alt="Design Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-500/30"
                  />
                  <div className="flex-1 text-sm space-y-1">
                    <p className="text-white font-semibold">{designData.productName}</p>
                    <p className="text-slate-400">Color: <span className="text-cyan-400">{designData.color}</span></p>
                    <p className="text-slate-400">Size: <span className="text-cyan-400">{designData.size}</span></p>
                    <p className="text-slate-400">Fabric: <span className="text-cyan-400">{designData.fabric}</span></p>
                  </div>
                </div>
              </Card>

              {/* Price Breakdown */}
              <Card className="glass-card border-cyan-500/20 p-4">
                <h3 className="text-white font-bold mb-3">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Product Cost:</span>
                    <span>₹{productCost}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Customization Cost:</span>
                    <span>₹{customizationCost}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GST (18%):</span>
                    <span>₹{gst}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>COD Charges:</span>
                      <span>₹{shipping}</span>
                    </div>
                  )}
                  <div className="border-t border-cyan-500/20 pt-2 mt-2"></div>
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-cyan-400">₹{total}</span>
                  </div>
                </div>
              </Card>

              {/* Delivery Details */}
              <Card className="glass-card border-cyan-500/20 p-4">
                <h3 className="text-white font-bold mb-3">Delivery Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Delivery Address</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your complete address"
                      className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Pincode</Label>
                      <Input
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Enter pincode"
                        className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Phone Number</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-6"
              >
                Proceed to Payment
              </Button>
            </motion.div>
          )}

          {paymentStep === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Payment Method Selection */}
              <Card className="glass-card border-cyan-500/20 p-4">
                <h3 className="text-white font-bold mb-3">Select Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/30 cursor-pointer hover:bg-cyan-500/10 transition">
                      <RadioGroupItem value="upi" id="upi" />
                      <Smartphone className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-medium">UPI Payment</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/30 cursor-pointer hover:bg-cyan-500/10 transition">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-medium">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/30 cursor-pointer hover:bg-cyan-500/10 transition">
                      <RadioGroupItem value="cod" id="cod" />
                      <Truck className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-medium">Cash on Delivery (+₹50)</span>
                    </label>
                  </div>
                </RadioGroup>
              </Card>

              {/* Payment Form */}
              {paymentMethod === 'upi' && (
                <Card className="glass-card border-cyan-500/20 p-4">
                  <h3 className="text-white font-bold mb-3">Enter UPI Details</h3>
                  <div>
                    <Label className="text-slate-300">UPI ID</Label>
                    <Input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                    />
                  </div>
                </Card>
              )}

              {paymentMethod === 'card' && (
                <Card className="glass-card border-cyan-500/20 p-4">
                  <h3 className="text-white font-bold mb-3">Enter Card Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Card Number</Label>
                      <Input
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Cardholder Name</Label>
                      <Input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Expiry Date</Label>
                        <Input
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">CVV</Label>
                        <Input
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          maxLength={3}
                          type="password"
                          className="bg-slate-800/50 border-cyan-500/30 text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {paymentMethod === 'cod' && (
                <Card className="glass-card border-cyan-500/20 p-4">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Truck className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="text-white font-semibold">Cash on Delivery</p>
                      <p className="text-sm">Pay ₹{total} when your order is delivered</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Lock className="w-4 h-4" />
                <span>Secure payment powered by 256-bit SSL encryption</span>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold py-6"
              >
                {isProcessing ? (
                  <>Processing Payment...</>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Pay ₹{total}
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {paymentStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-slate-400 mb-4">Your order has been confirmed</p>
              <div className="glass-card border-green-500/20 p-4 max-w-sm mx-auto">
                <p className="text-slate-300 text-sm">Your design is being submitted to admin...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}