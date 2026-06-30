import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Edit, Loader2, MoreVertical, Plus, Search, Trash2, X } from 'lucide-react';
import MenuItem from '@mui/material/MenuItem';
import AppTextField from '../../components/AppTextField';
import productService from '../../services/productService';
import type {
  Product,
  ProductCategory,
  ProductSubCategory,
  ProductPayload,
} from '../../services/productService';

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category_id: string;
  sub_category_id: string;
};

type ManageItemForm = {
  name: string;
  description: string;
  icon_url: string;
};

const initialForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  sub_category_id: '',
};

const formatPrice = (price: string | number) => {
  const value = Number(price);
  if (!Number.isFinite(value)) return String(price || '-');
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
};

const formatDate = (value: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

const getSubCategories = (allSubCategories: ProductSubCategory[], category?: ProductCategory) => {
  if (!category?.id) return [];
  return allSubCategories.filter((sub) => Number(sub.category_id) === Number(category.id));
};

const toProductForm = (product: Product): ProductForm => ({
  name: product.name || '',
  description: product.description || '',
  price: String(product.price ?? ''),
  category_id: product.category?.id ? String(product.category.id) : '',
  sub_category_id: product.sub_category?.id ? String(product.sub_category.id) : '',
});

const toPayload = (form: ProductForm): ProductPayload => ({
  category_id: Number(form.category_id),
  sub_category_id: Number(form.sub_category_id),
  name: form.name.trim(),
  description: form.description.trim(),
  price: Number(form.price),
});

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [subCategories, setSubCategories] = useState<ProductSubCategory[]>([]);
  const [formData, setFormData] = useState<ProductForm>(initialForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'subcategories'>('products');
  const [categoryForm, setCategoryForm] = useState<ManageItemForm>({ name: '', description: '', icon_url: '' });
  const [subCategoryForm, setSubCategoryForm] = useState<ManageItemForm>({ name: '', description: '', icon_url: '' });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingSubCategoryId, setEditingSubCategoryId] = useState<number | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingSubCategory, setSavingSubCategory] = useState(false);

  const selectedCategory = categories.find((category) => String(category.id) === formData.category_id);
const formSubCategories = getSubCategories(subCategories, selectedCategory);

  const loadInventory = useCallback(async () => {
    setError('');
    try {
      const [productResponse, categoryResponse, subCategoryResponse] = await Promise.all([
        productService.fetchProducts(),
        productService.fetchCategories(),
        productService.fetchSubCategories(),
      ]); 
      setProducts(productResponse.data || []);
      setCategories(categoryResponse);
      setSubCategories(subCategoryResponse || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);
  console.log("subCategories",subCategories)

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return products;

    return products.filter((product) =>
      [
        product.name,
        product.description,
        product.price,
        product.category?.name,
        product.sub_category?.name,
        product.id,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [products, searchTerm]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return categories;
    return categories.filter((category) =>
      [category.name, category.description, category.icon_url]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [categories, searchTerm]);

  const filteredSubCategories = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return subCategories;
    return subCategories.filter((subCategory) =>
      [subCategory.name, subCategory.description, subCategory.icon_url]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [subCategories, searchTerm]);

  const updateFormField = (field: keyof ProductForm, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
      ...(field === 'category_id' ? { sub_category_id: '' } : {}),
    }));
  };

  const openCreateForm = () => {
    setEditingProductId(null);
    setFormData(initialForm);
    setActionMessage('');
    setError('');
    setIsFormOpen(true);
  };

  const openEditForm = async (productId: number) => {
    setEditingProductId(productId);
    setFormData(initialForm);
    setActionMessage('');
    setError('');
    setIsFormOpen(true);
    setSaving(true);

    try {
      const product = await productService.fetchProduct(productId);
      setFormData(toProductForm(product));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product details');
      setIsFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProductId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setActionMessage('');

    try {
      const payload = toPayload(formData);
      if (editingProductId) {
        await productService.updateProduct(editingProductId, payload);
        setActionMessage('Product updated successfully');
      } else {
        await productService.createProduct(payload);
        setActionMessage('Product created successfully');
      }
      closeForm();
      await loadInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const shouldDelete = window.confirm(`Delete "${product.name}"?`);
    if (!shouldDelete) return;

    setError('');
    setActionMessage('');
    try {
      await productService.deleteProduct(product.id);
      setActionMessage('Product deleted successfully');
      await loadInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const openCategoryForm = (category?: ProductCategory) => {
    setEditingCategoryId(category?.id ?? null);
    setCategoryForm({
      name: category?.name ?? '',
      description: category?.description ?? '',
      icon_url: category?.icon_url ?? '',
    });
    setError('');
    setActionMessage('');
    setIsCategoryFormOpen(true);
  };

  const closeCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryForm({ name: '', description: '', icon_url: '' });
    setIsCategoryFormOpen(false);
  };

  const openSubCategoryForm = (subCategory?: ProductSubCategory) => {
    setEditingSubCategoryId(subCategory?.id ?? null);
    setSubCategoryForm({
      name: subCategory?.name ?? '',
      description: subCategory?.description ?? '',
      icon_url: subCategory?.icon_url ?? '',
    });
    setError('');
    setActionMessage('');
    setIsSubCategoryFormOpen(true);
  };

  const closeSubCategoryForm = () => {
    setEditingSubCategoryId(null);
    setSubCategoryForm({ name: '', description: '', icon_url: '' });
    setIsSubCategoryFormOpen(false);
  };

  const handleCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingCategory(true);
    setError('');
    setActionMessage('');

    try {
      if (editingCategoryId) {
        await productService.updateCategory(editingCategoryId, categoryForm);
        setActionMessage('Category updated successfully');
      } else {
        await productService.createCategory(categoryForm);
        setActionMessage('Category created successfully');
      }
      closeCategoryForm();
      setCategories(await productService.fetchCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleSubCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingSubCategory(true);
    setError('');
    setActionMessage('');

    try {
      if (editingSubCategoryId) {
        await productService.updateSubCategory(editingSubCategoryId, subCategoryForm);
        setActionMessage('Sub category updated successfully');
      } else {
        await productService.createSubCategory(subCategoryForm);
        setActionMessage('Sub category created successfully');
      }
      closeSubCategoryForm();
      setSubCategories(await productService.fetchSubCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sub category');
    } finally {
      setSavingSubCategory(false);
    }
  };

  const handleDeleteCategory = async (category: ProductCategory) => {
    const shouldDelete = window.confirm(`Delete category "${category.name}"?`);
    if (!shouldDelete) return;

    setError('');
    setActionMessage('');
    try {
      await productService.deleteCategory(category.id);
      setActionMessage('Category deleted successfully');
      setCategories(await productService.fetchCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleDeleteSubCategory = async (subCategory: ProductSubCategory) => {
    const shouldDelete = window.confirm(`Delete sub category "${subCategory.name}"?`);
    if (!shouldDelete) return;

    setError('');
    setActionMessage('');
    try {
      await productService.deleteSubCategory(subCategory.id);
      setActionMessage('Sub category deleted successfully');
      setSubCategories(await productService.fetchSubCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sub category');
    }
  };

  const openAddItem = () => {
    if (activeTab === 'products') {
      openCreateForm();
    } else if (activeTab === 'categories') {
      openCategoryForm();
    } else {
      openSubCategoryForm();
    }
  };

  return (
    <div className="space-y-6 text-left min-w-0">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500">Track and manage products, categories, and sub categories.</p>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            {actionMessage && <div className="mt-2 text-sm text-green-600">{actionMessage}</div>}
          </div>
        </div>

        <div className="flex flex-col gap-3">
<div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3">
            <div role="tablist" className="flex flex-wrap items-end gap-1">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'products'}
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'products'
                ? 'border-b-2 border-[var(--common-btn-bg)] text-[var(--common-btn-bg)]'
                : 'border-b-2 border-transparent text-gray-600 hover:text-[var(--common-btn-bg)]'
            }`}
          >
            Products
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'categories'}
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'categories'
                ? 'border-b-2 border-[var(--common-btn-bg)] text-[var(--common-btn-bg)]'
                : 'border-b-2 border-transparent text-gray-600 hover:text-[var(--common-btn-bg)]'
            }`}
          >
            Categories
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'subcategories'}
            onClick={() => setActiveTab('subcategories')}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'subcategories'
                ? 'border-b-2 border-[var(--common-btn-bg)] text-[var(--common-btn-bg)]'
                : 'border-b-2 border-transparent text-gray-600 hover:text-[var(--common-btn-bg)]'
            }`}
          >
            Sub Categories
          </button>
            </div>
            <button
              type="button"
              onClick={openAddItem}
              className="flex items-center justify-center gap-2 whitespace-nowrap bg-common-btn-bg hover:bg-common-btn-hover text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md"
            >
              <Plus size={18} />
              {activeTab === 'categories'
                ? 'Add Category'
                : activeTab === 'subcategories'
                ? 'Add Sub Category'
                : 'Add New Product'}
            </button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-xl border border-gray-100 p-4 shadow-xl space-y-5 sm:max-h-[90vh] sm:rounded-xl sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="product-form-title" className="text-lg font-bold text-gray-900">
                  {editingProductId ? 'Edit A Product' : 'Create Product'}
                </h2>
                <p className="text-sm text-gray-500">Enter product name, category, subcategory, description, and price.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                aria-label="Close product form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppTextField
                label="Product Name"
                required
                type="text"
                value={formData.name}
                onChange={(event) => updateFormField('name', event.target.value)}
              />

              <AppTextField
                label="Price"
                required
                type="number"
                value={formData.price}
                onChange={(event) => updateFormField('price', event.target.value)}
                inputProps={{ min: 0, step: '0.01' }}
              />

              <AppTextField
                select
                required
                label="Category"
                value={formData.category_id}
                onChange={(event) => updateFormField('category_id', event.target.value)}
              >
                <MenuItem value="">Select category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </MenuItem>
                  ))}
              </AppTextField>

              <AppTextField
                select
                required
                label="Sub Category"
                value={formData.sub_category_id}
                onChange={(event) => updateFormField('sub_category_id', event.target.value)}
              >
                <MenuItem value="">Select sub category</MenuItem>
                  {subCategories.map((subCategory) => (
                    <MenuItem key={subCategory.id} value={String(subCategory.id)}>
                      {subCategory.name}
                    </MenuItem>
                  ))}
              </AppTextField>

              <div className="md:col-span-2">
                <AppTextField
                  label="Description"
                  required
                  multiline
                  minRows={4}
                  value={formData.description}
                  onChange={(event) => updateFormField('description', event.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white shadow-sm bg-[var(--common-btn-bg)] hover:bg-[var(--common-btn-hover)] disabled:opacity-70"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editingProductId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isCategoryFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={handleCategorySubmit}
            className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-xl border border-gray-100 p-4 shadow-xl space-y-5 sm:max-h-[90vh] sm:rounded-xl sm:p-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingCategoryId ? 'Edit Category' : 'Create Category'}
                </h2>
                <p className="text-sm text-gray-500">Provide a name, description and icon URL for the category.</p>
              </div>
              <button type="button" onClick={closeCategoryForm} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AppTextField
                label="Name"
                required
                value={categoryForm.name}
                onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <AppTextField
                label="Description"
                multiline
                minRows={3}
                value={categoryForm.description}
                onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))}
              />
              <AppTextField
                label="Icon URL"
                value={categoryForm.icon_url}
                onChange={(event) => setCategoryForm((prev) => ({ ...prev, icon_url: event.target.value }))}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={closeCategoryForm} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={savingCategory} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-[var(--common-btn-bg)] hover:bg-[var(--common-btn-hover)] disabled:opacity-70">
                {savingCategory && <Loader2 size={16} className="animate-spin" />}
                {editingCategoryId ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isSubCategoryFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={handleSubCategorySubmit}
            className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-xl border border-gray-100 p-4 shadow-xl space-y-5 sm:max-h-[90vh] sm:rounded-xl sm:p-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingSubCategoryId ? 'Edit Sub Category' : 'Create Sub Category'}
                </h2>
                <p className="text-sm text-gray-500">Provide a name, description and icon URL for the sub category.</p>
              </div>
              <button type="button" onClick={closeSubCategoryForm} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <AppTextField
                label="Name"
                required
                value={subCategoryForm.name}
                onChange={(event) => setSubCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <AppTextField
                label="Description"
                multiline
                minRows={3}
                value={subCategoryForm.description}
                onChange={(event) => setSubCategoryForm((prev) => ({ ...prev, description: event.target.value }))}
              />
              <AppTextField
                label="Icon URL"
                value={subCategoryForm.icon_url}
                onChange={(event) => setSubCategoryForm((prev) => ({ ...prev, icon_url: event.target.value }))}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button type="button" onClick={closeSubCategoryForm} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={savingSubCategory} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-[var(--common-btn-bg)] hover:bg-[var(--common-btn-hover)] disabled:opacity-70">
                {savingSubCategory && <Loader2 size={16} className="animate-spin" />}
                {editingSubCategoryId ? 'Update Sub Category' : 'Create Sub Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <AppTextField
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={
              activeTab === 'products'
                ? 'Search products...'
                : activeTab === 'categories'
                ? 'Search categories...'
                : 'Search sub categories...'
            }
            sx={{ '& .MuiInputBase-input': { paddingLeft: '2.25rem' } }}
          />
        </div>

        <div className="flex items-center justify-end text-sm text-gray-500">
          {activeTab === 'products' && `${filteredProducts.length} of ${products.length} products`}
          {activeTab === 'categories' && `${filteredCategories.length} of ${categories.length} categories`}
          {activeTab === 'subcategories' && `${filteredSubCategories.length} of ${subCategories.length} sub categories`}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'products' ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Sub Category</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Created</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Description</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={7}>
                        Loading products...
                      </td>
                    </tr>
                  )}

                  {!loading && filteredProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900 whitespace-nowrap">{item.name}</p>
                          <p className="text-xs text-gray-500">#{item.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.category?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.sub_category?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{formatPrice(item.price)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 min-w-72">{item.description || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditForm(item.id)}
                            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Edit size={17} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(item)}
                            className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 size={17} />
                          </button>
                          <MoreVertical size={18} className="text-gray-300" />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!loading && filteredProducts.length === 0 && (
                    <tr>
                      <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={7}>
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span key={category.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === 'categories' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Icon URL</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={4}>
                      Loading categories...
                    </td>
                  </tr>
                )}
                {!loading && filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-600">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 break-words">{category.icon_url || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openCategoryForm(category)}
                          className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700"
                          aria-label={`Edit ${category.name}`}
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600"
                          aria-label={`Delete ${category.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredCategories.length === 0 && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={4}>
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Sub Category</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Icon URL</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={4}>
                      Loading sub categories...
                    </td>
                  </tr>
                )}
                {!loading && filteredSubCategories.map((subCategory) => (
                  <tr key={subCategory.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-600">{subCategory.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{subCategory.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 break-words">{subCategory.icon_url || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openSubCategoryForm(subCategory)}
                          className="p-2 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700"
                          aria-label={`Edit ${subCategory.name}`}
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubCategory(subCategory)}
                          className="p-2 hover:bg-red-50 rounded-full text-gray-500 hover:text-red-600"
                          aria-label={`Delete ${subCategory.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredSubCategories.length === 0 && (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={4}>
                      No sub categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
