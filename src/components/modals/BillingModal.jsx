import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Receipt, ShoppingCart, Truck, Search, UserPlus, Package } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function BillingModal({ isOpen, onClose, initialType = 'SALE', initialItem = null }) {
  const { items, customers, addCustomer, createBill, showStockAlert } = useInventory();

  const [billType, setBillType] = useState(initialType); // 'SALE' | 'PURCHASE'
  const [partyName, setPartyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);

  // Line items
  const [lineItems, setLineItems] = useState([]);

  // Searchable Item Picker state
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  // Add New Customer Popup form state
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (isOpen) {
      setBillType(initialType || 'SALE');
      setPartyName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setDiscount(0);
      setItemSearchQuery('');
      setIsAddingCustomer(false);

      if (initialItem) {
        setLineItems([{
          itemId: initialItem.id,
          name: initialItem.name,
          sku: initialItem.sku,
          qty: 1,
          price: initialItem.price || 0,
          unit: initialItem.unit || 'pcs'
        }]);
      } else if (items.length > 0) {
        setLineItems([{
          itemId: items[0].id,
          name: items[0].name,
          sku: items[0].sku,
          qty: 1,
          price: items[0].price || 0,
          unit: items[0].unit || 'pcs'
        }]);
      }
    }
  }, [isOpen, initialType, initialItem, items]);

  if (!isOpen) return null;

  // Filter items based on search query in BillingModal
  const filteredSearchItems = items.filter(item => 
    item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(itemSearchQuery.toLowerCase())
  );

  const handleSelectCustomer = (cust) => {
    setPartyName(cust.name);
    setPhone(cust.phone || '');
    setEmail(cust.email || '');
    setAddress(cust.address || '');
  };

  const handleSaveNewCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerForm.name.trim()) return;

    const savedCust = addCustomer({
      ...newCustomerForm,
      type: billType === 'SALE' ? 'CUSTOMER' : 'SUPPLIER'
    });

    handleSelectCustomer(savedCust);
    setNewCustomerForm({ name: '', phone: '', email: '', address: '' });
    setIsAddingCustomer(false);
  };

  const handleAddItemToBill = (item) => {
    // Check if item already exists in lineItems
    const existingIdx = lineItems.findIndex(row => row.itemId === item.id);
    if (existingIdx !== -1) {
      const updated = [...lineItems];
      updated[existingIdx].qty = Number(updated[existingIdx].qty) + 1;
      setLineItems(updated);
    } else {
      setLineItems([...lineItems, {
        itemId: item.id,
        name: item.name,
        sku: item.sku,
        qty: 1,
        price: item.price || 0,
        unit: item.unit || 'pcs'
      }]);
    }
    setItemSearchQuery('');
  };

  const handleRemoveRow = (idx) => {
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  const handleRowChange = (idx, field, value) => {
    const updated = [...lineItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setLineItems(updated);
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0);
  const taxAmount = (subtotal * Number(taxRate)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - Number(discount || 0));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (lineItems.length === 0) {
      showStockAlert('Error', 'Please add at least one item to generate a bill.');
      return;
    }

    if (!partyName.trim()) {
      showStockAlert('Error', 'Please enter or select a Customer / Supplier name.');
      return;
    }

    // Validate overselling on SALE bills
    if (billType === 'SALE') {
      for (const row of lineItems) {
        const itemInStock = items.find(i => i.id === row.itemId);
        if (itemInStock && Number(row.qty) > itemInStock.quantity) {
          showStockAlert(
            '⚠️ Stock Validation Warning',
            `Cannot sell ${row.qty} ${itemInStock.unit} of "${itemInStock.name}". Only ${itemInStock.quantity} ${itemInStock.unit} available in stock!`
          );
          return;
        }
      }
    }

    createBill({
      type: billType,
      partyName,
      phone,
      email,
      address,
      itemsList: lineItems.map(row => ({
        itemId: row.itemId,
        name: row.name,
        sku: row.sku,
        qty: Number(row.qty || 1),
        price: Number(row.price || 0),
        subtotal: Number(row.qty || 1) * Number(row.price || 0)
      })),
      subtotal,
      taxRate,
      taxAmount,
      discount,
      totalAmount
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              billType === 'SALE' 
                ? 'bg-cyan-100 border border-cyan-300 text-cyan-800'
                : 'bg-indigo-100 border border-indigo-300 text-indigo-800'
            }`}>
              {billType === 'SALE' ? <ShoppingCart className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {billType === 'SALE' ? 'Create Sales Invoice (Sell & Stock Out)' : 'Record Stock Purchase Bill (Buy & Restock)'}
              </h3>
              <p className="text-xs text-slate-500">
                {billType === 'SALE' ? 'Automatically deducts sold items from stock' : 'Automatically adds purchased items to stock'}
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

        {/* Segment Switch */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setBillType('SALE')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              billType === 'SALE'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>SALES INVOICE (Sell / Stock Out)</span>
          </button>
          <button
            type="button"
            onClick={() => setBillType('PURCHASE')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              billType === 'PURCHASE'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>PURCHASE BILL (Buy / Stock In)</span>
          </button>
        </div>

        {/* Main Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* 1. CUSTOMER / SUPPLIER SELECTION & NEW ADDITION */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {billType === 'SALE' ? 'Customer / Party Details' : 'Supplier / Vendor Details'}
              </span>

              <button
                type="button"
                onClick={() => setIsAddingCustomer(!isAddingCustomer)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New {billType === 'SALE' ? 'Customer' : 'Supplier'}</span>
              </button>
            </div>

            {/* Inline Add New Customer Form */}
            {isAddingCustomer && (
              <div className="p-3.5 rounded-xl bg-white border-2 border-cyan-500 shadow-sm space-y-3 animate-in fade-in duration-200">
                <div className="text-xs font-bold text-cyan-800">New Directory Party Registration</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Full Name / Company Name *"
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                    className="rounded-lg bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number (+91...)"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    className="rounded-lg bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs font-mono"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    className="rounded-lg bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Billing Address / City"
                    value={newCustomerForm.address}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                    className="rounded-lg bg-slate-50 border border-slate-300 px-3 py-1.5 text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomer(false)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewCustomer}
                    className="px-4 py-1 rounded-lg bg-cyan-600 text-white text-xs font-bold"
                  >
                    Save & Select
                  </button>
                </div>
              </div>
            )}

            {/* Select from saved customers or enter custom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Saved Party / Enter Name *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    placeholder={billType === 'SALE' ? 'e.g. Aarav Sharma' : 'e.g. TechCorp Supplier'}
                    className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Quick Select Saved Party</label>
                <select
                  onChange={(e) => {
                    const found = customers.find(c => c.id === e.target.value);
                    if (found) handleSelectCustomer(found);
                  }}
                  defaultValue=""
                  className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="" disabled>-- Select Saved Customer / Supplier --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.type}] {c.name} ({c.phone || c.address || 'Saved'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. SEARCHABLE ITEM PICKER ("item dropdown ko search able banao") */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-600" />
                <span>Search & Add Catalog Items to Bill</span>
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Click any matching item below to add
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items by Name or SKU (e.g. 'Sony', 'AirPods', 'SKU-MBP')..."
                value={itemSearchQuery}
                onChange={(e) => setItemSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-white border border-slate-300 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:border-cyan-600"
              />
            </div>

            {/* Search Results / Quick Suggestions Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {filteredSearchItems.slice(0, 8).map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddItemToBill(item)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 text-left transition-all shadow-2xs group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-slate-900 truncate group-hover:text-cyan-900">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.sku} • Stock: <strong className="text-slate-800">{item.quantity} {item.unit}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-mono font-extrabold text-cyan-700">${item.price}</span>
                    <span className="p-1 rounded-lg bg-cyan-100 text-cyan-800 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. SELECTED LINE ITEMS TABLE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Selected Bill Items ({lineItems.length})
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {lineItems.map((row, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex-1 min-w-[180px]">
                    <div className="text-xs font-extrabold text-slate-900">{row.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{row.sku}</div>
                  </div>

                  <div className="w-20">
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-semibold">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => handleRowChange(idx, 'qty', e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-2 py-1 text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <div className="w-24">
                    <label className="block text-[10px] text-slate-500 mb-0.5 font-semibold">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.price}
                      onChange={(e) => handleRowChange(idx, 'price', e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-2 py-1 text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <div className="w-24 text-right">
                    <span className="block text-[10px] text-slate-500 font-semibold">Subtotal</span>
                    <span className="text-xs font-extrabold font-mono text-slate-900">
                      ${(Number(row.qty) * Number(row.price)).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. SUMMARY TAX & GRAND TOTAL */}
          <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Subtotal Amount:</span>
              <span className="font-mono font-bold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">GST / Tax Rate:</span>
              <div className="flex items-center gap-1">
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="rounded-lg bg-white border border-slate-300 px-2 py-0.5 text-xs font-bold"
                >
                  <option value={0}>0% Tax Free</option>
                  <option value={5}>5% GST</option>
                  <option value={12}>12% GST</option>
                  <option value={18}>18% GST</option>
                </select>
                <span className="font-mono font-bold text-slate-900 w-16 text-right">+${taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Discount Amount ($):</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-20 rounded-lg bg-white border border-slate-300 px-2 py-0.5 text-xs font-mono font-bold text-right"
              />
            </div>

            <div className="pt-2 border-t border-slate-300 flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900 uppercase">Grand Total Bill:</span>
              <span className="text-lg font-extrabold text-cyan-800 font-mono">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white shadow-md transition-all ${
                billType === 'SALE'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>{billType === 'SALE' ? 'Confirm & Generate Full Page Bill' : 'Confirm Purchase & Restock'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
