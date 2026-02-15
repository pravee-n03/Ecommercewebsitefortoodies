import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { Send, HeadphonesIcon, X, Bot, User as UserIcon, Bell, MessageSquare, ShieldCheck, Clock, Check, CheckCheck, ChevronDown } from 'lucide-react';
import { storageUtils } from '../utils/storage';
import { ChatConversation, ChatMessage, User, PopupMessage } from '../types/index';
import { toast } from 'sonner@2.0.3';

interface HelpCenterProps {
  user: User;
  onClose: () => void;
}

export function HelpCenter({ user, onClose }: HelpCenterProps) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'notifications'>('chat');
  const [adminNotifications, setAdminNotifications] = useState<PopupMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Polling interval for new messages
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load or create conversation
    const loadConversation = () => {
      const conversations = storageUtils.getChatConversations();
      let userConversation = conversations.find(c => c.userId === user.id);
      
      if (!userConversation) {
        // Create new conversation
        userConversation = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name || user.email,
          userEmail: user.email,
          messages: [],
          status: 'open',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
          createdAt: new Date().toISOString()
        };
        storageUtils.addChatConversation(userConversation);
      }
      
      setConversation(userConversation);
    };

    loadConversation();
    
    // Load Admin Notifications from Popup Messages
    const popups = storageUtils.getPopupMessages();
    const userPopups = popups.filter(p => 
      p.isActive && 
      (p.targetAudience === 'all' || 
      (user.emailVerified ? p.targetAudience === 'verified' : p.targetAudience === 'unverified'))
    );
    setAdminNotifications(userPopups.sort((a, b) => b.priority - a.priority));
    
    // Set up polling to check for admin replies since we use local storage
    pollingRef.current = setInterval(() => {
      const conversations = storageUtils.getChatConversations();
      const updatedConv = conversations.find(c => c.userId === user.id);
      if (updatedConv) {
        setConversation(prev => {
          // Only update if message count changed to avoid unnecessary re-renders
          if (prev && updatedConv.messages.length !== prev.messages.length) {
            return updatedConv;
          }
          return prev;
        });
      }
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user.id]);

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [conversation?.messages.length, activeTab]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (textOverride?: string) => {
    const messageToSend = textOverride || message.trim();
    if (!messageToSend || !conversation) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId: conversation.id,
      userId: user.id,
      userName: user.name || user.email,
      userEmail: user.email,
      message: messageToSend,
      sender: 'customer',
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedConversation: ChatConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastMessageAt: new Date().toISOString(),
      unreadCount: conversation.unreadCount + 1
    };

    storageUtils.updateChatConversation(conversation.id, updatedConversation);
    setConversation(updatedConversation);
    if (!textOverride) setMessage('');
    
    // AI Auto-reply simulation if enabled
    const aiConfig = storageUtils.getAIConfig();
    if (aiConfig.isEnabled && aiConfig.autoReply) {
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          conversationId: conversation.id,
          userId: 'ai-bot',
          userName: 'Toodies AI',
          userEmail: 'ai@toodies.com',
          message: aiConfig.greetingMessage || "Thank you for reaching out! One of our team members will get back to you shortly. In the meantime, feel free to check our help articles.",
          sender: 'ai',
          timestamp: new Date().toISOString(),
          read: false
        };
        
        // Re-read current conversation to avoid clobbering other messages
        const latestConvs = storageUtils.getChatConversations();
        const currentConv = latestConvs.find(c => c.id === conversation.id);
        if (currentConv) {
          const withAI = {
            ...currentConv,
            messages: [...currentConv.messages, aiMessage],
            lastMessageAt: new Date().toISOString()
          };
          storageUtils.updateChatConversation(conversation.id, withAI);
          setConversation(withAI);
        }
      }, 1500);
    }
  };

  const handleQuickAction = (text: string) => {
    handleSendMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  const shouldShowDateSeparator = (currentMsg: ChatMessage, prevMsg: ChatMessage | undefined) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  const shouldGroupMessage = (currentMsg: ChatMessage, prevMsg: ChatMessage | undefined) => {
    if (!prevMsg) return false;
    const timeDiff = new Date(currentMsg.timestamp).getTime() - new Date(prevMsg.timestamp).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    return currentMsg.sender === prevMsg.sender && timeDiff < fiveMinutes;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[380px] md:h-[600px] z-50 flex items-end md:items-center justify-center md:justify-end p-0 md:p-4"
    >
      <Card className="glass-card border-2 border-cyan-500/30 w-full h-full md:h-[600px] flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <CardHeader className="border-b border-cyan-500/20 flex-shrink-0 bg-[#0a0f1d]/90 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <HeadphonesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-cyan-100 text-base flex items-center gap-2">
                  Toodies Hub
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </CardTitle>
                <CardDescription className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">
                  24/7 Support & Updates
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg h-9 w-9 transition-all flex-shrink-0 border border-slate-700/30 hover:border-red-500/50"
              title="Close Help Center"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
            <Button
              onClick={() => setActiveTab('chat')}
              variant="ghost"
              className={`flex-1 h-10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all gap-2 ${
                activeTab === 'chat' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] border border-cyan-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Support Chat
            </Button>
            <Button
              onClick={() => setActiveTab('notifications')}
              variant="ghost"
              className={`flex-1 h-10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all gap-2 relative ${
                activeTab === 'notifications' 
                  ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 shadow-[inset_0_0_10px_rgba(20,184,166,0.1)] border border-teal-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Notifications
              {adminNotifications.length > 0 && (
                <span className="absolute top-1.5 right-2 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full border-2 border-[#0a0f1d] animate-bounce">
                  {adminNotifications.length}
                </span>
              )}
            </Button>
          </div>
        </CardHeader>

        {/* Content Area */}
        <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-[#050810]/50">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div 
                key="chat-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                  {!conversation || conversation.messages.length === 0 ? (
                    <div className="text-center py-8 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-2 border-cyan-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                        <MessageSquare className="w-10 h-10 text-cyan-500/50" />
                      </div>
                      <h3 className="text-cyan-100 text-xl font-bold mb-2">Need Help?</h3>
                      <p className="text-slate-400 text-sm max-w-[280px] mb-6 leading-relaxed">
                        Our support team is ready to assist you. Select a topic below to start.
                      </p>
                      
                      {/* Quick Action Buttons */}
                      <div className="w-full max-w-[320px] space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">Popular Topics</h4>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto py-3 px-4 bg-slate-800/40 hover:bg-slate-800/70 border border-cyan-500/10 hover:border-cyan-500/30 rounded-xl transition-all"
                          onClick={() => handleQuickAction("I need help with my order tracking")}
                        >
                          <div className="text-left">
                            <div className="text-sm font-semibold text-cyan-100">Track My Order</div>
                            <div className="text-[10px] text-slate-500">Get order status and shipping info</div>
                          </div>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto py-3 px-4 bg-slate-800/40 hover:bg-slate-800/70 border border-cyan-500/10 hover:border-cyan-500/30 rounded-xl transition-all"
                          onClick={() => handleQuickAction("How do I use the 3D designer tool?")}
                        >
                          <div className="text-left">
                            <div className="text-sm font-semibold text-cyan-100">3D Designer Help</div>
                            <div className="text-[10px] text-slate-500">Learn how to customize products</div>
                          </div>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto py-3 px-4 bg-slate-800/40 hover:bg-slate-800/70 border border-cyan-500/10 hover:border-cyan-500/30 rounded-xl transition-all"
                          onClick={() => handleQuickAction("What are your payment and pricing options?")}
                        >
                          <div className="text-left">
                            <div className="text-sm font-semibold text-cyan-100">Payment & Pricing</div>
                            <div className="text-[10px] text-slate-500">Available payment methods</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {conversation.messages.map((msg, index) => {
                        const prevMsg = index > 0 ? conversation.messages[index - 1] : undefined;
                        const showDateSeparator = shouldShowDateSeparator(msg, prevMsg);
                        const isGrouped = shouldGroupMessage(msg, prevMsg);
                        
                        return (
                          <div key={msg.id}>
                            {/* Date Separator */}
                            {showDateSeparator && (
                              <div className="flex items-center justify-center my-6">
                                <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900/60 border border-cyan-500/10 rounded-full">
                                  <Clock className="w-3 h-3 text-cyan-500/50" />
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {formatDate(msg.timestamp)}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Message */}
                            <div
                              className={`flex gap-2.5 ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-4'}`}
                            >
                              {/* Avatar - only show if not grouped */}
                              {msg.sender !== 'customer' && !isGrouped && (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                                  {msg.sender === 'ai' ? (
                                    <Bot className="w-4 h-4 text-cyan-400" />
                                  ) : (
                                    <HeadphonesIcon className="w-4 h-4 text-teal-400" />
                                  )}
                                </div>
                              )}
                              
                              {/* Spacer for grouped messages */}
                              {msg.sender !== 'customer' && isGrouped && (
                                <div className="w-8" />
                              )}
                              
                              <div className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                {/* Sender name - only show if not grouped */}
                                {!isGrouped && (
                                  <span className={`text-[9px] font-bold uppercase tracking-wider mb-1.5 ${
                                    msg.sender === 'customer' ? 'text-cyan-400' : 
                                    msg.sender === 'ai' ? 'text-cyan-400' : 'text-teal-400'
                                  }`}>
                                    {msg.sender === 'customer' ? 'You' : 
                                     msg.sender === 'ai' ? 'Toodies AI' : 'Support Team'}
                                  </span>
                                )}
                                
                                {/* Message bubble */}
                                <div
                                  className={`rounded-2xl px-4 py-2.5 shadow-lg transition-all hover:shadow-xl ${
                                    msg.sender === 'customer'
                                      ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white rounded-tr-md'
                                      : msg.sender === 'ai'
                                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 border border-cyan-500/20 rounded-tl-md'
                                      : 'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-200 border border-teal-500/20 rounded-tl-md'
                                  }`}
                                >
                                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                
                                {/* Timestamp and status */}
                                <div className={`flex items-center gap-2 mt-1 px-1 ${msg.sender === 'customer' ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <span className="text-[9px] font-semibold text-slate-600 tracking-tight">
                                    {formatTime(msg.timestamp)}
                                  </span>
                                  {msg.sender === 'customer' && (
                                    <div className="flex items-center">
                                      {msg.read ? (
                                        <CheckCheck className="w-3 h-3 text-cyan-500" />
                                      ) : (
                                        <Check className="w-3 h-3 text-slate-600" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Customer Avatar */}
                              {msg.sender === 'customer' && !isGrouped && (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 border border-cyan-400/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                                  <UserIcon className="w-4 h-4 text-white" />
                                </div>
                              )}
                              
                              {/* Spacer for grouped customer messages */}
                              {msg.sender === 'customer' && isGrouped && (
                                <div className="w-8" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Scroll to bottom indicator */}
                      <div ref={messagesEndRef} className="h-4" />
                    </>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gradient-to-t from-[#0a0f1d] to-[#0a0f1d]/80 border-t border-cyan-500/10 backdrop-blur-xl">
                  <div className="flex gap-2 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="bg-slate-900/80 border-cyan-500/30 text-cyan-50 placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 h-12 rounded-xl pr-14 transition-all shadow-inner"
                    />
                    <Button
                      onClick={() => handleSendMessage()}
                      disabled={!message.trim()}
                      className="absolute right-1.5 top-1.5 w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white border-0 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30 transition-all p-0 flex items-center justify-center hover:scale-105 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2.5 flex items-center justify-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[9px] text-slate-500 font-semibold tracking-wide">
                        Support online
                      </span>
                    </div>
                    <span className="text-slate-700">•</span>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-cyan-500/40" />
                      <span className="text-[9px] text-slate-600 font-semibold tracking-wide">
                        Encrypted
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="notif-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-teal-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Bell className="w-3 h-3" />
                    Notifications
                  </h3>
                  <span className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded-full border border-white/5">
                    {adminNotifications.length} Total
                  </span>
                </div>
                
                {adminNotifications.length === 0 ? (
                  <div className="text-center py-24 flex flex-col items-center opacity-40">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
                      <Bell className="w-6 h-6 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm italic">No recent updates.</p>
                  </div>
                ) : (
                  adminNotifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-teal-500/20 rounded-2xl p-5 relative overflow-hidden group hover:border-teal-500/50 transition-all shadow-md"
                    >
                      {/* Decorative side accent */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-500 to-cyan-500 opacity-50" />
                      
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${
                            notif.type === 'coupon' ? 'bg-amber-500/20 text-amber-400' :
                            notif.type === 'success' ? 'bg-green-500/20 text-green-400' :
                            notif.type === 'warning' ? 'bg-red-500/20 text-red-400' :
                            'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-teal-100 font-bold text-sm tracking-tight">{notif.title}</h4>
                        </div>
                        <span className="text-[8px] font-black text-white/40 uppercase bg-black/40 px-2 py-1 rounded-md border border-white/5 tracking-tighter">
                          Admin
                        </span>
                      </div>
                      
                      <p className="text-slate-300 text-xs leading-relaxed mb-4">
                        {notif.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        {notif.link && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg px-4 border border-cyan-500/10"
                            onClick={() => window.open(notif.link, '_blank')}
                          >
                            {notif.linkText || 'Learn More'}
                          </Button>
                        )}
                      </div>
                      
                      {notif.couponCode && (
                        <div className="mt-3 p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center justify-between">
                          <code className="text-[10px] font-mono text-amber-400 font-bold">{notif.couponCode}</code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-[8px] text-amber-400/70"
                            onClick={() => {
                              navigator.clipboard.writeText(notif.couponCode!);
                              toast.success('Coupon copied!');
                            }}
                          >
                            COPY
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}