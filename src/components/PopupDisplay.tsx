import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Copy, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { PopupMessage, User } from '../types';
import { storageUtils } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

interface PopupDisplayProps {
  user: User;
  onVerifyClick?: () => void;
}

export function PopupDisplay({ user, onVerifyClick }: PopupDisplayProps) {
  const [currentPopup, setCurrentPopup] = useState<PopupMessage | null>(null);
  const [shownPopups, setShownPopups] = useState<string[]>([]);

  useEffect(() => {
    const shown = storageUtils.getShownPopups();
    setShownPopups(shown);
    
    // Check for popups to display
    setTimeout(() => {
      checkAndShowPopups();
    }, 1000);
  }, [user]);

  const checkAndShowPopups = () => {
    const allPopups = storageUtils.getPopupMessages();
    
    // Filter active, non-expired popups
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const userCreatedDate = new Date(user.createdAt);
    const isNewUser = userCreatedDate > oneMonthAgo;
    
    const eligiblePopups = allPopups.filter(popup => {
      // Check if active
      if (!popup.isActive) return false;

      // Check if expired
      if (popup.expiryDate && new Date(popup.expiryDate) < now) return false;

      // Check target audience
      const isVerified = user.emailVerified && user.mobileVerified;
      if (popup.targetAudience === 'verified' && !isVerified) return false;
      if (popup.targetAudience === 'unverified' && isVerified) return false;
      if (popup.targetAudience === 'new' && !isNewUser) return false;
      if (popup.targetAudience === 'existing' && isNewUser) return false;

      // Check display frequency
      if (popup.displayFrequency === 'once' && shownPopups.includes(popup.id)) return false;

      return true;
    });

    // Sort by priority
    eligiblePopups.sort((a, b) => b.priority - a.priority);

    // Show the highest priority popup
    if (eligiblePopups.length > 0) {
      const popupToShow = eligiblePopups[0];
      
      // For session frequency, check if already shown in this session
      if (popupToShow.displayFrequency === 'session') {
        const sessionKey = `popup_session_${popupToShow.id}`;
        const sessionShown = sessionStorage.getItem(sessionKey);
        if (sessionShown) return;
        sessionStorage.setItem(sessionKey, 'true');
      }

      setCurrentPopup(popupToShow);
    }
  };

  const handleClose = () => {
    if (currentPopup) {
      // Mark as shown for "once" frequency
      if (currentPopup.displayFrequency === 'once') {
        storageUtils.addShownPopup(currentPopup.id);
        setShownPopups([...shownPopups, currentPopup.id]);
      }
      setCurrentPopup(null);
    }
  };

  const handleCopyCoupon = () => {
    if (currentPopup?.couponCode) {
      navigator.clipboard.writeText(currentPopup.couponCode);
      toast.success('Coupon code copied to clipboard!');
    }
  };

  const handleLinkClick = () => {
    if (currentPopup?.type === 'verification' && onVerifyClick) {
      onVerifyClick();
      handleClose();
    } else if (currentPopup?.link) {
      if (currentPopup.link.startsWith('http')) {
        window.open(currentPopup.link, '_blank');
      } else {
        // Internal link
        window.location.hash = currentPopup.link;
      }
    }
  };

  const getPopupColors = (type: string) => {
    switch (type) {
      case 'info':
        return {
          gradient: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          iconBg: 'bg-blue-500/20',
          icon: '💡',
          iconClass: 'text-blue-400'
        };
      case 'warning':
        return {
          gradient: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/30',
          iconBg: 'bg-yellow-500/20',
          icon: '⚠️',
          iconClass: 'text-yellow-400'
        };
      case 'success':
        return {
          gradient: 'from-green-500/20 to-teal-500/20',
          border: 'border-green-500/30',
          iconBg: 'bg-green-500/20',
          icon: '✅',
          iconClass: 'text-green-400'
        };
      case 'coupon':
        return {
          gradient: 'from-purple-500/20 to-pink-500/20',
          border: 'border-purple-500/30',
          iconBg: 'bg-purple-500/20',
          icon: '🎁',
          iconClass: 'text-purple-400'
        };
      case 'verification':
        return {
          gradient: 'from-red-500/20 to-orange-500/20',
          border: 'border-red-500/30',
          iconBg: 'bg-red-500/20',
          icon: '🔐',
          iconClass: 'text-red-400'
        };
      default:
        return {
          gradient: 'from-cyan-500/20 to-teal-500/20',
          border: 'border-cyan-500/30',
          iconBg: 'bg-cyan-500/20',
          icon: '📢',
          iconClass: 'text-cyan-400'
        };
    }
  };

  if (!currentPopup) return null;

  const colors = getPopupColors(currentPopup.type);

  return (
    <AnimatePresence>
      {currentPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <div
              className={`glass-card border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden`}
            >
              {/* Header */}
              <div className="relative p-6 pb-4">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${colors.iconBg}`}>
                    <span className="text-3xl">{colors.icon}</span>
                  </div>
                  <div className="flex-1 pr-8">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {currentPopup.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {currentPopup.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              {currentPopup.couponCode && (
                <div className="px-6 pb-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-black/30 border border-white/10">
                    <code className="flex-1 text-lg font-mono font-bold text-center text-cyan-400">
                      {currentPopup.couponCode}
                    </code>
                    <Button
                      size="sm"
                      onClick={handleCopyCoupon}
                      className="bg-white/10 hover:bg-white/20 border-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                {(currentPopup.link || currentPopup.type === 'verification') && (
                  <Button
                    onClick={handleLinkClick}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0 shadow-lg"
                  >
                    {currentPopup.linkText || 'Learn More'}
                    {currentPopup.type !== 'verification' && currentPopup.link?.startsWith('http') && (
                      <ExternalLink className="ml-2 w-4 h-4" />
                    )}
                  </Button>
                )}
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {currentPopup.link || currentPopup.type === 'verification' ? 'Maybe Later' : 'Close'}
                </Button>
              </div>

              {/* Expiry Info */}
              {currentPopup.expiryDate && (
                <div className="px-6 pb-4">
                  <p className="text-xs text-slate-400 text-center">
                    Expires: {new Date(currentPopup.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}