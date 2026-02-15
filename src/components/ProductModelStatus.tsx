import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { storageUtils } from '../utils/storage';
import { CheckCircle2, XCircle, Info, ArrowRight } from 'lucide-react';

export function ProductModelStatus() {
  const products = storageUtils.getProducts();
  const modelConfigs = storageUtils.get3DModelConfigs();

  const productsWithModels = products.filter(p => {
    const config = storageUtils.get3DModelConfigByProductId(p.id);
    return config !== null;
  });

  const productsWithoutModels = products.filter(p => {
    const config = storageUtils.get3DModelConfigByProductId(p.id);
    return config === null;
  });

  return (
    <Card className="glass-card border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-cyan-100 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Product & 2D Model Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-cyan-500/10 border-cyan-500/30">
          <AlertDescription className="text-slate-300 text-sm">
            <strong className="text-cyan-400">How it works:</strong>
            <ol className="mt-2 space-y-1 ml-4">
              <li>• <strong>Store (Products Tab):</strong> Shows ALL products to customers</li>
              <li>• <strong>2D Studio Page:</strong> Shows ONLY products with 2D model configurations</li>
              <li>• <strong>"Create 2D Design" button:</strong> Only appears on products with 2D models</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{products.length}</div>
                <div className="text-slate-400 text-sm">Total Products</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{productsWithModels.length}</div>
                <div className="text-slate-400 text-sm flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  With 2D Models
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">{productsWithoutModels.length}</div>
                <div className="text-slate-400 text-sm flex items-center justify-center gap-1">
                  <XCircle className="w-4 h-4 text-amber-400" />
                  Without 2D Models
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {productsWithModels.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Products Ready for 2D Design:
            </h4>
            <div className="space-y-1">
              {productsWithModels.map(product => {
                const config = storageUtils.get3DModelConfigByProductId(product.id);
                return (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-green-500/5 border border-green-500/20 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        ID: {product.id}
                      </Badge>
                      <span className="text-slate-300">{product.name}</span>
                    </div>
                    {config && (
                      <span className="text-slate-500 text-xs">Model: {config.productName}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {productsWithoutModels.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Products Missing 2D Models:
            </h4>
            <div className="space-y-1">
              {productsWithoutModels.map(product => (
                <div key={product.id} className="flex items-center justify-between p-2 bg-amber-500/5 border border-amber-500/20 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                      ID: {product.id}
                    </Badge>
                    <span className="text-slate-300">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Add in 2D Models tab</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {modelConfigs.length === 0 && products.length > 0 && (
          <Alert className="bg-red-500/10 border-red-500/30">
            <AlertDescription className="text-red-300 text-sm">
              <strong>⚠️ No 2D models configured!</strong> Go to the "2D Models" tab to add 2D design configurations for your products.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
