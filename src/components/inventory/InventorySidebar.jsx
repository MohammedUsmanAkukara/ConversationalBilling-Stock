import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Edit3, 
  Trash2, 
  History, 
  Package,
  Receipt,
  ShoppingCart
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function InventorySidebar({ onOpenEditModal, onOpenBillingModal }) {
  const {
    items,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    updateStock,
    deleteItem,
    transactions,
    bills
  } = useInventory();

  const [activeTab, setActiveTab] = useState('CATALOG'); // 'CATALOG' | 'BILLS' | 'ACTIVITY'

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'ALL' ? true :
      filterStatus === 'LOW' ? item.quantity <= item.minStock && item.quantity > 0 :
      filterStatus === 'OUT' ? item.quantity <= 0 : true;

    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-slate-200">
      
      {/* Top Switch Tabs */}
      <div className="flex border-b border-slate-200 p-2 gap-1 bg-slate-100">
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'CATALOG'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Catalog ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BILLS')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'BILLS'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Bills ({bills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ACTIVITY')}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'ACTIVITY'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {activeTab === 'CATALOG' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Search & Filters */}
          <div className="p-3 border-b border-slate-200 space-y-2.5 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search SKU or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status Segmented Buttons */}
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  filterStatus === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilterStatus('LOW')}
                className={`py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  filterStatus === 'LOW' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'text-slate-600 hover:text-amber-700'
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setFilterStatus('OUT')}
                className={`py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  filterStatus === 'OUT' ? 'bg-red-100 text-red-800 border border-red-300' : 'text-slate-600 hover:text-red-700'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>

          {/* Item Cards Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No inventory items match your current filter selection.
              </div>
            ) : (
              filteredItems.map(item => {
                const isLow = item.quantity <= item.minStock;
                const isOut = item.quantity <= 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-50 border border-slate-200 p-3 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 text-cyan-800">
                          {item.sku}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span className="font-mono font-bold">${item.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenBillingModal && onOpenBillingModal('SALE', item)}
                          title="Generate POS Invoice for this Item"
                          className="p-1.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-bold text-xs transition-colors"
                        >
                          Bill
                        </button>
                        <button
                          onClick={() => onOpenEditModal(item)}
                          title="Edit SKU Details"
                          className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          title="Delete SKU"
                          className="p-1.5 rounded-xl hover:bg-red-100 text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stock Row */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className={`text-[11px] font-extrabold font-mono px-2 py-0.5 rounded-full ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.quantity} {item.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateStock(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 0}
                          title="Decrease Quantity (-1)"
                          className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-red-100 disabled:opacity-30 text-slate-800 hover:text-red-700 flex items-center justify-center transition-colors font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => updateStock(item.id, item.quantity + 1)}
                          title="Increase Quantity (+1)"
                          className="w-6 h-6 rounded-lg bg-slate-200 hover:bg-emerald-100 text-slate-800 hover:text-emerald-700 flex items-center justify-center transition-colors font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {activeTab === 'BILLS' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Recent Bills & Invoices
            </h4>
            <button
              onClick={() => onOpenBillingModal && onOpenBillingModal('SALE')}
              className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white text-xs font-bold"
            >
              + New Bill
            </button>
          </div>
          {bills.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-8">
              No sales or purchase bills generated yet.
            </div>
          ) : (
            bills.map(b => (
              <div key={b.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                    b.type === 'SALE' ? 'bg-cyan-100 text-cyan-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {b.type === 'SALE' ? 'SALE INVOICE' : 'PURCHASE ENTRY'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{b.id}</span>
                </div>
                <p className="font-bold text-slate-900">{b.partyName}</p>
                <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200">
                  <span>{b.itemsList.length} item(s)</span>
                  <span className="font-mono font-extrabold text-cyan-800">${b.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'ACTIVITY' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Recent Inventory Movements
          </h4>
          {transactions.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-8">
              No inventory transactions recorded yet.
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    tx.type === 'CREATE' ? 'bg-cyan-100 text-cyan-800' :
                    tx.type === 'SALE_BILL' ? 'bg-emerald-100 text-emerald-800' :
                    tx.type === 'PURCHASE_BILL' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {tx.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{tx.time}</span>
                </div>
                <p className="text-slate-900 font-semibold text-xs sm:text-sm">{tx.title}</p>
                {tx.sku && <p className="text-[10px] font-mono text-slate-500">{tx.sku}</p>}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
