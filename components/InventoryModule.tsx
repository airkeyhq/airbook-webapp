'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { CustomSelect } from '@/components/CustomSelect';
import { EmptyState } from '@/components/EmptyState';
import {
  Add24Filled,
  Dismiss24Filled,
  Box24Regular,
  Warning24Regular,
  Search24Regular,
  CheckmarkCircle24Filled,
  Delete24Filled,
  ShoppingBag24Regular,
  Money24Regular,
  ArrowTrending24Regular,
} from '@fluentui/react-icons';

export interface ProductItem {
  id: string;
  name: string;
  sku?: string;
  category: string;
  retailPriceCents: number;
  costPriceCents?: number;
  stockQuantity: number;
  lowStockAlertThreshold?: number;
  isRetail?: boolean;
  imageUrl?: string;
  createdAt?: string;
}

const getCategoryOptions = (t: (key: any) => string) => [
  { value: 'all', label: t('catAll') },
  { value: 'Haircare', label: t('catHaircare') },
  { value: 'Skincare', label: t('catSkincare') },
  { value: 'Styling', label: t('catStyling') },
  { value: 'Supplies', label: t('catSupplies') },
  { value: 'Wellness', label: t('catWellness') },
  { value: 'General', label: t('catGeneral') },
];

export const InventoryModule: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const CATEGORY_OPTIONS = useMemo(() => getCategoryOptions(t), [t]);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Haircare');
  const [retailPrice, setRetailPrice] = useState('35');
  const [costPrice, setCostPrice] = useState('15');
  const [stockQuantity, setStockQuantity] = useState('15');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [isRetail, setIsRetail] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit / Product Detail Drawer State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editRetailPrice, setEditRetailPrice] = useState('');
  const [editCostPrice, setEditCostPrice] = useState('');
  const [editStockQuantity, setEditStockQuantity] = useState(0);
  const [editLowStockThreshold, setEditLowStockThreshold] = useState(5);
  const [editIsRetail, setEditIsRetail] = useState(true);
  const [editImageUrl, setEditImageUrl] = useState('');

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

  const openEditDrawer = (prod: ProductItem) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSku(prod.sku || '');
    setEditCategory(prod.category || 'General');
    setEditRetailPrice(((prod.retailPriceCents || 0) / 100).toString());
    setEditCostPrice(((prod.costPriceCents || 0) / 100).toString());
    setEditStockQuantity(prod.stockQuantity);
    setEditLowStockThreshold(prod.lowStockAlertThreshold ?? 5);
    setEditIsRetail(prod.isRetail ?? true);
    setEditImageUrl(prod.imageUrl || '');
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
          category,
          retailPriceCents: Math.round((Number(retailPrice) || 0) * 100),
          costPriceCents: Math.round((Number(costPrice) || 0) * 100),
          stockQuantity: Math.max(0, Number(stockQuantity) || 0),
          lowStockAlertThreshold: Number(lowStockThreshold) || 5,
          isRetail,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName('');
        setSku('');
        setImageUrl('');
        addToast(t('productSaved') || 'Product saved successfully.', 'success');
        fetchProducts();
      } else {
        addToast(data.error || t('errorCreatingProduct'), 'error');
      }
    } catch (err) {
      console.error('Failed to create product:', err);
      addToast(t('errorCreatingProduct'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editName.trim(),
          sku: editSku.trim() || undefined,
          category: editCategory.trim() || 'General',
          retailPriceCents: Math.round((Number(editRetailPrice) || 0) * 100),
          costPriceCents: Math.round((Number(editCostPrice) || 0) * 100),
          stockQuantity: Math.max(0, Number(editStockQuantity) || 0),
          lowStockAlertThreshold: Number(editLowStockThreshold) || 5,
          isRetail: editIsRetail,
          imageUrl: editImageUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        addToast(t('productSaved') || 'Product updated.', 'success');
        fetchProducts();
      } else {
        addToast(data.error || t('errorUpdatingProduct'), 'error');
      }
    } catch (err) {
      console.error('Failed to update product:', err);
      addToast(t('errorUpdatingProduct'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStockDelta = async (prodId: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === prodId ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p))
      );

      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: prodId,
          deltaQuantity: delta,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        fetchProducts();
      }
    } catch (err) {
      fetchProducts();
    }
  };

  const handleDeleteProduct = async () => {
    if (!editingProduct) return;
    try {
      setSubmitting(true);
      const res = await fetch(`/api/products?id=${editingProduct.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        addToast(t('productDeleted') || 'Product removed from catalog.', 'success');
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const metrics = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
    const lowStockCount = products.filter((p) => p.stockQuantity <= (p.lowStockAlertThreshold ?? 5)).length;
    const inventoryValuation = products.reduce(
      (acc, p) => acc + ((p.costPriceCents || p.retailPriceCents * 0.4) * (p.stockQuantity || 0)) / 100,
      0
    );
    const retailRevenuePotential = products.reduce(
      (acc, p) => acc + (p.retailPriceCents * (p.stockQuantity || 0)) / 100,
      0
    );
    return { totalUnits, lowStockCount, inventoryValuation, retailRevenuePotential };
  }, [products]);

  const addMargin = useMemo(() => {
    const r = Number(retailPrice) || 0;
    const c = Number(costPrice) || 0;
    if (r <= 0) return 0;
    return Math.round(((r - c) / r) * 100);
  }, [retailPrice, costPrice]);

  const editMargin = useMemo(() => {
    const r = Number(editRetailPrice) || 0;
    const c = Number(editCostPrice) || 0;
    if (r <= 0) return 0;
    return Math.round(((r - c) / r) * 100);
  }, [editRetailPrice, editCostPrice]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('inventoryTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-xl">
            {t('inventoryDesc')}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-md hover:opacity-90 transition-opacity whitespace-nowrap self-start sm:self-auto"
        >
          <Add24Filled className="w-4 h-4 flex-shrink-0" />
          <span>{t('addProduct')}</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
            <Box24Regular className="w-4 h-4 text-blue-500" />
            <span>{t('totalStockUnits')}</span>
          </div>
          <p className="text-xl font-black text-[var(--text-primary)] font-mono">{metrics.totalUnits}</p>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
            <Warning24Regular className="w-4 h-4 text-amber-500" />
            <span>{t('lowStock')}</span>
          </div>
          <p className={`text-xl font-black font-mono ${metrics.lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--text-primary)]'}`}>
            {metrics.lowStockCount}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
            <Money24Regular className="w-4 h-4 text-emerald-500" />
            <span>{t('inventoryValuation')}</span>
          </div>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ${Math.round(metrics.inventoryValuation).toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
            <ArrowTrending24Regular className="w-4 h-4 text-purple-500" />
            <span>{t('metricRetailPotential')}</span>
          </div>
          <p className="text-xl font-black text-[var(--text-primary)] font-mono">
            ${Math.round(metrics.retailRevenuePotential).toLocaleString()}
          </p>
        </div>
      </div>

      {metrics.lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Warning24Regular className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>{metrics.lowStockCount} {t('lowStock')}:</strong>{' '}
              {products
                .filter((p) => p.stockQuantity <= (p.lowStockAlertThreshold ?? 5))
                .slice(0, 3)
                .map((p) => `${p.name} (${t('stockLeft').replace('{n}', String(p.stockQuantity))})`)
                .join(', ')}
              {metrics.lowStockCount > 3 ? ` + ${t('andMoreItems').replace('{n}', String(metrics.lowStockCount - 3))}` : ''}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORY_OPTIONS.slice(0, 5).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedCategory(value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-100 ${
                selectedCategory === value
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search24Regular className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchInventoryPlaceholder')}
            className="w-full pl-9 pr-8 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <Dismiss24Filled className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-xs">
        {loading && (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <EmptyState
            icon={Box24Regular}
            title={t('noProducts')}
            description={t('noProductsSub')}
          />
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="divide-y divide-[var(--border-subtle)]">
            {filteredProducts.map((prod) => {
              const isLowStock = prod.stockQuantity <= (prod.lowStockAlertThreshold ?? 5) && prod.stockQuantity > 0;
              const isOutOfStock = prod.stockQuantity === 0;
              const margin =
                prod.retailPriceCents > 0
                  ? Math.round(
                      ((prod.retailPriceCents - (prod.costPriceCents || 0)) / prod.retailPriceCents) * 100
                    )
                  : 0;

              return (
                <div
                  key={prod.id}
                  onClick={() => openEditDrawer(prod)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag24Regular className="w-6 h-6 text-blue-500/70" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {prod.name}
                        </h3>
                        {prod.sku && (
                          <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-mono text-[var(--text-muted)]">
                            {prod.sku}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[var(--text-secondary)]">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                          {prod.category}
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-[var(--text-muted)] font-mono">
                          {t('costLabel')}: ${((prod.costPriceCents || 0) / 100).toFixed(2)}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {t('marginPercent').replace('{margin}', String(margin))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <p className="text-sm sm:text-base font-black text-[var(--text-primary)] font-mono">
                        ${((prod.retailPriceCents || 0) / 100).toFixed(2)}
                      </p>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider ${
                          isOutOfStock
                            ? 'text-red-600 dark:text-red-400'
                            : isLowStock
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isOutOfStock ? t('outOfStock') : isLowStock ? t('lowStock') : t('inStock')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                      <button
                        type="button"
                        onClick={(e) => handleQuickStockDelta(prod.id, -1, e)}
                        className="w-7 h-7 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold text-sm flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all shadow-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-black font-mono text-[var(--text-primary)]">
                        {prod.stockQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleQuickStockDelta(prod.id, 1, e)}
                        className="w-7 h-7 rounded-xl bg-[var(--bg-primary)] text-[var(--text-primary)] font-bold text-sm flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
            >
              <form onSubmit={handleAddProduct} className="flex flex-col h-full min-h-0 overflow-hidden">
                <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                </div>

                <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('addProduct')}</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors"
                  >
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

                <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('productName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('productNamePlaceholder')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('category')}
                      </label>
                      <CustomSelect
                        value={category}
                        onChange={(val) => setCategory(val)}
                        options={CATEGORY_OPTIONS.filter((c) => c.value !== 'all')}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('skuCode')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('skuPlaceholder')}
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('retailPrice')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={retailPrice}
                        onChange={(e) => setRetailPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('costPrice')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold">{t('profitMargin')}:</span>
                    <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {t('profitMarginPercent').replace('{margin}', String(addMargin))}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('initialStock')}
                      </label>
                      <input
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('lowStockThreshold')}
                      </label>
                      <input
                        type="number"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('productImageUrl')}
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[var(--text-primary)]">
                      <input
                        type="checkbox"
                        checked={isRetail}
                        onChange={(e) => setIsRetail(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 border-black/10 focus:ring-blue-500"
                      />
                      <span>{t('availableRetail')}</span>
                    </label>
                  </div>
                </div>

                <div className="w-full p-4 sm:p-5 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] z-30 flex-shrink-0">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-extrabold shadow-md hover:opacity-90 active:scale-98 transition-all duration-100 ease-out flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckmarkCircle24Filled className="w-4 h-4" />
                    <span>{submitting ? t('saving') : t('saveProduct')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
            >
              <form onSubmit={handleUpdateProduct} className="flex flex-col h-full min-h-0 overflow-hidden">
                <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                </div>

                <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {editImageUrl ? (
                        <img src={editImageUrl} alt={editName} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag24Regular className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[var(--text-primary)]">{editName}</h3>
                      <p className="text-[11px] text-[var(--text-secondary)]">{editCategory}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors"
                  >
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

                <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('productName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('category')}
                      </label>
                      <CustomSelect
                        value={editCategory}
                        onChange={(val) => setEditCategory(val)}
                        options={CATEGORY_OPTIONS.filter((c) => c.value !== 'all')}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('skuCode')}
                      </label>
                      <input
                        type="text"
                        value={editSku}
                        onChange={(e) => setEditSku(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('retailPrice')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editRetailPrice}
                        onChange={(e) => setEditRetailPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('costPrice')}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editCostPrice}
                        onChange={(e) => setEditCostPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold">{t('profitMargin')}:</span>
                    <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {t('profitMarginPercent').replace('{margin}', String(editMargin))}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('initialStock')}
                      </label>
                      <input
                        type="number"
                        value={editStockQuantity}
                        onChange={(e) => setEditStockQuantity(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('lowStockThreshold')}
                      </label>
                      <input
                        type="number"
                        value={editLowStockThreshold}
                        onChange={(e) => setEditLowStockThreshold(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('productImageUrl')}
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[var(--text-primary)]">
                      <input
                        type="checkbox"
                        checked={editIsRetail}
                        onChange={(e) => setEditIsRetail(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 border-black/10 focus:ring-blue-500"
                      />
                      <span>{t('availableRetail')}</span>
                    </label>
                  </div>
                </div>

                <div className="w-full p-4 sm:p-5 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] space-y-2.5 z-30 flex-shrink-0">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-extrabold shadow-md hover:opacity-90 active:scale-98 transition-all duration-100 ease-out flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckmarkCircle24Filled className="w-4 h-4" />
                    <span>{submitting ? t('saving') : t('saveProduct')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteProduct}
                    disabled={submitting}
                    className="w-full py-2.5 px-4 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Delete24Filled className="w-4 h-4" />
                    <span>{t('deleteProduct')}</span>
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
