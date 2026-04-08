import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, UserCheck, Mail, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ToodiesLogoSVG } from './ToodiesLogoSVG';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden selection:bg-[#d4af37]/30">
      {/* Ambient gold glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4af37]/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4af37]/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-[#d4af37]/10" style={{ background: 'rgba(0,0,0,0.88)' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-300 hover:text-[#d4af37] hover:bg-[#d4af37]/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ToodiesLogoSVG height={36} />
          <div className="w-20" />
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/25 mb-6">
            <Shield className="w-10 h-10 text-[#d4af37]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 glow-text uppercase tracking-wide">Privacy Policy</h1>
          <p className="text-slate-500">Last Updated: February 10, 2026</p>
        </motion.div>

        {/* Introduction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-[#d4af37]/15 mb-6 rounded-2xl">
            <CardContent className="p-8">
              <p className="text-slate-300 leading-relaxed">
                At Toodies, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Information We Collect */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Database className="w-6 h-6 text-[#d4af37]" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-3">Personal Information</h3>
                <p className="text-slate-300 mb-3">We may collect personally identifiable information that you voluntarily provide to us when you:</p>
                <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                  <li>Register for an account</li>
                  <li>Place an order</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                  <li>Contact customer support</li>
                </ul>
                <p className="text-slate-300 mt-3">This information may include:</p>
                <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                  <li>Name and email address</li>
                  <li>Mobile phone number</li>
                  <li>Billing and shipping address</li>
                  <li>Payment information (processed securely through third-party payment processors)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-3">Automatically Collected Information</h3>
                <p className="text-slate-300 mb-3">When you visit our website, we may automatically collect certain information about your device, including:</p>
                <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                  <li>IP address and browser type</li>
                  <li>Operating system and device information</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring URLs and clickstream data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-3">Design Information</h3>
                <p className="text-slate-300">When you use our 2D customization tool, we collect and store your custom design files, URLs, and related metadata to fulfill your orders and improve our services.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How We Use Your Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Eye className="w-6 h-6 text-[#d4af37]" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations, shipping updates, and tracking information</li>
                <li>Respond to customer service inquiries and support requests</li>
                <li>Improve our products, services, and user experience</li>
                <li>Send promotional emails and marketing communications (with your consent)</li>
                <li>Prevent fraudulent transactions and protect against security threats</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Personalize your shopping experience</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Sharing */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-[#d4af37]" />
                Sharing Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">We may share your information with:</p>

              <div>
                <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-2">Service Providers</h3>
                <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4 mt-2">
                  <li>Payment processors (Razorpay, UPI gateways)</li>
                  <li>Shipping and logistics partners</li>
                  <li>Email and SMS communication services</li>
                  <li>Analytics and marketing platforms</li>
                  <li>Cloud hosting providers</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-2">Legal Requirements</h3>
                <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4 mt-2">
                  <li>Comply with legal processes or government requests</li>
                  <li>Enforce our Terms and Conditions</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Prevent fraud or security threats</li>
                </ul>
              </div>

              <div className="bg-[#d4af37]/8 border border-[#d4af37]/25 rounded-xl p-4">
                <p className="text-[#d4af37] text-sm">
                  <strong>Important:</strong> We will never sell or rent your personal information to third parties for their marketing purposes without your explicit consent.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Security */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Lock className="w-6 h-6 text-[#d4af37]" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">We implement industry-standard security measures to protect your personal information, including:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Encryption of data in transit using SSL/TLS</li>
                <li>Secure storage of sensitive information</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Payment information handled by PCI-DSS compliant processors</li>
              </ul>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                <p className="text-red-300 text-sm">
                  <strong>Note:</strong> No method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Your Rights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <UserCheck className="w-6 h-6 text-[#d4af37]" />
                Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">You have the right to:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li><strong className="text-[#d4af37]">Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong className="text-[#d4af37]">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong className="text-[#d4af37]">Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong className="text-[#d4af37]">Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong className="text-[#d4af37]">Data Portability:</strong> Request a copy of your data in a structured format</li>
                <li><strong className="text-[#d4af37]">Object:</strong> Object to certain processing of your personal information</li>
              </ul>
              <p className="text-slate-300 mt-4">To exercise these rights, please contact us using the information provided below.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cookies */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">We use cookies and similar technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us:</p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Keep you logged in to your account</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Personalize content and advertisements</li>
                <li>Improve website performance</li>
              </ul>
              <p className="text-slate-300 mt-4">You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Children's Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately, and we will take steps to delete such information.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mb-6">
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Mail className="w-6 h-6 text-[#d4af37]" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
              <div className="bg-[#d4af37]/8 border border-[#d4af37]/25 rounded-xl p-6">
                <p className="text-[#d4af37] font-bold mb-2 uppercase tracking-widest text-sm">Toodies Apparel</p>
                <p className="text-slate-300 text-sm">Email: privacy@toodies.com</p>
                <p className="text-slate-300 text-sm">Phone: +91 98865 10858</p>
                <p className="text-slate-300 text-sm mt-2">Address: 123 Fashion Street, Mumbai, Maharashtra 400001, India</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Updates */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <Card className="glass-card border-[#d4af37]/15 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <ToodiesLogoSVG height={40} className="mx-auto opacity-30" />
          <p className="text-slate-700 text-xs mt-3 uppercase tracking-widest">© {new Date().getFullYear()} Toodies. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
