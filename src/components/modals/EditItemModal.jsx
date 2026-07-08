import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function EditItemModal({ isOpen, onClose, item }) {
  const { editItemDetails, categories } = useInventory();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    minStock: 5,
    price: 0,
    unit: 'pcs',
    location: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        sku: item.sku || '',
        category: item.category || 'Electronics',
        quantity: item.quantity ?? 0,
        minStock: item.minStock ?? 5,
        price: item.price ?? 0,
        unit: item.unit || 'pcs',
        location: item.location || ''
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    editItemDetails(item.id, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-100 border border-cyan-200 text-cyan-700">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Edit SKU Information</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable on small phones */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Title / Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                SKU Code
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-cyan-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Qty
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Min Alert Level
              </label>
              <input
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value, 10) || 0 })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unit Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unit Type
              </label>
              <input
                type="text"
                placeholder="pcs, box, kg..."
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Storage Location
              </label>
              <input
                type="text"
                placeholder="Warehouse A - Bay 1"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
