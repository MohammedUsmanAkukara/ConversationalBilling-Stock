import React, { useState } from 'react';
import { X, Users, UserPlus, Phone, Mail, MapPin, Receipt, Search, ShoppingCart, Truck } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function PartiesModal({ isOpen, onClose, onOpenBillingModal }) {
  const { customers, addCustomer, bills } = useInventory();
  const [activeType, setActiveType] = useState('ALL'); // 'ALL' | 'CUSTOMER' | 'SUPPLIER'
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    type: 'CUSTOMER'
  });

  if (!isOpen) return null;

  const filteredParties = customers.filter(c => {
    const matchesType = activeType === 'ALL' || c.type === activeType;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          (c.phone && c.phone.includes(search));
    return matchesType && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCustomer(form);
    setForm({ name: '', phone: '', email: '', address: '', type: 'CUSTOMER' });
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Parties Directory (Customers & Suppliers)
              </h3>
              <p className="text-xs text-slate-500">
                Manage customer directory & supplier contacts for instant billing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Segment & Add Button */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
              <button
                onClick={() => setActiveType('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All ({customers.length})
              </button>
              <button
                onClick={() => setActiveType('CUSTOMER')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeType === 'CUSTOMER' ? 'bg-white text-cyan-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Customers
              </button>
              <button
                onClick={() => setActiveType('SUPPLIER')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeType === 'SUPPLIER' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                Suppliers
              </button>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Party</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search party by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-white border border-slate-300 pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
            />
          </div>

          {/* Inline Add Form */}
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="p-4 rounded-2xl bg-white border-2 border-cyan-500 shadow-sm space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-bold text-cyan-800">Register New Party</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Party / Business Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-bold"
                />
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-900"
                >
                  <option value="CUSTOMER">Retail Customer (Buyer)</option>
                  <option value="SUPPLIER">Supplier / Vendor</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone Number (+91...)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs font-mono"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-xl bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Full Billing Address / City"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-xs"
                >
                  Save Party
                </button>
              </div>
            </form>
          )}
        </div>

        {/* List of Parties */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredParties.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No parties found matching your query. Click "+ Add Party" to register one!
            </div>
          ) : (
            filteredParties.map(party => {
              const partyBillsCount = bills.filter(b => b.partyName.toLowerCase() === party.name.toLowerCase()).length;
              const partyTotalVol = bills
                .filter(b => b.partyName.toLowerCase() === party.name.toLowerCase())
                .reduce((acc, b) => acc + b.totalAmount, 0);

              return (
                <div
                  key={party.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shadow-xs hover:bg-white transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        party.type === 'CUSTOMER' ? 'bg-cyan-100 text-cyan-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {party.type}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">{party.name}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                      {party.phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {party.phone}
                        </span>
                      )}
                      {party.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {party.email}
                        </span>
                      )}
                      {party.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {party.address}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right pr-2 border-r border-slate-200 hidden sm:block">
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Total Bills</span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {partyBillsCount} bills (${partyTotalVol.toFixed(0)})
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenBillingModal && onOpenBillingModal(party.type === 'CUSTOMER' ? 'SALE' : 'PURCHASE');
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                        party.type === 'CUSTOMER' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{party.type === 'CUSTOMER' ? 'Sell Bill' : 'Purchase Bill'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
