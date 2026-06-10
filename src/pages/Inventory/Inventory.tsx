import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Download, Filter, ImagePlus, MoreVertical, Plus, Search, X } from 'lucide-react';

type ProductForm = {
  name: string;
  brand: string;
  category: string;
  dealerPrice: string;
  description: string;
  availableUnits: string;
  image: string;
};

type Product = ProductForm & {
  id: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const initialForm: ProductForm = {
  name: '',
  brand: '',
  category: '',
  dealerPrice: '',
  description: '',
  availableUnits: '',
  image: '',
};

const initialInventory: Product[] = [
  {
    id: 'INV-001',
    name: 'Organic NPK Fertilizer',
    brand: 'AgroPure',
    category: 'Fertilizers',
    dealerPrice: '1200',
    description: 'Balanced nutrient mix for vegetable and grain crops.',
    availableUnits: '120',
    image: '',
    status: 'In Stock',
  },
  {
    id: 'INV-002',
    name: 'Hybrid Tomato Seeds',
    brand: 'GrowMax',
    category: 'Seeds',
    dealerPrice: '450',
    description: 'High germination seeds suitable for greenhouse and open farms.',
    availableUnits: '15',
    image: '',
    status: 'Low Stock',
  },
  {
    id: 'INV-003',
    name: 'Neem Oil Pesticide',
    brand: 'NeemGuard',
    category: 'Pesticides',
    dealerPrice: '800',
    description: 'Organic pest-control oil for fruits, vegetables, and nursery plants.',
    availableUnits: '0',
    image: '',
    status: 'Out of Stock',
  },
  {
    id: 'INV-004',
    name: 'Potting Mix - 5kg',
    brand: 'SoilCare',
    category: 'Soil',
    dealerPrice: '350',
    description: 'Ready-to-use potting media with cocopeat and compost.',
    availableUnits: '85',
    image: '',
    status: 'In Stock',
  },
  {
    id: 'INV-005',
    name: 'Drip Irrigation Kit',
    brand: 'AquaFarm',
    category: 'Tools',
    dealerPrice: '2500',
    description: 'Starter irrigation kit for small plots and kitchen gardens.',
    availableUnits: '10',
    image: '',
    status: 'Low Stock',
  },
];

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(initialInventory);
  const [formData, setFormData] = useState<ProductForm>(initialForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.brand,
        product.category,
        product.dealerPrice,
        product.description,
        product.availableUnits,
        product.status,
        product.id,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [products, searchTerm]);

  const getProductStatus = (availableUnits: string): Product['status'] => {
    const units = Number(availableUnits);

    if (units <= 0) {
      return 'Out of Stock';
    }

    if (units <= 20) {
      return 'Low Stock';
    }

    return 'In Stock';
  };

  const getStatusStyle = (status: Product['status']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-700';
      case 'Low Stock':
        return 'bg-orange-100 text-orange-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const updateFormField = (field: keyof ProductForm, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateFormField('image', String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextProduct: Product = {
      ...formData,
      id: `INV-${String(products.length + 1).padStart(3, '0')}`,
      status: getProductStatus(formData.availableUnits),
    };

    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
    setFormData(initialForm);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 text-left min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Track and manage your agricultural supplies and stock levels.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 bg-common-btn-bg hover:bg-common-btn-hover text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-t-xl border border-gray-100 p-4 shadow-xl space-y-5 sm:max-h-[90vh] sm:rounded-xl sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-title"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="add-product-title" className="text-lg font-bold text-gray-900">
                  Add Product Details
                </h2>
                <p className="text-sm text-gray-500">Add product information, stock, pricing, and an image preview.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                aria-label="Close add product form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Product Name</span>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(event) => updateFormField('name', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Brand</span>
                  <input
                    required
                    type="text"
                    value={formData.brand}
                    onChange={(event) => updateFormField('brand', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Category</span>
                  <input
                    required
                    type="text"
                    value={formData.category}
                    onChange={(event) => updateFormField('category', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Dealer Price</span>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.dealerPrice}
                    onChange={(event) => updateFormField('dealerPrice', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-semibold text-gray-700">Available Units</span>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.availableUnits}
                    onChange={(event) => updateFormField('availableUnits', event.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </label>

                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold text-gray-700">Description About The Product</span>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(event) => updateFormField('description', event.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-semibold text-gray-700">Product Image</span>
                <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:bg-gray-100">
                  {formData.image ? (
                    <img src={formData.image} alt="Product preview" className="h-36 w-full rounded-lg object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="text-gray-400" size={34} />
                      <span className="text-sm font-semibold text-gray-700">Upload Image</span>
                      <span className="text-xs text-gray-500">PNG or JPG product photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(initialForm);
                  setIsFormOpen(false);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold text-white shadow-sm bg-[var(--common-btn-bg)] hover:bg-[var(--common-btn-hover)]"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:flex md:w-auto md:items-center">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
            <Filter size={18} /> Filter
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Brand</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Dealer Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Available Units</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 whitespace-nowrap">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">Rs. {item.dealerPrice}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.availableUnits} Units</td>
                  <td className="px-6 py-4 text-sm text-gray-600 min-w-72">{item.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600" aria-label={`More actions for ${item.name}`}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={8}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} items
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm hover:bg-gray-50 disabled:opacity-50">
              Prev
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
