import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShoppingCart, RefreshCw, CreditCard, Truck, AlertTriangle, ArrowLeft, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface TermsAndConditionsProps {
  onBack: () => void;
}

export function TermsAndConditions({ onBack }: TermsAndConditionsProps) {
  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-8 border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 mb-6">
            <FileText className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-100 mb-4 glow-text">Terms and Conditions</h1>
          <p className="text-slate-400 text-lg">Last Updated: February 10, 2026</p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-cyan-500/20 mb-6">
            <CardContent className="p-8">
              <p className="text-slate-300 leading-relaxed">
                Welcome to Toodies! These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using Toodies, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use our website or services.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Acceptance of Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-3">
                <Scale className="w-6 h-6 text-cyan-400" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                By creating an account, placing an order, or using any of our services, you acknowledge that:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>You have read and understood these Terms and Conditions</li>
                <li>You agree to comply with all applicable laws and regulations</li>
                <li>You are at least 18 years old or have parental/guardian consent</li>
                <li>The information you provide is accurate and up-to-date</li>
                <li>You are responsible for maintaining the security of your account</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Registration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100">Account Registration and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Registration Requirements</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>You must provide accurate, current, and complete information</li>
                  <li>You must maintain and update your account information</li>
                  <li>You may not use another person's account without permission</li>
                  <li>You may not transfer or sell your account to another party</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Account Security</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>You are responsible for maintaining the confidentiality of your password</li>
                  <li>You must notify us immediately of any unauthorized access to your account</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products and Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-teal-400" />
                Products and Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Product Information</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>We strive to display accurate product descriptions, images, and pricing</li>
                  <li>Colors may vary slightly due to screen display differences</li>
                  <li>Custom designs are produced based on your submitted design files</li>
                  <li>We reserve the right to limit quantities and refuse service</li>
                  <li>Prices are listed in Indian Rupees (₹) and are subject to change</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Order Placement</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We may refuse or cancel orders at our discretion</li>
                  <li>You will receive an order confirmation email after placing an order</li>
                  <li>Order confirmation does not guarantee acceptance</li>
                  <li>We may contact you for verification or additional information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Custom Designs</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>You are responsible for ensuring your designs do not infringe on copyrights or trademarks</li>
                  <li>We reserve the right to refuse designs that are offensive, illegal, or inappropriate</li>
                  <li>Design files must meet our technical specifications for printing</li>
                  <li>Custom orders cannot be cancelled once production has started</li>
                  <li>You grant us permission to use your designs for order fulfillment</li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-200 text-sm">
                  <strong>Important:</strong> Please review your custom design carefully before checkout. We are not responsible for errors in customer-submitted designs.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing and Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-purple-400" />
                Pricing and Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Pricing</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>All prices are in Indian Rupees (₹) and include applicable taxes</li>
                  <li>Shipping charges are calculated at checkout based on location</li>
                  <li>We reserve the right to change prices at any time without notice</li>
                  <li>Promotional codes and discounts have specific terms and expiration dates</li>
                  <li>Price errors are subject to correction even after order placement</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Payment Methods</h3>
                <p className="text-slate-300 mb-2">We accept the following payment methods:</p>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Credit/Debit Cards (Visa, Mastercard, Rupay)</li>
                  <li>UPI (Google Pay, PhonePe, Paytm, BHIM)</li>
                  <li>Net Banking</li>
                  <li>Digital Wallets</li>
                  <li>Cash on Delivery (COD) - subject to availability</li>
                  <li>EMI options for eligible purchases</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Payment Processing</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Payments are processed securely through Razorpay and other certified gateways</li>
                  <li>We do not store your complete card details on our servers</li>
                  <li>Payment must be received in full before order processing</li>
                  <li>Failed transactions may result in order cancellation</li>
                  <li>Refunds will be processed to the original payment method</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipping and Delivery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-3">
                <Truck className="w-6 h-6 text-blue-400" />
                Shipping and Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Shipping Policy</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Custom orders typically take 7-10 business days for production</li>
                  <li>Delivery time varies based on your location (3-7 business days after production)</li>
                  <li>We ship across India through trusted courier partners</li>
                  <li>International shipping may be available for select products</li>
                  <li>You will receive tracking information once your order ships</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Delivery Terms</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Please ensure the shipping address is accurate and complete</li>
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>We are not responsible for delays caused by courier services or natural disasters</li>
                  <li>Someone must be available to receive the package at the delivery address</li>
                  <li>Unclaimed packages may be returned and subject to restocking fees</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Returns and Refunds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-green-400" />
                Returns and Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Return Eligibility</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Standard products: Returns accepted within 7 days of delivery</li>
                  <li>Custom designed products: Returns only accepted for manufacturing defects</li>
                  <li>Products must be unused, unwashed, and in original condition with tags</li>
                  <li>Sale or discounted items may not be eligible for return</li>
                  <li>Return shipping costs are the customer's responsibility unless the product is defective</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Refund Process</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Refunds are processed within 7-10 business days after receiving the return</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>Shipping charges are non-refundable unless the error was on our part</li>
                  <li>Partial refunds may be issued for items not in original condition</li>
                  <li>You will receive an email confirmation once the refund is processed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Exchanges</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>Size exchanges are subject to availability</li>
                  <li>Contact customer support within 48 hours of delivery for exchanges</li>
                  <li>Custom designed products cannot be exchanged</li>
                  <li>Exchange shipping costs may apply</li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-200 text-sm">
                  <strong>Note:</strong> Custom designed products are made specifically for you and cannot be returned unless there is a manufacturing defect or error on our part.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Intellectual Property */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100">Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Our Content</h3>
                <p className="text-slate-300 mb-2">
                  All content on the Toodies website, including but not limited to text, graphics, logos, images, and software, is the property of Toodies and protected by copyright and intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Your Content</h3>
                <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                  <li>You retain ownership of custom designs you create or upload</li>
                  <li>You grant us a license to use your designs for order fulfillment</li>
                  <li>You warrant that your designs do not infringe on third-party rights</li>
                  <li>You are responsible for obtaining necessary licenses or permissions</li>
                  <li>We reserve the right to refuse designs that infringe on intellectual property</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prohibited Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-3">You agree not to:</p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the intellectual property rights of others</li>
                <li>Upload offensive, harmful, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of our website</li>
                <li>Use automated tools to scrape or collect data from our site</li>
                <li>Impersonate any person or entity</li>
                <li>Engage in fraudulent activities or payment disputes</li>
                <li>Resell our products without authorization</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100">Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                To the fullest extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>We provide our services "as is" without warranties of any kind</li>
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid for the product</li>
                <li>We are not responsible for delays or failures due to circumstances beyond our control</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Governing Law */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100">Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                These Terms are governed by the laws of India. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
              </p>
              <p className="text-slate-300">
                Before initiating legal action, we encourage you to contact us at support@toodies.com to resolve any disputes amicably.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Changes to Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-6"
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after changes constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6">
                <p className="text-cyan-100 font-semibold mb-2">Toodies Apparel</p>
                <p className="text-slate-300 text-sm">Email: support@toodies.com</p>
                <p className="text-slate-300 text-sm">Phone: +91 98865 10858</p>
                <p className="text-slate-300 text-sm">WhatsApp: +91 98865 10858</p>
                <p className="text-slate-300 text-sm mt-2">Address: 123 Fashion Street, Mumbai, Maharashtra 400001, India</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}