export type ProductCategory = {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  sub_categories?: ProductCategory[];
  subcategories?: ProductCategory[];
  children?: ProductCategory[];
};

export type ProductSubCategory = {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  category_id?: number;
  category?: ProductCategory;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: ProductCategory | null;
  sub_category: ProductSubCategory | null;
  created_at: string;
};

export type ProductListResponse = {
  data: Product[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type ProductPayload = {
  category_id: number;
  sub_category_id: number;
  name: string;
  description: string;
  price: number;
};

export type ProductCategoryPayload = {
  name: string;
  description: string;
  icon_url: string;
};

export type ProductSubCategoryPayload = {
  name: string;
  description: string;
  icon_url: string;
};

const base = import.meta.env.VITE_API_BASE_URL as string;

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeCategories(data: unknown): ProductCategory[] {
  if (Array.isArray(data)) return data as ProductCategory[];
  if (data && typeof data === 'object') {
    const record = data as { data?: ProductCategory[]; items?: ProductCategory[]; categories?: ProductCategory[] };
    return record.data || record.items || record.categories || [];
  }
  return [];
}

export async function fetchProducts(): Promise<ProductListResponse> {
  const res = await fetch(`${base}/products`, { headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch products');
  }

  return await res.json() as ProductListResponse;
}

export async function fetchProduct(productId: number): Promise<Product> {
  const res = await fetch(`${base}/products/${productId}`, { headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch product details');
  }

  return await res.json() as Product;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const res = await fetch(`${base}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create product');
  }

  return await res.json() as Product;
}

export async function updateProduct(productId: number, payload: ProductPayload): Promise<Product> {
  const res = await fetch(`${base}/products/${productId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update product');
  }

  return await res.json() as Product;
}

export async function deleteProduct(productId: number): Promise<void> {
  const res = await fetch(`${base}/products/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete product');
  }
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const res = await fetch(`${base}/products/categories`, { headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch categories');
  }

  return normalizeCategories(await res.json());
}

export async function fetchSubCategories(): Promise<ProductSubCategory[]> {
  const res = await fetch(`${base}/products/sub-categories`, { headers: getHeaders() });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch sub categories');
  }

  return normalizeCategories(await res.json()) as ProductSubCategory[];
}

export async function createCategory(payload: ProductCategoryPayload): Promise<ProductCategory> {
  const res = await fetch(`${base}/products/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create category');
  }

  return await res.json() as ProductCategory;
}

export async function createSubCategory(payload: ProductSubCategoryPayload): Promise<ProductSubCategory> {
  const res = await fetch(`${base}/products/sub-categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create sub category');
  }

  return await res.json() as ProductSubCategory;
}

export async function updateCategory(categoryId: number, payload: ProductCategoryPayload): Promise<ProductCategory> {
  const res = await fetch(`${base}/products/categories/${categoryId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update category');
  }

  return await res.json() as ProductCategory;
}

export async function updateSubCategory(subCategoryId: number, payload: ProductSubCategoryPayload): Promise<ProductSubCategory> {
  const res = await fetch(`${base}/products/sub-categories/${subCategoryId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to update sub category');
  }

  return await res.json() as ProductSubCategory;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  const res = await fetch(`${base}/products/categories/${categoryId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete category');
  }
}

export async function deleteSubCategory(subCategoryId: number): Promise<void> {
  const res = await fetch(`${base}/products/sub-categories/${subCategoryId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete sub category');
  }
}

export default {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  fetchSubCategories,
  createCategory,
  createSubCategory,
  updateCategory,
  updateSubCategory,
  deleteCategory,
  deleteSubCategory,
};
