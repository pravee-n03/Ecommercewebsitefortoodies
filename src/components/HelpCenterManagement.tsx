import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, Settings, User as UserIcon, MessageCircle, X, Check, Clock, Bot as BotIcon } from 'lucide-react';
import { storageUtils } from '../utils/storage';
import { ChatConversation, ChatMessage, AIConfig } from '../types/index';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

export function HelpCenterManagement() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [message, setMessage] = useState('');
  const [aiConfig, setAIConfig] = useState<AIConfig>(storageUtils.getAIConfig());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const loadConversations = () => {
    const allConversations = storageUtils.getChatConversations();
    // Sort by last message time
    const sorted = allConversations.sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
    setConversations(sorted);
    
    // Select first conversation if none selected
    if (!selectedConversation && sorted.length > 0) {
      setSelectedConversation(sorted[0]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      userId: 'admin',
      userName: 'Admin',
      userEmail: storageUtils.getAdminSettings().gmail,
      message: message.trim(),
      sender: 'admin',
      timestamp: new Date().toISOString(),
      read: true
    };

    const updatedConversation: ChatConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0
    };

    storageUtils.updateChatConversation(selectedConversation.id, updatedConversation);
    setSelectedConversation(updatedConversation);
    loadConversations();
    setMessage('');
    toast.success('Message sent!');
  };

  const handleMarkAsRead = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      const updatedConv = { ...conv, unreadCount: 0 };
      storageUtils.updateChatConversation(conversationId, updatedConv);
      loadConversations();
    }
  };

  const handleCloseConversation = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      const updatedConv = { ...conv, status: 'closed' };
      storageUtils.updateChatConversation(conversationId, updatedConv);
      loadConversations();
      toast.success('Conversation closed');
    }
  };

  const handleSaveAIConfig = () => {
    storageUtils.saveAIConfig(aiConfig);
    toast.success('AI Configuration saved!');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const openConversations = conversations.filter(c => c.status === 'open');
  const closedConversations = conversations.filter(c => c.status === 'closed');

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-cyan-100 glow-text flex items-center gap-3">
            <MessageCircle className="w-8 h-8" />
            Help Center Management
          </h1>
          <p className="text-slate-400 mt-2">Manage customer conversations and AI assistant</p>
        </div>

        <Tabs defaultValue="conversations" className="w-full">
          <TabsList className="bg-[#0f172a]/50 border border-cyan-500/20 mb-6">
            <TabsTrigger 
              value="conversations"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Conversations {openConversations.length > 0 && `(${openConversations.length})`}
            </TabsTrigger>
            <TabsTrigger 
              value="ai-config"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Conversation List */}
              <div className="lg:col-span-1">
                <Card className="glass-card border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-100 text-lg">Active Chats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                    {openConversations.length === 0 ? (
                      <p className="text-slate-400 text-sm text-center py-8">No active conversations</p>
                    ) : (
                      openConversations.map((conv) => (
                        <motion.div
                          key={conv.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedConversation?.id === conv.id
                              ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-2 border-cyan-500/50'
                              : 'bg-slate-800/30 border border-slate-700 hover:border-cyan-500/30'
                          }`}
                          onClick={() => {
                            setSelectedConversation(conv);
                            handleMarkAsRead(conv.id);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-cyan-100 font-medium text-sm">{conv.userName}</p>
                                <p className="text-slate-500 text-xs">{conv.userEmail}</p>
                              </div>
                            </div>
                            {conv.unreadCount > 0 && (
                              <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs truncate">
                            {conv.messages[conv.messages.length - 1]?.message || 'No messages yet'}
                          </p>
                          <p className="text-slate-600 text-xs mt-1">{formatTime(conv.lastMessageAt)}</p>
                        </motion.div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-2">
                <Card className="glass-card border-cyan-500/30 h-[700px] flex flex-col">
                  {selectedConversation ? (
                    <>
                      <CardHeader className="border-b border-cyan-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-cyan-100 text-lg">{selectedConversation.userName}</CardTitle>
                              <CardDescription className="text-slate-400 text-sm">{selectedConversation.userEmail}</CardDescription>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCloseConversation(selectedConversation.id)}
                            className="border-cyan-500/30 text-cyan-100 hover:bg-cyan-500/10"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Close Chat
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {selectedConversation.messages.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-slate-400">No messages yet</p>
                          </div>
                        ) : (
                          <AnimatePresence>
                            {selectedConversation.messages.map((msg, index) => (
                              <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={`flex gap-2 ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                              >
                                {msg.sender === 'customer' && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                
                                <div className={`max-w-[75%] ${msg.sender === 'customer' ? 'order-2' : 'order-1'}`}>
                                  <div
                                    className={`rounded-2xl px-4 py-2 ${
                                      msg.sender === 'customer'
                                        ? 'bg-slate-800/50 text-slate-200 border border-slate-700'
                                        : msg.sender === 'ai'
                                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-500/30'
                                        : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                                    }`}
                                  >
                                    <p className="text-sm break-words">{msg.message}</p>
                                  </div>
                                  <p className={`text-xs text-slate-500 mt-1 ${msg.sender === 'customer' ? 'text-left' : 'text-right'}`}>
                                    {msg.sender === 'ai' && <BotIcon className="w-3 h-3 inline mr-1" />}
                                    {formatTimestamp(msg.timestamp)}
                                  </p>
                                </div>

                                {msg.sender !== 'customer' && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 order-2">
                                    {msg.sender === 'ai' ? (
                                      <Bot className="w-4 h-4 text-white" />
                                    ) : (
                                      <Settings className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        )}
                        <div ref={messagesEndRef} />
                      </CardContent>

                      <div className="border-t border-cyan-500/20 p-4">
                        <div className="flex gap-2">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your reply..."
                            className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white border-0"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">Select a conversation to start chatting</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-config">
            <Card className="glass-card border-cyan-500/30 max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-cyan-100 flex items-center gap-2">
                  <Bot className="w-6 h-6" />
                  AI Assistant Configuration
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure AI-powered responses for customer support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Note:</strong> Connect your AI provider to enable automated responses. The AI will assist with common questions while you handle complex issues.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ai-provider" className="text-cyan-100">AI Provider</Label>
                    <Select
                      value={aiConfig.provider}
                      onValueChange={(value) => setAIConfig({ ...aiConfig, provider: value as any })}
                    >
                      <SelectTrigger className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100">
                        <SelectValue placeholder="Select AI Provider" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f172a] border-cyan-500/30">
                        <SelectItem value="none">None (Disabled)</SelectItem>
                        <SelectItem value="openai">OpenAI (GPT-4, GPT-3.5)</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="claude">Anthropic Claude</SelectItem>
                        <SelectItem value="custom">Custom API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {aiConfig.provider !== 'none' && (
                    <>
                      <div>
                        <Label htmlFor="api-key" className="text-cyan-100">API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          value={aiConfig.apiKey}
                          onChange={(e) => setAIConfig({ ...aiConfig, apiKey: e.target.value })}
                          placeholder="Enter your API key"
                          className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                        />
                        <p className="text-slate-500 text-xs mt-1">
                          Your API key is stored securely and never shared
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="model" className="text-cyan-100">Model</Label>
                        <Input
                          id="model"
                          value={aiConfig.model}
                          onChange={(e) => setAIConfig({ ...aiConfig, model: e.target.value })}
                          placeholder={
                            aiConfig.provider === 'openai' ? 'gpt-4, gpt-3.5-turbo' :
                            aiConfig.provider === 'gemini' ? 'gemini-pro' :
                            aiConfig.provider === 'claude' ? 'claude-3-opus' : 'model-name'
                          }
                          className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="greeting" className="text-cyan-100">Greeting Message</Label>
                        <Input
                          id="greeting"
                          value={aiConfig.greetingMessage}
                          onChange={(e) => setAIConfig({ ...aiConfig, greetingMessage: e.target.value })}
                          placeholder="Hello! How can I help you today?"
                          className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="enabled"
                          checked={aiConfig.isEnabled}
                          onCheckedChange={(checked) => setAIConfig({ ...aiConfig, isEnabled: checked as boolean })}
                          className="border-cyan-500/50"
                        />
                        <Label htmlFor="enabled" className="text-cyan-100 cursor-pointer">
                          Enable AI Assistant
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="auto-reply"
                          checked={aiConfig.autoReply}
                          onCheckedChange={(checked) => setAIConfig({ ...aiConfig, autoReply: checked as boolean })}
                          className="border-cyan-500/50"
                        />
                        <Label htmlFor="auto-reply" className="text-cyan-100 cursor-pointer">
                          Enable Auto-Reply (AI responds automatically)
                        </Label>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-200 text-sm">
                          <strong>Best Practices:</strong> Start with auto-reply disabled and review AI responses. Enable auto-reply once you're confident in the AI's performance.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={handleSaveAIConfig}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white border-0 py-6"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Save AI Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
