'use client';

import { useMemo, useState } from 'react';

type Category = { id: string; name: string }; 
type Brand = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  rating: number;
  numReviews: number;
  specs: Record<string, string> | null | any;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  flashDeal: boolean;
  categoryId: string;
  brandId?: string | null;
  category?: Category;
  brand?: Brand | null;
};

type Props = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
};

const defaultForm = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  comparePrice: 0,
  images: [''],
  stock: 0,
  rating: 4.5,
  numReviews: 0,
  specs: '',
  isFeatured: false,
  isTrending: false,
  isBestSeller: false,
  flashDeal: false,
  categoryId: '',
  brandId: ''
};

function parseSpecs(value: string) {
  const specs: Record<string, string> = {};
  value.split(/\r?\n/).forEach((line) => {
    const [key, ...rest] = line.split(':');
    if (!key) return;
    const text = rest.join(':').trim();
    if (text) specs[key.trim()] = text;
  });
  return Object.keys(specs).length > 0 ? specs : null;
}

function specsToText(specs: Record<string, string> | null) {
  if (!specs) return '';
  return Object.entries(specs).map(([key, value]) => `${key}: ${value}`).join('\n');
}

export default function AdminProductManager({ products: initialProducts, categories, brands }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [products, selectedId]
  );
  const [form, setForm] = useState({
    ...defaultForm,
    categoryId: categories[0]?.id ?? '',
    brandId: brands[0]?.id ?? ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fillForm = (product: Product | null) => {
    if (!product) {
      setSelectedId(null);
      setForm({
        ...defaultForm,
        categoryId: categories[0]?.id ?? '',
        brandId: brands[0]?.id ?? ''
      });
      return;
    }

    setSelectedId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice ?? 0,
      images: product.images.length > 0 ? product.images : [''],
      stock: product.stock,
      rating: product.rating,
      numReviews: product.numReviews,
      specs: specsToText(product.specs ?? null),
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      isBestSeller: product.isBestSeller,
      flashDeal: product.flashDeal,
      categoryId: product.categoryId,
      brandId: product.brandId ?? ''
    });
  };

  const handleChange = (field: string, value: string | boolean | number | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createOrUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const body = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      images: form.images.filter((img) => img.trim()),
      stock: Number(form.stock),
      rating: Number(form.rating),
      numReviews: Number(form.numReviews),
      specs: parseSpecs(form.specs),
      isFeatured: Boolean(form.isFeatured),
      isTrending: Boolean(form.isTrending),
      isBestSeller: Boolean(form.isBestSeller),
      flashDeal: Boolean(form.flashDeal),
      categoryId: form.categoryId,
      brandId: form.brandId || undefined
    };

    try {
      const url = selectedId ? `/api/admin/products/${selectedId}` : '/api/admin/products';
      const method = selectedId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        setMessage(error.error || 'Server error');
        return;
      }

      const data = await response.json();

      if (selectedId) {
        setProducts((current) => current.map((product) => (product.id === data.id ? data : product)));
        setMessage('Product updated successfully.');
      } else {
        setProducts((current) => [data, ...current]);
        setMessage('Product created successfully.');
      }

      fillForm(null);
    } catch (error) {
      setMessage('Unable to save product.');
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        const error = await response.json();
        setMessage(error.error || 'Server error');
        return;
      }

      setProducts((current) => current.filter((product) => product.id !== productId));
      if (selectedId === productId) fillForm(null);
      setMessage('Product deleted successfully.');
    } catch {
      setMessage('Unable to delete product.');
    } finally {
      setSaving(false);
    }
  };

  const rowClass = 'rounded-xl border border-white/10 p-4';

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Manager</h2>
          <p className="text-sm text-neutral-400">Create, edit, or delete products from the admin panel.</p>
        </div>
        <button type="button" onClick={() => fillForm(null)} className="btn-primary px-5 py-2.5">
          New Product
        </button>
      </div>

      {message && <div className="mb-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className={rowClass}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Products</h3>
              <span className="text-sm text-neutral-400">{products.length} items</span>
            </div>
            <div className="space-y-3">
              {products.slice(0, 12).map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-neutral-500">{product.category?.name ?? 'No category'} · {product.brand?.name ?? 'No brand'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fillForm(product)} className="rounded-lg border border-white/15 px-3 py-1 text-sm hover:bg-white/10">Edit</button>
                    <button type="button" onClick={() => removeProduct(product.id)} className="rounded-lg border border-red-500/40 px-3 py-1 text-sm text-red-300 hover:bg-red-500/10">Delete</button>
                  </div>
                </div>
              ))}
              {products.length > 12 && <p className="text-sm text-neutral-400">Showing 12 of {products.length} products. Reload page to see more.</p>}
            </div>
          </div>
        </div>

        <form onSubmit={createOrUpdate} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold">{selectedId ? 'Edit Product' : 'Create Product'}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Name</span>
              <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" required />
            </label>
            <label className="space-y-2 text-sm">
              <span>Slug</span>
              <input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" required />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span>Description</span>
            <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" required />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Price</span>
              <input type="number" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" step="0.01" required />
            </label>
            <label className="space-y-2 text-sm">
              <span>Compare Price</span>
              <input type="number" value={form.comparePrice ?? 0} onChange={(e) => handleChange('comparePrice', Number(e.target.value))} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" step="0.01" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Stock</span>
              <input type="number" value={form.stock} onChange={(e) => handleChange('stock', Number(e.target.value))} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" required />
            </label>
            <label className="space-y-2 text-sm">
              <span>Rating</span>
              <input type="number" value={form.rating} onChange={(e) => handleChange('rating', Number(e.target.value))} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" step="0.1" min="0" max="5" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span>Reviews</span>
              <input type="number" value={form.numReviews} onChange={(e) => handleChange('numReviews', Number(e.target.value))} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" />
            </label>
            <label className="space-y-2 text-sm">
              <span>Category</span>
              <select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" required>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span>Brand</span>
            <select value={form.brandId} onChange={(e) => handleChange('brandId', e.target.value)} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2">
              <option value="">None</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span>Images (one URL per line)</span>
            <textarea value={form.images.join('\n')} onChange={(e) => handleChange('images', e.target.value.split(/\r?\n/))} rows={3} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" />
          </label>

          <label className="space-y-2 text-sm">
            <span>Specs (key: value per line)</span>
            <textarea value={form.specs} onChange={(e) => handleChange('specs', e.target.value)} rows={4} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2" />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} className="h-4 w-4 rounded border-white/15 bg-white/5" />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isTrending} onChange={(e) => handleChange('isTrending', e.target.checked)} className="h-4 w-4 rounded border-white/15 bg-white/5" />
              Trending
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isBestSeller} onChange={(e) => handleChange('isBestSeller', e.target.checked)} className="h-4 w-4 rounded border-white/15 bg-white/5" />
              Best Seller
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.flashDeal} onChange={(e) => handleChange('flashDeal', e.target.checked)} className="h-4 w-4 rounded border-white/15 bg-white/5" />
              Flash Deal
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 disabled:opacity-50">
              {saving ? 'Saving...' : selectedId ? 'Update Product' : 'Create Product'}
            </button>
            {selectedId && (
              <button type="button" onClick={() => fillForm(null)} className="rounded-xl border border-white/15 px-5 py-2.5 text-sm hover:bg-white/10">Clear</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
