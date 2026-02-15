import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogIn, UserPlus, Mail, Phone, Lock, User as UserIcon, KeyRound, ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { storageUtils } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { User } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';

interface CustomerAuthProps {
  onLogin: (user: User) => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

export function CustomerAuth({ onLogin, onPrivacyClick, onTermsClick }: CustomerAuthProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMobile, setResetMobile] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resetUserId, setResetUserId] = useState('');
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storageUtils.loginUser(loginEmail, loginPassword);
    if (user) {
      toast.success('Login successful!');
      onLogin(user);
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupMobile || !signupPassword || !signupName) {
      toast.error('Please fill all fields');
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the Terms and Conditions to continue');
      setShowTermsDialog(true);
      return;
    }

    const users = storageUtils.getUsers();
    if (users.some(u => u.email === signupEmail || u.mobile === signupMobile)) {
      toast.error('Email or mobile already registered');
      return;
    }

    const user = storageUtils.registerUser(signupEmail, signupMobile, signupPassword, signupName);
    toast.success('Account created successfully!');
    onLogin(user);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storageUtils.getUserByMobile(resetMobile);
    if (user) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(otp);
      setResetUserId(user.id);
      setOtpSent(true);
      toast.success('OTP sent to your mobile number');
    } else {
      toast.error('Mobile number not registered');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetOtp || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (resetOtp !== generatedOtp) {
      toast.error('Invalid OTP');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const user = storageUtils.getUserById(resetUserId);
    if (user) {
      storageUtils.updateUserPassword(user.id, newPassword);
      toast.success('Password reset successfully!');
      setShowForgotPassword(false);
    } else {
      toast.error('User not found');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] relative overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border-2 border-cyan-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-cyan-100 glow-text">Welcome to Toodies</CardTitle>
            <CardDescription className="text-slate-300 text-base mt-2">
              Login or create an account to start shopping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#0f172a]/50 border border-cyan-500/20">
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-slate-300"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-slate-300"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-cyan-100">Email or Mobile Number</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                      <Input
                        id="login-email"
                        type="text"
                        placeholder="email@example.com or mobile"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-cyan-100">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6 text-lg rounded-xl"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </Button>
                  <Button 
                    type="button" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6 text-lg rounded-xl"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    <KeyRound className="w-5 h-5 mr-2" />
                    Forgot Password
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-cyan-100">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="email@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-mobile" className="text-cyan-100">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                      <Input
                        id="signup-mobile"
                        type="tel"
                        placeholder="+1234567890"
                        value={signupMobile}
                        onChange={(e) => setSignupMobile(e.target.value)}
                        className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-cyan-100">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-cyan-100">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6 text-lg rounded-xl"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Privacy and Terms Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                By signing up, you agree to our{' '}
                {onTermsClick ? (
                  <button onClick={onTermsClick} className="text-cyan-400 hover:text-cyan-300 underline">
                    Terms and Conditions
                  </button>
                ) : (
                  <span className="text-cyan-400">Terms and Conditions</span>
                )}
                {' '}and{' '}
                {onPrivacyClick ? (
                  <button onClick={onPrivacyClick} className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                  </button>
                ) : (
                  <span className="text-cyan-400">Privacy Policy</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="glass-card border-2 border-cyan-500/30">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl text-cyan-100 glow-text">Forgot Password</DialogTitle>
            <DialogDescription className="text-slate-300 text-base mt-2">
              Enter your mobile number to reset your password
            </DialogDescription>
          </DialogHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="reset-mobile" className="text-cyan-100">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                  <Input
                    id="reset-mobile"
                    type="tel"
                    placeholder="+1234567890"
                    value={resetMobile}
                    onChange={(e) => setResetMobile(e.target.value)}
                    className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6 text-lg rounded-xl"
              >
                <KeyRound className="w-5 h-5 mr-2" />
                Send OTP
              </Button>
            </form>
          </CardContent>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={otpSent} onOpenChange={setOtpSent}>
        <DialogContent className="glass-card border-2 border-cyan-500/30">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl text-cyan-100 glow-text">Reset Password</DialogTitle>
            <DialogDescription className="text-slate-300 text-base mt-2">
              Enter the OTP sent to your mobile number
            </DialogDescription>
          </DialogHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="reset-otp" className="text-cyan-100">OTP</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                  <Input
                    id="reset-otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-cyan-100">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-cyan-100">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6 text-lg rounded-xl"
              >
                <KeyRound className="w-5 h-5 mr-2" />
                Reset Password
              </Button>
              <Button 
                type="button" 
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6 text-lg rounded-xl"
                onClick={() => setOtpSent(false)}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </form>
          </CardContent>
        </DialogContent>
      </Dialog>

      {/* Terms and Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="glass-card border-2 border-cyan-500/30 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-100 glow-text flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              Terms and Conditions
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Please read and accept our terms to create your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 text-slate-300 text-sm">
            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">1. Acceptance of Terms</h3>
              <p>
                By creating an account, placing an order, or using any of our services, you acknowledge that you have read and understood these Terms and Conditions and agree to comply with all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">2. Account Registration</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You must provide accurate, current, and complete information</li>
                <li>You are responsible for maintaining the confidentiality of your password</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>You must be at least 18 years old or have parental/guardian consent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">3. Custom Designs</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are responsible for ensuring your designs do not infringe on copyrights or trademarks</li>
                <li>We reserve the right to refuse designs that are offensive, illegal, or inappropriate</li>
                <li>Custom orders cannot be cancelled once production has started</li>
                <li>You grant us permission to use your designs for order fulfillment</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">4. Pricing and Payment</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All prices are in Indian Rupees (₹) and include applicable taxes</li>
                <li>We accept Credit/Debit Cards, UPI, Net Banking, Digital Wallets, COD, and EMI</li>
                <li>Payment must be received in full before order processing</li>
                <li>Refunds will be processed to the original payment method</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">5. Shipping and Delivery</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Custom orders take 7-10 business days for production</li>
                <li>Delivery time varies based on location (3-7 business days after production)</li>
                <li>You will receive tracking information once your order ships</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">6. Returns and Refunds</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Standard products: Returns accepted within 7 days of delivery</li>
                <li>Custom designed products: Returns only for manufacturing defects</li>
                <li>Products must be unused, unwashed, and in original condition</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">7. Intellectual Property</h3>
              <p>
                You retain ownership of custom designs you create. You warrant that your designs do not infringe on third-party rights and you are responsible for obtaining necessary licenses or permissions.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-200 mb-2">8. Limitation of Liability</h3>
              <p>
                To the fullest extent permitted by law, we provide our services "as is" without warranties of any kind. Our total liability shall not exceed the amount you paid for the product.
              </p>
            </section>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-4">
              <p className="text-yellow-200 text-sm">
                <strong>Important:</strong> By checking the box below and clicking "Accept and Create Account", you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4 pt-4 border-t border-cyan-500/20">
            <div className="flex items-start gap-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <Checkbox
                id="terms-accept-dialog"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-1 border-cyan-500/50"
              />
              <Label htmlFor="terms-accept-dialog" className="text-sm text-cyan-100 cursor-pointer flex-1">
                I have read and agree to the Terms and Conditions and Privacy Policy. I understand that custom orders cannot be cancelled once production has started.
              </Label>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTermsDialog(false)}
                className="flex-1 border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!termsAccepted}
                onClick={() => {
                  if (termsAccepted) {
                    setHasReadTerms(true);
                    setShowTermsDialog(false);
                    toast.success('Terms accepted! You can now create your account.');
                  } else {
                    toast.error('Please accept the terms and conditions to continue');
                  }
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept and Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}