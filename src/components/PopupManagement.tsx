import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Bell, Plus, Edit, Trash2, Calendar, Users, AlertCircle } from 'lucide-react';
import { PopupMessage } from '../types';
import { storageUtils } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

export function PopupManagement() {
  const [popups, setPopups] = useState<PopupMessage[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupMessage | null>(null);
  const [formData, setFormData] = useState<Partial<PopupMessage>>({
    title: '',
    message: '',
    type: 'info',
    link: '',
    linkText: '',
    couponCode: '',
    isActive: true,
    targetAudience: 'all',
    displayFrequency: 'session',
    priority: 1,
    expiryDate: ''
  });

  useEffect(() => {
    loadPopups();
  }, []);

  const loadPopups = () => {
    const loadedPopups = storageUtils.getPopupMessages();
    // Sort by priority (high to low) and then by date
    loadedPopups.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setPopups(loadedPopups);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingPopup) {
      const updatedPopup: PopupMessage = {
        ...editingPopup,
        ...formData,
        priority: Number(formData.priority) || 1
      } as PopupMessage;
      storageUtils.updatePopupMessage(editingPopup.id, updatedPopup);
      toast.success('Popup updated successfully');
      setEditingPopup(null);
    } else {
      const newPopup: PopupMessage = {
        id: Date.now().toString(),
        title: formData.title!,
        message: formData.message!,
        type: formData.type as any,
        link: formData.link,
        linkText: formData.linkText,
        couponCode: formData.couponCode,
        isActive: formData.isActive!,
        targetAudience: formData.targetAudience as any,
        displayFrequency: formData.displayFrequency as any,
        priority: Number(formData.priority) || 1,
        createdAt: new Date().toISOString(),
        expiryDate: formData.expiryDate
      };
      storageUtils.addPopupMessage(newPopup);
      toast.success('Popup created successfully');
    }

    setIsAddDialogOpen(false);
    resetForm();
    loadPopups();
  };

  const handleEdit = (popup: PopupMessage) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      message: popup.message,
      type: popup.type,
      link: popup.link || '',
      linkText: popup.linkText || '',
      couponCode: popup.couponCode || '',
      isActive: popup.isActive,
      targetAudience: popup.targetAudience,
      displayFrequency: popup.displayFrequency,
      priority: popup.priority,
      expiryDate: popup.expiryDate || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (popupId: string) => {
    if (confirm('Are you sure you want to delete this popup?')) {
      storageUtils.deletePopupMessage(popupId);
      toast.success('Popup deleted successfully');
      loadPopups();
    }
  };

  const toggleActive = (popup: PopupMessage) => {
    const updatedPopup = { ...popup, isActive: !popup.isActive };
    storageUtils.updatePopupMessage(popup.id, updatedPopup);
    toast.success(`Popup ${updatedPopup.isActive ? 'activated' : 'deactivated'}`);
    loadPopups();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      link: '',
      linkText: '',
      couponCode: '',
      isActive: true,
      targetAudience: 'all',
      displayFrequency: 'session',
      priority: 1,
      expiryDate: ''
    });
    setEditingPopup(null);
  };

  const createDefaultPopups = () => {
    const defaults: PopupMessage[] = [
      {
        id: Date.now().toString(),
        title: '🎉 Welcome to Toodies!',
        message: 'Design your own custom apparel with our advanced 3D designer tool. Get started today!',
        type: 'success',
        isActive: true,
        targetAudience: 'all',
        displayFrequency: 'once',
        priority: 5,
        createdAt: new Date().toISOString()
      },
      {
        id: (Date.now() + 1).toString(),
        title: '⚠️ Verify Your Account',
        message: 'Please verify your email and mobile number to place orders. Click below to verify now.',
        type: 'verification',
        link: '/verify',
        linkText: 'Verify Now',
        isActive: true,
        targetAudience: 'unverified',
        displayFrequency: 'session',
        priority: 10,
        createdAt: new Date().toISOString()
      },
      {
        id: (Date.now() + 2).toString(),
        title: '🎁 New Customer Special!',
        message: 'Welcome! As a new customer, enjoy 50% off your first order with us!',
        type: 'coupon',
        couponCode: 'NEWUSER50',
        isActive: true,
        targetAudience: 'new',
        displayFrequency: 'once',
        priority: 9,
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: (Date.now() + 3).toString(),
        title: '💎 Valued Customer Reward',
        message: 'Thank you for being with us! Get 20% off on your next purchase.',
        type: 'coupon',
        couponCode: 'LOYAL20',
        isActive: true,
        targetAudience: 'existing',
        displayFrequency: 'once',
        priority: 6,
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];

    defaults.forEach(popup => storageUtils.addPopupMessage(popup));
    toast.success('Default popups created successfully');
    loadPopups();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return '💡';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'coupon': return '🎁';
      case 'verification': return '🔐';
      default: return '📢';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'coupon': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'verification': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="glass-card border-cyan-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-cyan-100 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Popup Messages ({popups.length})
          </CardTitle>
          <CardDescription className="text-slate-400">
            Create and manage popup notifications for customers
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600">
              <Plus className="mr-2 h-4 w-4" />
              Create Popup
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-cyan-500/20 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-cyan-100">
                {editingPopup ? 'Edit Popup Message' : 'Create New Popup'}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Configure popup notifications for your customers
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-slate-300">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter popup title"
                    className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label className="text-slate-300">Message *</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter popup message"
                    className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100 min-h-[100px]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-cyan-500/20">
                      <SelectItem value="info">💡 Info</SelectItem>
                      <SelectItem value="warning">⚠️ Warning</SelectItem>
                      <SelectItem value="success">✅ Success</SelectItem>
                      <SelectItem value="coupon">🎁 Coupon</SelectItem>
                      <SelectItem value="verification">🔐 Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Priority (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100"
                  />
                  <p className="text-xs text-slate-500 mt-1">Higher priority shows first</p>
                </div>

                <div>
                  <Label className="text-slate-300">Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData({ ...formData, targetAudience: value as any })}
                  >
                    <SelectTrigger className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-cyan-500/20">
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="verified">Verified Only</SelectItem>
                      <SelectItem value="unverified">Unverified Only</SelectItem>
                      <SelectItem value="new">New Users (&lt;1 month)</SelectItem>
                      <SelectItem value="existing">Existing Users (&gt;1 month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Display Frequency</Label>
                  <Select
                    value={formData.displayFrequency}
                    onValueChange={(value) => setFormData({ ...formData, displayFrequency: value as any })}
                  >
                    <SelectTrigger className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-cyan-500/20">
                      <SelectItem value="once">Once (Never Show Again)</SelectItem>
                      <SelectItem value="session">Once Per Session</SelectItem>
                      <SelectItem value="always">Always Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'coupon' && (
                  <div className="col-span-2">
                    <Label className="text-slate-300">Coupon Code</Label>
                    <Input
                      value={formData.couponCode}
                      onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                      placeholder="Enter coupon code"
                      className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <Label className="text-slate-300">Link URL (Optional)</Label>
                  <Input
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com or /page"
                    className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100"
                  />
                </div>

                {formData.link && (
                  <div className="col-span-2">
                    <Label className="text-slate-300">Link Text</Label>
                    <Input
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      placeholder="e.g., Learn More, Click Here"
                      className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <Label className="text-slate-300">Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="bg-[#0a0e1a]/50 border-cyan-500/20 text-slate-100"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <Label htmlFor="isActive" className="text-slate-300 cursor-pointer">
                    Active (Show to customers)
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                >
                  {editingPopup ? 'Update Popup' : 'Create Popup'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {popups.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400 mb-2">No popup messages created yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Create popup notifications to engage with your customers
            </p>
            <Button
              onClick={createDefaultPopups}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Default Popups
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {popups.map((popup, index) => (
              <motion.div
                key={popup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  popup.isActive
                    ? 'bg-[#0f172a]/50 border-cyan-500/20'
                    : 'bg-[#0a0e1a]/30 border-slate-700/20 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getTypeIcon(popup.type)}</span>
                      <h3 className="font-semibold text-cyan-100">{popup.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${getTypeBadgeClass(popup.type)}`}>
                        {popup.type}
                      </span>
                      {popup.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          Active
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Priority: {popup.priority}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{popup.message}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {popup.targetAudience === 'all' ? 'All Users' : 
                         popup.targetAudience === 'verified' ? 'Verified Only' : 
                         popup.targetAudience === 'unverified' ? 'Unverified Only' :
                         popup.targetAudience === 'new' ? 'New Users (<1 month)' :
                         'Existing Users (>1 month)'}
                      </span>
                      <span>•</span>
                      <span>
                        {popup.displayFrequency === 'once' ? 'Show Once' : popup.displayFrequency === 'session' ? 'Per Session' : 'Always Show'}
                      </span>
                      {popup.couponCode && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">
                            {popup.couponCode}
                          </span>
                        </>
                      )}
                      {popup.expiryDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires: {new Date(popup.expiryDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                      {popup.link && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-400">
                            Has Link: {popup.linkText || 'Click Here'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(popup)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      {popup.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(popup)}
                      className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(popup.id)}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}