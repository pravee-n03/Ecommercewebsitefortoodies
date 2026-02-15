import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Invoice, Order } from '../types';
import { invoiceUtils } from '../utils/invoiceGenerator';
import { storageUtils } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { FileText, Download, Save, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface InvoiceEditorProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
}

export function InvoiceEditor({ order, isOpen, onClose, onSave, onDownload }: InvoiceEditorProps) {
  const [invoice, setInvoice] = useState<Invoice>(
    order.invoice || invoiceUtils.generateInvoiceFromOrder(order)
  );

  useEffect(() => {
    if (isOpen && !order.invoice) {
      const newInvoice = invoiceUtils.generateInvoiceFromOrder(order);
      setInvoice(newInvoice);
    } else if (order.invoice) {
      setInvoice(order.invoice);
    }
  }, [order, isOpen]);

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: parseFloat(value) || 0
    };

    // Recalculate item totals
    const item = updatedItems[index];
    item.taxableAmount = item.unitPrice * item.quantity - item.discount;
    item.gstAmount = (item.taxableAmount * item.gstRate) / 100;
    item.total = item.taxableAmount + item.gstAmount;

    const updatedInvoice = { ...invoice, items: updatedItems };
    setInvoice(invoiceUtils.updateInvoiceCalculations(updatedInvoice));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    const updatedInvoice = { ...invoice, items: updatedItems };
    setInvoice(invoiceUtils.updateInvoiceCalculations(updatedInvoice));
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now().toString(),
      productName: 'New Item',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxableAmount: 0,
      gstRate: invoice.gstRate,
      gstAmount: 0,
      total: 0
    };
    const updatedInvoice = { ...invoice, items: [...invoice.items, newItem] };
    setInvoice(invoiceUtils.updateInvoiceCalculations(updatedInvoice));
  };

  const handleSave = () => {
    onSave(invoice);
    toast.success('Invoice saved successfully!');
  };

  const handleDownload = () => {
    onDownload(invoice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-2 border-cyan-500/30 max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-100 glow-text flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Invoice Editor - {invoice.invoiceNumber}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Edit invoice details and download as PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Company Details */}
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 text-lg">Company Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-cyan-100">Company Name</Label>
                <Input
                  value={invoice.companyName}
                  onChange={(e) => setInvoice({ ...invoice, companyName: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div>
                <Label className="text-cyan-100">GSTIN</Label>
                <Input
                  value={invoice.companyGSTIN}
                  onChange={(e) => setInvoice({ ...invoice, companyGSTIN: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-cyan-100">Address</Label>
                <Textarea
                  value={invoice.companyAddress}
                  onChange={(e) => setInvoice({ ...invoice, companyAddress: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-cyan-100">Email</Label>
                <Input
                  value={invoice.companyEmail}
                  onChange={(e) => setInvoice({ ...invoice, companyEmail: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div>
                <Label className="text-cyan-100">Phone</Label>
                <Input
                  value={invoice.companyPhone}
                  onChange={(e) => setInvoice({ ...invoice, companyPhone: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 text-lg">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-cyan-100">Name</Label>
                <Input
                  value={invoice.customerName}
                  onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div>
                <Label className="text-cyan-100">GSTIN (Optional)</Label>
                <Input
                  value={invoice.customerGSTIN || ''}
                  onChange={(e) => setInvoice({ ...invoice, customerGSTIN: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-cyan-100">Address</Label>
                <Textarea
                  value={invoice.customerAddress}
                  onChange={(e) => setInvoice({ ...invoice, customerAddress: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-cyan-100">Email</Label>
                <Input
                  value={invoice.customerEmail}
                  onChange={(e) => setInvoice({ ...invoice, customerEmail: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div>
                <Label className="text-cyan-100">Phone</Label>
                <Input
                  value={invoice.customerPhone}
                  onChange={(e) => setInvoice({ ...invoice, customerPhone: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 text-lg">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-cyan-100">Invoice Date</Label>
                <Input
                  type="date"
                  value={invoice.invoiceDate.split('T')[0]}
                  onChange={(e) => setInvoice({ ...invoice, invoiceDate: new Date(e.target.value).toISOString() })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                />
              </div>
              <div>
                <Label className="text-cyan-100">GST Rate (%)</Label>
                <Select
                  value={invoice.gstRate.toString()}
                  onValueChange={(value) => {
                    const newInvoice = { ...invoice, gstRate: parseFloat(value) };
                    setInvoice(invoiceUtils.updateInvoiceCalculations(newInvoice));
                  }}
                >
                  <SelectTrigger className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="18">18%</SelectItem>
                    <SelectItem value="28">28%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="interstate"
                    checked={invoice.isInterState}
                    onCheckedChange={(checked) => {
                      const newInvoice = { ...invoice, isInterState: checked as boolean };
                      setInvoice(invoiceUtils.updateInvoiceCalculations(newInvoice));
                    }}
                    className="border-cyan-500/50"
                  />
                  <Label htmlFor="interstate" className="text-cyan-100 cursor-pointer">
                    Inter-State (IGST)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="glass-card border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-cyan-100 text-lg">Items</CardTitle>
              <Button
                onClick={handleAddItem}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-6 gap-2 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl"
                  >
                    <div className="md:col-span-2">
                      <Label className="text-cyan-100 text-xs">Product Name</Label>
                      <Input
                        value={item.productName}
                        onChange={(e) => {
                          const updatedItems = [...invoice.items];
                          updatedItems[index].productName = e.target.value;
                          setInvoice({ ...invoice, items: updatedItems });
                        }}
                        className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-cyan-100 text-xs">Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                        className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-cyan-100 text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(index, 'unitPrice', e.target.value)}
                        className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-cyan-100 text-xs">Total</Label>
                      <Input
                        value={`₹${item.total.toFixed(2)}`}
                        readOnly
                        className="bg-[#0f172a]/80 border-cyan-500/30 text-teal-400 text-sm font-bold"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => handleRemoveItem(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 w-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 text-lg">Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Taxable Amount:</span>
                <span>₹{invoice.taxableAmount.toFixed(2)}</span>
              </div>
              {!invoice.isInterState ? (
                <>
                  <div className="flex justify-between text-slate-300">
                    <span>CGST ({invoice.gstRate / 2}%):</span>
                    <span>₹{invoice.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>SGST ({invoice.gstRate / 2}%):</span>
                    <span>₹{invoice.sgst.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-300">
                  <span>IGST ({invoice.gstRate}%):</span>
                  <span>₹{invoice.igst.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <Label className="text-cyan-100">Shipping Charges</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={invoice.shippingCharges}
                  onChange={(e) => {
                    const charges = parseFloat(e.target.value) || 0;
                    setInvoice({ ...invoice, shippingCharges: charges, grandTotal: invoice.subtotal - invoice.discount + charges });
                  }}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 w-32 text-right"
                />
              </div>
              <div className="flex justify-between text-xl font-bold text-cyan-100 pt-3 border-t border-cyan-500/20">
                <span>Grand Total:</span>
                <span>₹{invoice.grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="glass-card border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-100 text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-cyan-100">Notes</Label>
                <Textarea
                  value={invoice.notes || ''}
                  onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-cyan-100">Terms & Conditions</Label>
                <Textarea
                  value={invoice.termsAndConditions || ''}
                  onChange={(e) => setInvoice({ ...invoice, termsAndConditions: e.target.value })}
                  className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0 py-6"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Invoice
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white glow-button border-0 py-6"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
