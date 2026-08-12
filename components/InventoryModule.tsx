'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Add24Filled, Dismiss24Filled, VehicleTruck24Filled, Box24Regular, Warning24Regular } from '@fluentui/react-icons';

interface ProductItem {
  id: string;
  name: string;
  sku?: string;
  category: string;
  retailPriceCents: number;
  costPriceCents?: number;
  stockQuantity: number;
  lowStockAlertThreshold?: number;
  isRetail?: boolean;
}

export const InventoryModule: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [poSent, setPoSent] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Haircare');
  const [price, setPrice] = useState('28');
  const [stock, setStock] = useState('20');
  const [isRetail, setIsRetail] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('Failed to load products from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleGeneratePO = () => {
    setPoSent(true);
    setTimeout(() => setPoSent(false), 2500);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim() || undefined,
          category: category.trim() || 'General',
          retailPriceCents: Math.round((Number(price) || 28) * 100),
          stockQuantity: Number(stock) || 10,
          isRetail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName('');
        setSku('');
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to create product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const lowStockItems = products.filter(
    (p) => p.stockQuantity <= (p.lowStockAlertThreshold ?? 5)
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('inventoryTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('inventoryDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md hover:opacity-90 transition-opacity"
          >
            <Add24Filled className="w-4 h-4" />
            <span>{t('addProduct')}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleGeneratePO}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700"
          >
            <VehicleTruck24Filled className="w-4 h-4" />
            <span>{poSent ? t('poGenerated') : t('generatePOs')}</span>
          </motion.button>
        </div>
      </div>

      {/* Empty State Banner */}
      {!loading && products.length === 0 && (
        <div className="p-8 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 text-center space-y-3 shadow-sm">
          <Box24Regular className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No products in inventory yet</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Your catalog is currently empty. Click below to add your first retail or back-bar product.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-md"
          >
            + Add First Product
          </button>
        </div>
      )}

      {/* Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warning24Regular className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>{lowStockItems.length} {t('lowStock')}:</strong>{' '}
              {lowStockItems.map((i) => `${i.name} (${i.stockQuantity})`).join(', ')}.
            </span>
          </div>
          <button onClick={handleGeneratePO} className="px-3 py-1 rounded-xl bg-amber-500 text-white font-bold text-[10px]">
            {t('generatePOs')}
          </button>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center text-xs text-[var(--text-muted)] animate-pulse">
          ...
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <div className="col-span-4 p-8 rounded-3xl border border-dashed border-[var(--border-subtle)] text-center">
              <Box24Regular className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[var(--text-secondary)]">{t('noProducts')}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">{t('noProductsSub')}</p>
            </div>
          ) : (
            products.map((prod) => (
              <div
                key={prod.id}
                className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      prod.isRetail ? 'bg-blue-500/10 text-blue-600' : 'bg-purple-500/10 text-purple-600'
                    }`}>
                      {prod.isRetail ? t('retailSale') : t('backBarUse')}
                    </span>
                    {prod.sku && <span className="text-[10px] font-mono text-[var(--text-muted)]">{prod.sku}</span>}
                  </div>
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">{prod.name}</h3>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
                  <span className="text-sm font-bold text-[var(--text-primary)]">${(prod.retailPriceCents || 0) / 100}</span>
                  <span className={`text-xs font-mono font-bold ${prod.stockQuantity <= (prod.lowStockAlertThreshold ?? 5) ? 'text-amber-500' : 'text-green-600'}`}>
                    {prod.stockQuantity} {t('inStock')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h3 className="text-base font-bold text-[var(--text-primary)]">{t('addProduct')}</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('productName')} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Matte Clay Pomade (100ml)"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('skuCode')}</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="POM-001"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('category')}</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Haircare"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('retailPrice')}</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('initialStock')}</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isRetail"
                    checked={isRetail}
                    onChange={(e) => setIsRetail(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="isRetail" className="text-xs font-semibold text-[var(--text-secondary)]">
                    {t('availableRetail')}
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/10 text-xs font-semibold text-[var(--text-secondary)]"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? t('saving') : t('saveProduct')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
