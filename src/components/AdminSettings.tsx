import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Settings, Phone, Mail, Save, CheckCircle, CreditCard, Key, Globe, Palette, Wallet, Truck, Building2, Smartphone, Banknote } from 'lucide-react';
import { motion } from 'motion/react';
import { storageUtils } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { Switch } from './ui/switch';

export function AdminSettings() {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [gmail, setGmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [razorpayEnabled, setRazorpayEnabled] = useState(false);
  const [designerUrl, setDesignerUrl] = useState('');
  const [paymentMethods, setPaymentMethods] = useState({
    razorpay: true,
    upi: true,
    cod: true,
    netbanking: true,
    wallet: true,
    emi: true
  });
  const [whatsappApiToken, setWhatsappApiToken] = useState('');
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [gmailApiKey, setGmailApiKey] = useState('');
  const [gmailClientId, setGmailClientId] = useState('');
  const [gmailClientSecret, setGmailClientSecret] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailProvider, setEmailProvider] = useState<'gmail' | 'smtp' | 'sendgrid'>('gmail');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const settings = storageUtils.getAdminSettings();
    setWhatsappNumber(settings.whatsappNumber || '');
    setGmail(settings.gmail || '');
    setRazorpayKeyId(settings.razorpayKeyId || '');
    setRazorpayKeySecret(settings.razorpayKeySecret || '');
    setRazorpayEnabled(settings.razorpayEnabled || false);
    setDesignerUrl(settings.designerUrl || '');
    setPaymentMethods(settings.paymentMethods || {
      razorpay: true,
      upi: true,
      cod: true,
      netbanking: true,
      wallet: true,
      emi: true
    });
    setWhatsappApiToken(settings.whatsappApiToken || '');
    setWhatsappPhoneNumberId(settings.whatsappPhoneNumberId || '');
    setWhatsappEnabled(settings.whatsappEnabled || false);
    setGmailApiKey(settings.gmailApiKey || '');
    setGmailClientId(settings.gmailClientId || '');
    setGmailClientSecret(settings.gmailClientSecret || '');
    setSmtpHost(settings.smtpHost || '');
    setSmtpPort(settings.smtpPort || '');
    setSmtpUsername(settings.smtpUsername || '');
    setSmtpPassword(settings.smtpPassword || '');
    setEmailEnabled(settings.emailEnabled || false);
    setEmailProvider(settings.emailProvider || 'gmail');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsappNumber && !gmail) {
      toast.error('Please provide at least one contact method');
      return;
    }

    storageUtils.saveAdminSettings(
      whatsappNumber, 
      gmail, 
      razorpayKeyId, 
      razorpayKeySecret, 
      razorpayEnabled, 
      designerUrl,
      paymentMethods,
      whatsappApiToken,
      whatsappPhoneNumberId,
      whatsappEnabled,
      gmailApiKey,
      gmailClientId,
      gmailClientSecret,
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      emailEnabled,
      emailProvider
    );
    setIsSaved(true);
    toast.success('Settings saved successfully!');
    
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 p-3 rounded-xl glow-border">
          <Settings className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-cyan-100">Notification Settings</h2>
          <p className="text-slate-400">Configure your contact information for customer notifications</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100">Contact Information</CardTitle>
            <CardDescription className="text-slate-400">
              These details will be included in customer order notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-cyan-100 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-400" />
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+1234567890"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                />
                <p className="text-xs text-slate-500">
                  Customers will see this number for support. Include country code (e.g., +91 for India)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gmail" className="text-cyan-100 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  Gmail Address
                </Label>
                <Input
                  id="gmail"
                  type="email"
                  placeholder="support@toodies.com"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                />
                <p className="text-xs text-slate-500">
                  Email address that will appear as the sender for customer notifications
                </p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  How it works
                </h4>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                  <li>When customers place orders, they'll receive notifications via WhatsApp and Email</li>
                  <li>Your contact info will be included so customers can reach you for support</li>
                  <li>When you add tracking info, customers get automatic updates</li>
                  <li>All notifications are logged in the browser console (for demo)</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3D Designer Integration Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <Card className="glass-card border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              3D Designer Integration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure your custom 3D designer tool URL for customer product customization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="designerUrl" className="text-cyan-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  3D Designer Website URL
                </Label>
                <Input
                  id="designerUrl"
                  type="url"
                  placeholder="https://your-3d-designer.com"
                  value={designerUrl}
                  onChange={(e) => setDesignerUrl(e.target.value)}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                />
                <p className="text-xs text-slate-500">
                  Enter the full URL of your custom 3D designer tool. Customers will use this to design products.
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-purple-100 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  How the Integration Works
                </h4>
                <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                  <li>When customers click "Customize" on a product, your 3D designer opens with product details</li>
                  <li>After designing, your 3D designer should generate a permanent design URL</li>
                  <li>Your designer redirects back to Toodies with: <code className="text-purple-400 text-xs bg-black/30 px-1 py-0.5 rounded">?designUrl=YOUR_DESIGN_URL</code></li>
                  <li>The design URL is automatically saved to the customer's account</li>
                  <li>Customers can view, edit, or add designs to cart from "My Designs" tab</li>
                  <li>You can view all design URLs in the admin panel for manufacturing</li>
                </ol>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-cyan-100 mb-2">URL Parameters Your Designer Will Receive:</h4>
                <div className="text-xs text-slate-300 space-y-1 font-mono bg-black/30 p-3 rounded-lg">
                  <div><span className="text-cyan-400">productId:</span> Unique product identifier</div>
                  <div><span className="text-cyan-400">productName:</span> Name of the product</div>
                  <div><span className="text-cyan-400">category:</span> Product category</div>
                  <div><span className="text-cyan-400">returnUrl:</span> Toodies callback URL</div>
                  <div><span className="text-cyan-400">customerId:</span> Customer's unique ID</div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-sm text-yellow-200 flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span>
                    <strong>Example Return URL:</strong><br />
                    <code className="text-xs bg-black/30 px-2 py-1 rounded mt-1 inline-block break-all">
                      https://toodies.com?designUrl=https://your-designer.com/designs/abc123&designId=xyz789
                    </code>
                  </span>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Razorpay Payment Gateway Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass-card border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              Razorpay Payment Gateway
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure Razorpay to accept online payments from customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <div className="flex-1">
                  <Label className="text-cyan-100 font-medium">Enable Razorpay Payments</Label>
                  <p className="text-xs text-slate-400 mt-1">Allow customers to pay via credit/debit cards, UPI, and more</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setRazorpayEnabled(!razorpayEnabled)}
                  className={`${
                    razorpayEnabled 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  } border-0`}
                >
                  {razorpayEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpayKeyId" className="text-cyan-100 flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  Razorpay Key ID
                </Label>
                <Input
                  id="razorpayKeyId"
                  type="text"
                  placeholder="rzp_test_XXXXXXXXXXXXXXXX"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 font-mono"
                />
                <p className="text-xs text-slate-500">
                  Get your Key ID from <a href="https://dashboard.razorpay.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Razorpay Dashboard</a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="razorpayKeySecret" className="text-cyan-100 flex items-center gap-2">
                  <Key className="w-4 h-4 text-pink-400" />
                  Razorpay Key Secret
                </Label>
                <Input
                  id="razorpayKeySecret"
                  type="password"
                  placeholder="XXXXXXXXXXXXXXXXXXXXXXXX"
                  value={razorpayKeySecret}
                  onChange={(e) => setRazorpayKeySecret(e.target.value)}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 font-mono"
                />
                <p className="text-xs text-slate-500">
                  Keep this secret secure. Never share it publicly.
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-purple-100 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Setup Instructions
                </h4>
                <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                  <li>Create a Razorpay account at <a href="https://dashboard.razorpay.com/signup" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">dashboard.razorpay.com</a></li>
                  <li>Complete KYC verification (required for live transactions)</li>
                  <li>Go to Settings → API Keys to generate your keys</li>
                  <li>Use Test keys for development, Live keys for production</li>
                  <li>Add webhook URL in Razorpay dashboard for payment confirmations</li>
                </ol>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-sm text-yellow-200 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>
                    <strong>Security Note:</strong> In production, never store API secrets in browser localStorage. 
                    Use a secure backend server to handle Razorpay transactions and verify payment signatures.
                  </span>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Methods Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-card border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-cyan-400" />
              Payment Methods
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure available payment methods for customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                {/* Razorpay */}
                <div className="flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <Label className="text-cyan-100 font-medium">Razorpay</Label>
                      <p className="text-xs text-slate-400">Credit/Debit Card, UPI, Netbanking</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.razorpay}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, razorpay: checked })}
                  />
                </div>

                {/* UPI */}
                <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <Label className="text-purple-100 font-medium">UPI</Label>
                      <p className="text-xs text-slate-400">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.upi}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, upi: checked })}
                  />
                </div>

                {/* COD */}
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <Label className="text-green-100 font-medium">Cash on Delivery (COD)</Label>
                      <p className="text-xs text-slate-400">Pay when you receive your order</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.cod}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, cod: checked })}
                  />
                </div>

                {/* Netbanking */}
                <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <Label className="text-blue-100 font-medium">Netbanking</Label>
                      <p className="text-xs text-slate-400">All major banks supported</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.netbanking}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, netbanking: checked })}
                  />
                </div>

                {/* Wallets */}
                <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <Label className="text-orange-100 font-medium">Digital Wallets</Label>
                      <p className="text-xs text-slate-400">Paytm, Amazon Pay, Mobikwik, Freecharge</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.wallet}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, wallet: checked })}
                  />
                </div>

                {/* EMI */}
                <div className="flex items-center justify-between p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">
                      <Banknote className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <Label className="text-rose-100 font-medium">EMI (Easy Installments)</Label>
                      <p className="text-xs text-slate-400">3, 6, 9, 12 months available</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.emi}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, emi: checked })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* WhatsApp Business API Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <Card className="glass-card border-green-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-400" />
              WhatsApp Business API
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure WhatsApp Business API to send automated notifications to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex-1">
                  <Label className="text-green-100 font-medium">Enable WhatsApp Notifications</Label>
                  <p className="text-xs text-slate-400 mt-1">Send automated messages for orders, tracking, and updates</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                  className={`${
                    whatsappEnabled 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  } border-0`}
                >
                  {whatsappEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappApiToken" className="text-cyan-100 flex items-center gap-2">
                  <Key className="w-4 h-4 text-green-400" />
                  WhatsApp API Access Token
                </Label>
                <Input
                  id="whatsappApiToken"
                  type="password"
                  placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={whatsappApiToken}
                  onChange={(e) => setWhatsappApiToken(e.target.value)}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 font-mono"
                />
                <p className="text-xs text-slate-500">
                  Get your access token from <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Meta for Developers</a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappPhoneNumberId" className="text-cyan-100 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  WhatsApp Phone Number ID
                </Label>
                <Input
                  id="whatsappPhoneNumberId"
                  type="text"
                  placeholder="123456789012345"
                  value={whatsappPhoneNumberId}
                  onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 font-mono"
                />
                <p className="text-xs text-slate-500">
                  Your WhatsApp Business phone number ID from Meta Business Manager
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-green-100 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Setup Instructions
                </h4>
                <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                  <li>Create a Meta (Facebook) Business account at <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">business.facebook.com</a></li>
                  <li>Set up WhatsApp Business API through Meta Business Manager</li>
                  <li>Verify your business and phone number</li>
                  <li>Create a system user and generate a permanent access token</li>
                  <li>Get your Phone Number ID from WhatsApp Business API settings</li>
                  <li>Add webhook URL for message delivery confirmations</li>
                  <li>Get your message templates approved by Meta</li>
                </ol>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-cyan-100 mb-2">API Endpoint Example:</h4>
                <div className="text-xs text-slate-300 space-y-2 font-mono bg-black/30 p-3 rounded-lg">
                  <div className="text-green-400">POST https://graph.facebook.com/v18.0/{'{'}phone_number_id{'}'}/messages</div>
                  <div className="text-slate-400">Headers:</div>
                  <div className="ml-2">Authorization: Bearer {'{'}access_token{'}'}</div>
                  <div className="ml-2">Content-Type: application/json</div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="text-sm text-yellow-200 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>
                    <strong>Important:</strong> WhatsApp Business API requires:
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>Verified business account</li>
                      <li>Approved message templates</li>
                      <li>24-hour messaging window or approved templates for notifications</li>
                      <li>Backend server to securely handle API calls</li>
                    </ul>
                    Current setup stores credentials in browser (for demo only).
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gmail/Email API Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass-card border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Email API Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure email services to send automated notifications to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex-1">
                  <Label className="text-blue-100 font-medium">Enable Email Notifications</Label>
                  <p className="text-xs text-slate-400 mt-1">Send automated emails for orders, tracking, and updates</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setEmailEnabled(!emailEnabled)}
                  className={`${
                    emailEnabled 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  } border-0`}
                >
                  {emailEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              {/* Email Provider Selection */}
              <div className="space-y-3">
                <Label className="text-cyan-100">Select Email Provider</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    onClick={() => setEmailProvider('gmail')}
                    className={`${
                      emailProvider === 'gmail'
                        ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500'
                        : 'bg-slate-800/50 border border-slate-700'
                    }`}
                  >
                    Gmail API
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEmailProvider('smtp')}
                    className={`${
                      emailProvider === 'smtp'
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500'
                        : 'bg-slate-800/50 border border-slate-700'
                    }`}
                  >
                    SMTP
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEmailProvider('sendgrid')}
                    className={`${
                      emailProvider === 'sendgrid'
                        ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-2 border-cyan-500'
                        : 'bg-slate-800/50 border border-slate-700'
                    }`}
                  >
                    SendGrid
                  </Button>
                </div>
              </div>

              {/* Gmail API Settings */}
              {emailProvider === 'gmail' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="gmailClientId" className="text-cyan-100 flex items-center gap-2">
                      <Key className="w-4 h-4 text-red-400" />
                      Gmail OAuth Client ID
                    </Label>
                    <Input
                      id="gmailClientId"
                      type="text"
                      placeholder="123456789-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                      value={gmailClientId}
                      onChange={(e) => setGmailClientId(e.target.value)}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gmailClientSecret" className="text-cyan-100 flex items-center gap-2">
                      <Key className="w-4 h-4 text-pink-400" />
                      Gmail OAuth Client Secret
                    </Label>
                    <Input
                      id="gmailClientSecret"
                      type="password"
                      placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={gmailClientSecret}
                      onChange={(e) => setGmailClientSecret(e.target.value)}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 font-mono"
                    />
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-red-100 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Gmail API Setup Instructions
                    </h4>
                    <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                      <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Google Cloud Console</a></li>
                      <li>Create a new project or select an existing one</li>
                      <li>Enable the Gmail API from the API Library</li>
                      <li>Create OAuth 2.0 credentials (Web application)</li>
                      <li>Add authorized redirect URIs for your domain</li>
                      <li>Download the credentials JSON file</li>
                      <li>Copy Client ID and Client Secret from the credentials</li>
                    </ol>
                  </div>
                </>
              )}

              {/* SMTP Settings */}
              {emailProvider === 'smtp' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost" className="text-cyan-100 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      SMTP Host
                    </Label>
                    <Input
                      id="smtpHost"
                      type="text"
                      placeholder="smtp.gmail.com or smtp.your-provider.com"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-cyan-100 flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      SMTP Port
                    </Label>
                    <Input
                      id="smtpPort"
                      type="text"
                      placeholder="587 (TLS) or 465 (SSL)"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername" className="text-cyan-100 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      SMTP Username/Email
                    </Label>
                    <Input
                      id="smtpUsername"
                      type="text"
                      placeholder="your-email@example.com"
                      value={smtpUsername}
                      onChange={(e) => setSmtpUsername(e.target.value)}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword" className="text-cyan-100 flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-400" />
                      SMTP Password/App Password
                    </Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      placeholder="Your password or app-specific password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-blue-100 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      SMTP Setup Instructions
                    </h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      <p><strong>For Gmail:</strong></p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Enable 2-Factor Authentication on your Google account</li>
                        <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">App Passwords</a></li>
                        <li>Generate an app password for "Mail"</li>
                        <li>Use: smtp.gmail.com, Port: 587, TLS</li>
                      </ol>
                      <p className="mt-2"><strong>Other Providers:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Outlook: smtp-mail.outlook.com:587</li>
                        <li>Yahoo: smtp.mail.yahoo.com:587</li>
                        <li>Custom SMTP: Check your provider's documentation</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* SendGrid Settings */}
              {emailProvider === 'sendgrid' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="gmailApiKey" className="text-cyan-100 flex items-center gap-2">
                      <Key className="w-4 h-4 text-cyan-400" />
                      SendGrid API Key
                    </Label>
                    <Input
                      id="gmailApiKey"
                      type="password"
                      placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={gmailApiKey}
                      onChange={(e) => setGmailApiKey(e.target.value)}
                      className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50 font-mono text-xs"
                    />
                    <p className="text-xs text-slate-500">
                      Get your API key from <a href="https://app.sendgrid.com/settings/api_keys" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">SendGrid Dashboard</a>
                    </p>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-cyan-100 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      SendGrid Setup Instructions
                    </h4>
                    <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                      <li>Create a SendGrid account at <a href="https://signup.sendgrid.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">sendgrid.com</a></li>
                      <li>Complete sender verification (email or domain)</li>
                      <li>Go to Settings → API Keys</li>
                      <li>Create a new API key with "Full Access" or "Mail Send" permissions</li>
                      <li>Copy the API key (you won't be able to see it again)</li>
                      <li>Set up domain authentication for better deliverability</li>
                    </ol>
                  </div>

                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-cyan-100 mb-2">API Endpoint Example:</h4>
                    <div className="text-xs text-slate-300 space-y-2 font-mono bg-black/30 p-3 rounded-lg">
                      <div className="text-cyan-400">POST https://api.sendgrid.com/v3/mail/send</div>
                      <div className="text-slate-400">Headers:</div>
                      <div className="ml-2">Authorization: Bearer {'{'}api_key{'}'}</div>
                      <div className="ml-2">Content-Type: application/json</div>
                    </div>
                  </div>
                </>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="text-sm text-yellow-200 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>
                    <strong>Security Note:</strong> Email API credentials should be stored securely on a backend server, not in browser localStorage. The current setup is for demonstration purposes only. In production:
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>Use environment variables for API keys and secrets</li>
                      <li>Never expose credentials in client-side code</li>
                      <li>Implement rate limiting to prevent abuse</li>
                      <li>Use verified sender domains for better deliverability</li>
                    </ul>
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Settings
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Card */}
      {(whatsappNumber || gmail) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card border-teal-500/20">
            <CardHeader>
              <CardTitle className="text-teal-100">Preview - Customer View</CardTitle>
              <CardDescription className="text-slate-400">
                How your contact info will appear to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0f172a]/30 rounded-xl p-6 border border-teal-500/20">
                <h4 className="text-sm font-semibold text-teal-100 mb-3">Need Help?</h4>
                <div className="space-y-2">
                  {gmail && (
                    <div className="flex items-center gap-2 text-cyan-100">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm">Email: {gmail}</span>
                    </div>
                  )}
                  {whatsappNumber && (
                    <div className="flex items-center gap-2 text-teal-100">
                      <Phone className="w-4 h-4 text-teal-400" />
                      <span className="text-sm">WhatsApp: {whatsappNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}