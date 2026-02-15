import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Trash2, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { storageUtils } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

export function CategoryManagement() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setCategories(storageUtils.getCategories());
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    const success = storageUtils.addCategory(newCategory.trim());
    if (success) {
      toast.success('Category added successfully');
      setNewCategory('');
      loadCategories();
    } else {
      toast.error('Category already exists');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Are you sure you want to delete "${category}"? This won't affect existing products.`)) {
      storageUtils.deleteCategory(category);
      toast.success('Category deleted');
      loadCategories();
    }
  };

  return (
    <Card className="glass-card border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-cyan-100 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Manage Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <div className="flex-1">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category name..."
              className="bg-[#0f172a]/50 border-cyan-500/30 text-cyan-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/50"
            />
          </div>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white glow-button border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </form>

        {/* Categories List */}
        <div className="space-y-3">
          <Label className="text-cyan-100">Existing Categories ({categories.length})</Label>
          {categories.length === 0 ? (
            <p className="text-center text-slate-400 py-8">No categories yet. Add your first category!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  <div className="glass-card border-cyan-500/20 p-4 rounded-lg hover:border-cyan-500/40 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-teal-400" />
                        <span className="text-cyan-100 font-medium">{category}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
          <p className="text-sm text-cyan-200">
            <strong>Note:</strong> Categories help organize your products. Deleting a category won't affect existing products that use it.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
