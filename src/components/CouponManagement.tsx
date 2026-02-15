import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, Percent, DollarSign, Tag as TagIcon, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { storageUtils } from '../utils/storage';
import { Coupon } from '../types';
import { toast } from 'sonner@2.0.3';

export function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    setCoupons(storageUtils.getCoupons());
  };

  const resetForm = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMinOrderValue('');
    setMaxDiscount('');
    setExpiryDate('');
    setUsageLimit('');
    setIsActive(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !discountValue) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if code already exists
    const existingCoupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (existingCoupon) {
      toast.error('Coupon code already exists');
      return;
    }

    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderValue: minOrderValue ? parseFloat(minOrderValue) : undefined,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      expiryDate: expiryDate || undefined,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      isActive,
      usedCount: 0,
      createdAt: new Date().toISOString()
    };

    storageUtils.addCoupon(newCoupon);
    loadCoupons();
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Coupon created successfully');
  };

  const handleDelete = (couponId: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      storageUtils.deleteCoupon(couponId);
      loadCoupons();
      toast.success('Coupon deleted');
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    const updatedCoupon = { ...coupon, isActive: !coupon.isActive };
    storageUtils.updateCoupon(coupon.id, updatedCoupon);
    loadCoupons();
    toast.success(`Coupon ${updatedCoupon.isActive ? 'activated' : 'deactivated'}`);
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isLimitReached = (coupon: Coupon) => {
    if (!coupon.usageLimit) return false;
    return coupon.usedCount >= coupon.usageLimit;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 p-3 rounded-xl glow-border">
            <TagIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-cyan-100">Discount Coupons</h2>
            <p className="text-slate-400">Create and manage discount codes for customers</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl glass-card border-cyan-500/30 bg-[#0f172a]">
            <DialogHeader>
              <DialogTitle className="text-cyan-100">Create New Coupon</DialogTitle>
              <DialogDescription className="text-slate-400">Add a new discount coupon for customers</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-cyan-100">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g., SAVE20"
                    className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountType" className="text-cyan-100">Discount Type *</Label>
                  <Select value={discountType} onValueChange={(value: 'percentage' | 'fixed') => setDiscountType(value)}>
                    <SelectTrigger className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f172a] border-cyan-500/30">
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountValue" className="text-cyan-100">
                    Discount Value * {discountType === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? '10' : '500'}
                    className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue" className="text-cyan-100">Min. Order Value (₹)</Label>
                  <Input
                    id="minOrderValue"
                    type="number"
                    step="0.01"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="Optional"
                    className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {discountType === 'percentage' && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount" className="text-cyan-100">Max. Discount Amount (₹)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    step="0.01"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="Optional"
                    className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-cyan-100">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit" className="text-cyan-100">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="Unlimited"
                    className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
              >
                Create Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-100">All Coupons ({coupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No coupons yet. Create your first discount coupon!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-cyan-500/20 hover:bg-transparent">
                    <TableHead className="text-cyan-300">Code</TableHead>
                    <TableHead className="text-cyan-300">Discount</TableHead>
                    <TableHead className="text-cyan-300">Conditions</TableHead>
                    <TableHead className="text-cyan-300">Usage</TableHead>
                    <TableHead className="text-cyan-300">Status</TableHead>
                    <TableHead className="text-cyan-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id} className="border-cyan-500/10 hover:bg-cyan-500/5">
                      <TableCell className="font-mono font-bold text-cyan-100">{coupon.code}</TableCell>
                      <TableCell className="text-teal-400">
                        {coupon.discountType === 'percentage' ? (
                          <span className="flex items-center gap-1">
                            <Percent className="w-4 h-4" />
                            {coupon.discountValue}%
                            {coupon.maxDiscount && ` (max ₹${coupon.maxDiscount})`}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            ₹{coupon.discountValue}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm">
                        {coupon.minOrderValue && <div>Min: ₹{coupon.minOrderValue}</div>}
                        {coupon.expiryDate && (
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3 h-3" />
                            {new Date(coupon.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge 
                            className={`${coupon.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'} cursor-pointer`}
                            onClick={() => handleToggleActive(coupon)}
                          >
                            {coupon.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {isExpired(coupon.expiryDate) && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                              Expired
                            </Badge>
                          )}
                          {isLimitReached(coupon) && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              Limit Reached
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(coupon.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
