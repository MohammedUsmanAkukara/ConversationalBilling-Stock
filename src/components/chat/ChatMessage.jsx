import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  User, 
  Plus, 
  Minus, 
  CheckCircle2, 
  PackagePlus, 
  Edit3,
  ArrowRight,
  ShieldAlert,
  Receipt,
  Printer,
  ShoppingCart,
  Truck,
  FileText,
  Users,
  BarChart3,
  TrendingUp,
  DollarSign,
  Phone,
  UserPlus
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function ChatMessage({ message, onOpenEditModal, onOpenBillingModal, onOpenPartiesModal, onOpenReportsModal }) {
  const { 
    items, 
    updateStock, 
    addItem, 
    totalValuation, 
    totalUnits, 
    lowStockCount, 
    outOfStockCount,
    sendChatMessage,
    showStockAlert,
    bills,
    createBill,
    setActiveInvoiceBill,
    customers,
    addCustomer
  } = useInventory();

  // Inline form state for SKU
  const [inlineForm, setInlineForm] = useState({
    name: message.widget?.initialData?.name || '',
    sku: '',
    category: 'Electronics',
    quantity: message.widget?.initialData?.quantity || 10,
    minStock: 5,
    price: 49,
    unit: 'pcs'
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Unregistered party instant bill state
  const isPhonePattern = (str = '') => /^[0-9+\s-]{7,15}$/.test(str);

  const [newPartyForm, setNewPartyForm] = useState({
    name: isPhonePattern(message.widget?.partyInput) ? '' : (message.widget?.partyInput || ''),
    phone: isPhonePattern(message.widget?.partyInput) ? message.widget?.partyInput : '',
    address: 'City Billing Address',
    qty: message.widget?.qty || 1
  });
  const [unregisteredBillCreated, setUnregisteredBillCreated] = useState(false);

  // Instant registered bill qty state
  const [instantQty, setInstantQty] = useState(message.widget?.qty || 1);
  const [instantBillDone, setInstantBillDone] = useState(false);
  const [reportTf, setReportTf] = useState('ALL');

  const handleInlineFormSubmit = (e) => {
    e.preventDefault();
    if (!inlineForm.name) return;
    addItem(inlineForm);
    setFormSubmitted(true);
  };

  const handleConfirmInstantBill = (billType, party, item) => {
    if (billType === 'SALE' && instantQty > item.quantity) {
      showStockAlert('Error', `Cannot sell ${instantQty} ${item.unit}. Only ${item.quantity} available!`);
      return;
    }

    const subtotal = Number(instantQty) * Number(item.price);
    const taxRate = 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    const newInvoice = createBill({
      type: billType,
      partyName: party.name,
      phone: party.phone || '',
      email: party.email || '',
      address: party.address || '',
      itemsList: [{
        itemId: item.id,
        name: item.name,
        sku: item.sku,
        qty: Number(instantQty),
        price: Number(item.price),
        subtotal
      }],
      subtotal,
      taxRate,
      taxAmount,
      discount: 0,
      totalAmount
    });

    setInstantBillDone(true);
    setActiveInvoiceBill(newInvoice);
  };

  const handleRegisterPartyAndBill = (e, billType, item) => {
    e.preventDefault();
    if (!newPartyForm.name.trim()) {
      showStockAlert('Error', 'Please enter a customer/party name to register!');
      return;
    }

    const qty = Number(newPartyForm.qty || 1);
    if (billType === 'SALE' && qty > item.quantity) {
      showStockAlert('Error', `Cannot sell ${qty} ${item.unit}. Only ${item.quantity} available!`);
      return;
    }

    // 1. Save new party
    const savedCust = addCustomer({
      name: newPartyForm.name.trim(),
      phone: newPartyForm.phone.trim(),
      address: newPartyForm.address.trim(),
      type: billType === 'SALE' ? 'CUSTOMER' : 'SUPPLIER'
    });

    // 2. Generate Invoice immediately
    const subtotal = qty * Number(item.price);
    const taxRate = 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    const newInvoice = createBill({
      type: billType,
      partyName: savedCust.name,
      phone: savedCust.phone || '',
      email: savedCust.email || '',
      address: savedCust.address || '',
      itemsList: [{
        itemId: item.id,
        name: item.name,
        sku: item.sku,
        qty,
        price: Number(item.price),
        subtotal
      }],
      subtotal,
      taxRate,
      taxAmount,
      discount: 0,
      totalAmount
    });

    setUnregisteredBillCreated(true);
    setActiveInvoiceBill(newInvoice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex items-start gap-2 sm:gap-3 my-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
          message.sender === 'user'
            ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white'
            : 'bg-slate-200 border border-slate-300 text-cyan-700'
        }`}
      >
        {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4.5 w-4.5" />}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[94%] sm:max-w-[84%] rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
            : 'bg-white text-slate-800 shadow-md border border-slate-200'
        }`}
      >
        {/* Text Body */}
        {message.text && (
          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans break-words">
            {message.text}
          </div>
        )}

        {/* Interactive UI Widgets Inside Chat */}
        {message.widget && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            
            {/* 1. INSTANT REGISTERED PARTY BILLING CARD ("command se hi sell purchase ka option") */}
            {message.widget.type === 'INSTANT_BILL_CONFIRM' && (() => {
              const { billType, party, item } = message.widget;
              const subtotal = Number(instantQty) * Number(item.price);
              const taxAmount = (subtotal * 18) / 100;
              const grandTotal = subtotal + taxAmount;

              if (instantBillDone) {
                return (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {billType === 'SALE' ? 'Sales Invoice Generated!' : 'Purchase Restock Recorded!'}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Stock automatically {billType === 'SALE' ? 'deducted' : 'restocked'}. Full page bill opened.
                    </p>
                  </div>
                );
              }

              return (
                <div className="rounded-3xl bg-slate-50 border-2 border-cyan-500 p-4 sm:p-5 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-xl ${
                        billType === 'SALE' ? 'bg-cyan-100 text-cyan-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {billType === 'SALE' ? <ShoppingCart className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                      </span>
                      <span className="text-xs font-extrabold uppercase text-slate-800">
                        {billType === 'SALE' ? 'Express Sales Order' : 'Express Purchase Entry'}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Directory Verified
                    </span>
                  </div>

                  {/* Party Summary */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Party Details</span>
                      <strong className="text-xs font-extrabold text-slate-900">{party.name}</strong>
                      {party.phone && <span className="block text-[11px] font-mono text-slate-500">{party.phone}</span>}
                    </div>
                    <span className="text-xs font-mono font-extrabold text-cyan-800 bg-cyan-50 px-2 py-1 rounded-lg">
                      {party.type}
                    </span>
                  </div>

                  {/* Item Qty & Calculation Table */}
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900">{item.name} ({item.sku})</span>
                      <span className="font-mono text-slate-600">${item.price} / {item.unit}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-600">Qty:</span>
                        <button
                          onClick={() => setInstantQty(Math.max(1, instantQty - 1))}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={instantQty}
                          onChange={(e) => setInstantQty(Math.max(1, Number(e.target.value)))}
                          className="w-14 text-center rounded-lg border border-slate-300 py-1 text-xs font-mono font-bold"
                        />
                        <button
                          onClick={() => setInstantQty(instantQty + 1)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Total + 18% GST</span>
                        <span className="text-sm font-black font-mono text-cyan-800">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConfirmInstantBill(billType, party, item)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>
                      {billType === 'SALE' 
                        ? `Confirm Sale & Deduct -${instantQty} ${item.unit}`
                        : `Confirm Purchase & Restock +${instantQty} ${item.unit}`}
                    </span>
                  </button>
                </div>
              );
            })()}

            {/* 2. UNREGISTERED PARTY REGISTRATION & INSTANT BILLING CARD */}
            {message.widget.type === 'UNREGISTERED_PARTY_BILL' && (() => {
              const { billType, item } = message.widget;
              const qty = Number(newPartyForm.qty || 1);
              const subtotal = qty * Number(item.price);
              const grandTotal = subtotal + (subtotal * 0.18);

              if (unregisteredBillCreated) {
                return (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Party Saved & Invoice Generated!
                    </h4>
                    <p className="text-xs text-slate-600">
                      New party registered to directory and full page invoice created.
                    </p>
                  </div>
                );
              }

              return (
                <form 
                  onSubmit={(e) => handleRegisterPartyAndBill(e, billType, item)}
                  className="rounded-3xl bg-amber-50/70 border-2 border-amber-400 p-4 sm:p-5 shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                    <div className="flex items-center gap-2 text-amber-900">
                      <UserPlus className="w-4 h-4" />
                      <span className="text-xs font-extrabold uppercase">
                        New Party Registration & Billing
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900">
                      1-Step Action
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Customer / Party Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Verma"
                        value={newPartyForm.name}
                        onChange={(e) => setNewPartyForm({ ...newPartyForm, name: e.target.value })}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Mobile Number (+91...)</label>
                      <input
                        type="text"
                        placeholder="e.g. 9876543210"
                        value={newPartyForm.phone}
                        onChange={(e) => setNewPartyForm({ ...newPartyForm, phone: e.target.value })}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Billing Address / City</label>
                    <input
                      type="text"
                      placeholder="e.g. Connaught Place, New Delhi"
                      value={newPartyForm.address}
                      onChange={(e) => setNewPartyForm({ ...newPartyForm, address: e.target.value })}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3 py-1.5 text-xs"
                    />
                  </div>

                  {/* Item Summary Box */}
                  <div className="p-3 rounded-2xl bg-white border border-amber-200 flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-extrabold text-slate-900 block">{item.name}</strong>
                      <span className="text-[11px] font-mono text-slate-500">${item.price} / {item.unit}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-600">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={newPartyForm.qty}
                        onChange={(e) => setNewPartyForm({ ...newPartyForm, qty: Math.max(1, Number(e.target.value)) })}
                        className="w-14 rounded-lg border border-slate-300 py-1 text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>✨ Save Party & Generate Bill (${grandTotal.toFixed(2)})</span>
                  </button>
                </form>
              );
            })()}

            {/* 3. BILL / INVOICE RECEIPT CARD */}
            {message.widget.type === 'BILL_RECEIPT_CARD' && (() => {
              const bill = bills.find(b => b.id === message.widget.billId);
              if (!bill) return <div className="text-xs text-slate-400">Invoice receipt details loading...</div>;

              return (
                <div className="rounded-3xl bg-slate-50 border-2 border-slate-300 p-4 sm:p-5 shadow-md">
                  <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${
                        bill.type === 'SALE' ? 'bg-cyan-100 text-cyan-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {bill.type === 'SALE' ? <ShoppingCart className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                          {bill.type === 'SALE' ? 'TAX INVOICE / SALES BILL' : 'PURCHASE ENTRY RECEIPT'}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900">{bill.id}</h4>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      PAID & VERIFIED
                    </span>
                  </div>

                  <div className="py-2.5 text-xs text-slate-700 flex flex-wrap justify-between gap-2 border-b border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Party Name / Customer:</span>
                      <strong className="text-slate-900">{bill.partyName}</strong>
                      {bill.phone && <span className="block text-[11px] font-mono text-slate-500">{bill.phone}</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[11px]">Billing Date:</span>
                      <span className="font-mono">{new Date(bill.date).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Itemized Table */}
                  <div className="my-3 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-300 bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                          <th className="py-1.5 px-2">Item Description</th>
                          <th className="py-1.5 px-2 text-center">Qty</th>
                          <th className="py-1.5 px-2 text-right">Price</th>
                          <th className="py-1.5 px-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {bill.itemsList.map((itemRow, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-2 font-semibold text-slate-900">
                              {itemRow.name}
                              <span className="block text-[10px] text-slate-500 font-mono">{itemRow.sku}</span>
                            </td>
                            <td className="py-2 px-2 text-center font-mono font-bold">{itemRow.qty}</td>
                            <td className="py-2 px-2 text-right font-mono">${Number(itemRow.price).toFixed(2)}</td>
                            <td className="py-2 px-2 text-right font-mono font-extrabold">${Number(itemRow.subtotal).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Totals */}
                  <div className="pt-2 border-t border-slate-300 space-y-1 text-xs text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-mono">${bill.subtotal.toFixed(2)}</span>
                    </div>
                    {bill.taxAmount > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>GST / Tax:</span>
                        <span className="font-mono">+${bill.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {bill.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount:</span>
                        <span className="font-mono">-${bill.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-300">
                      <span>GRAND TOTAL BILL:</span>
                      <span className="font-mono text-cyan-800">${bill.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Receipt Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => setActiveInvoiceBill(bill)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Full Page Printable Bill</span>
                    </button>

                    <button
                      onClick={() => onOpenBillingModal && onOpenBillingModal(bill.type)}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-bold transition-all"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Create Another Bill</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 4. PARTIES DIRECTORY CARD IN CHAT */}
            {message.widget.type === 'PARTIES_WIDGET' && (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-600" />
                    <span>Saved Parties ({customers.length})</span>
                  </span>
                  <button
                    onClick={() => onOpenPartiesModal && onOpenPartiesModal()}
                    className="px-3 py-1 rounded-xl bg-cyan-600 text-white text-xs font-bold shadow-2xs"
                  >
                    Open Directory Modal
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {customers.slice(0, 5).map(c => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 mr-2">
                          {c.type}
                        </span>
                        <strong className="text-xs text-slate-900">{c.name}</strong>
                      </div>
                      <button
                        onClick={() => onOpenBillingModal && onOpenBillingModal(c.type === 'CUSTOMER' ? 'SALE' : 'PURCHASE')}
                        className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold"
                      >
                        Bill
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. REPORTS DASHBOARD CARD IN CHAT */}
            {message.widget.type === 'REPORTS_WIDGET' && (() => {
              const filterChatTf = (dateStr, tf) => {
                if (tf === 'ALL') return true;
                const d = new Date(dateStr);
                const now = new Date();
                if (tf === 'TODAY') return d.toDateString() === now.toDateString();
                if (tf === 'WEEK') return ((now - d) / (1000 * 60 * 60 * 24)) <= 7;
                if (tf === 'MONTH') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                if (tf === 'YEAR') return d.getFullYear() === now.getFullYear();
                return true;
              };

              const filteredBills = bills.filter(b => filterChatTf(b.date, reportTf));
              const saleBills = filteredBills.filter(b => b.type === 'SALE');
              const purchaseBills = filteredBills.filter(b => b.type === 'PURCHASE');
              const salesRev = saleBills.reduce((acc, b) => acc + b.totalAmount, 0);
              const purCost = purchaseBills.reduce((acc, b) => acc + b.totalAmount, 0);
              const netProfit = salesRev - purCost;

              return (
                <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2.5 gap-2">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Financial Overview</span>
                    </span>
                    <button
                      onClick={() => onOpenReportsModal && onOpenReportsModal()}
                      className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-2xs"
                    >
                      Open Full ERP Report
                    </button>
                  </div>

                  {/* Quick Time Period Filter Pills */}
                  <div className="flex flex-wrap gap-1 bg-slate-200/70 p-1 rounded-xl">
                    {['TODAY', 'WEEK', 'MONTH', 'YEAR', 'ALL'].map(tf => (
                      <button
                        key={tf}
                        onClick={() => setReportTf(tf)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          reportTf === tf ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tf === 'TODAY' ? 'Today' : tf === 'WEEK' ? 'Weekly' : tf === 'MONTH' ? 'Monthly' : tf === 'YEAR' ? 'Yearly' : 'All Time'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="p-3 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Sales ({reportTf})</span>
                      <span className="text-sm font-black font-mono text-emerald-700">${salesRev.toFixed(0)}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Purchases ({reportTf})</span>
                      <span className="text-sm font-black font-mono text-indigo-700">${purCost.toFixed(0)}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Profit ({reportTf})</span>
                      <span className="text-sm font-black font-mono text-slate-900">${netProfit.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 6. OVERSELL ALERT WIDGET */}
            {message.widget.type === 'OVERSELL_ALERT' && (() => {
              const item = items.find(i => i.id === message.widget.itemId);
              const requested = message.widget.requestedQty;
              const available = message.widget.availableQty;

              return (
                <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-amber-900">
                        Stock Validation Warning (Jyada Stock Nahi Hai!)
                      </h4>
                      <p className="text-xs text-amber-800 mt-1">
                        Aapne stock se jyada quantity remove/sell karne ka command diya. Sirf ye approx number stock me bacha hai:
                      </p>

                      {item && (
                        <div className="mt-3 bg-white/80 rounded-xl p-3 border border-amber-200 text-xs space-y-1.5">
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-600">Product:</span>
                            <span className="text-slate-900 font-bold">{item.name} ({item.sku})</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-red-700">Requested Sell Quantity:</span>
                            <span className="text-red-700 font-mono font-bold">-{requested} {item.unit}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t border-amber-100 pt-1.5">
                            <span className="text-emerald-700">Available Stock Quantity:</span>
                            <span className="text-emerald-800 font-mono font-extrabold">{available} {item.unit} (Approx available)</span>
                          </div>
                        </div>
                      )}

                      {item && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-amber-200">
                          <button
                            onClick={() => updateStock(item.id, 0)}
                            disabled={available <= 0}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs disabled:opacity-40 transition-colors"
                          >
                            Sell Max Available ({available} {item.unit})
                          </button>
                          <button
                            onClick={() => updateStock(item.id, item.quantity + 15)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-colors"
                          >
                            + Restock 15 Units
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 7. SINGLE ITEM INTERACTIVE CARD */}
            {message.widget.type === 'ITEM_CARD' && (() => {
              const item = items.find(i => i.id === message.widget.itemId);
              if (!item) return <div className="text-xs text-slate-400">Item not found.</div>;
              
              const isLow = item.quantity <= item.minStock;
              const isOut = item.quantity <= 0;

              return (
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 shadow-xs">
                  <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-200 text-cyan-800 border border-slate-300">
                          {item.sku}
                        </span>
                        <span className="text-xs font-semibold text-slate-600">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">{item.name}</h4>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                        ${item.price} <span className="text-xs font-normal text-slate-500">/ {item.unit}</span>
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                        isOut 
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : isLow 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK ALERT' : 'IN STOCK'}
                      </span>
                    </div>
                  </div>

                  <div className="my-3">
                    <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                      <span>
                        Current Stock: <strong className="text-slate-900 text-sm font-mono">{item.quantity}</strong> {item.unit}
                      </span>
                      <span className="text-slate-500">Alert: {item.minStock}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-cyan-600'
                        }`}
                        style={{ width: `${Math.min(100, (item.quantity / Math.max(item.minStock * 3, 15)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons including Bill / Sell */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenEditModal && onOpenEditModal(item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onOpenBillingModal && onOpenBillingModal('SALE', item)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 text-xs font-extrabold text-cyan-900 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Sell / POS Bill</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => updateStock(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 0}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-40 text-xs font-bold text-slate-800 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-red-600" />
                        <span>-1</span>
                      </button>
                      <button
                        onClick={() => updateStock(item.id, item.quantity + 1)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-emerald-100 hover:text-emerald-700 text-xs font-bold text-slate-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>+1</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* 8. INLINE ADD ITEM FORM CARD */}
            {message.widget.type === 'NEW_ITEM_FORM' && (
              formSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-900">Item Added Successfully!</h4>
                </div>
              ) : (
                <form onSubmit={handleInlineFormSubmit} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <PackagePlus className="w-5 h-5 text-cyan-700" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Add New Stock SKU</h4>
                      <p className="text-[11px] text-slate-500">Fill details below to register immediately</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Item Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                      value={inlineForm.name}
                      onChange={(e) => setInlineForm({ ...inlineForm, name: e.target.value })}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Qty</label>
                      <input
                        type="number"
                        min="0"
                        value={inlineForm.quantity}
                        onChange={(e) => setInlineForm({ ...inlineForm, quantity: e.target.value })}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={inlineForm.price}
                        onChange={(e) => setInlineForm({ ...inlineForm, price: e.target.value })}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Min Alert</label>
                      <input
                        type="number"
                        min="0"
                        value={inlineForm.minStock}
                        onChange={(e) => setInlineForm({ ...inlineForm, minStock: e.target.value })}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save SKU to Catalog</span>
                  </button>
                </form>
              )
            )}

            {/* 9. LOW STOCK OR FULL INVENTORY TABLE WIDGET */}
            {(message.widget.type === 'LOW_STOCK_TABLE' || message.widget.type === 'FULL_INVENTORY_TABLE') && (() => {
              const displayItems = message.widget.type === 'LOW_STOCK_TABLE'
                ? items.filter(i => i.quantity <= i.minStock)
                : items;

              if (displayItems.length === 0) {
                return (
                  <div className="p-4 text-center text-xs font-bold text-emerald-800 bg-emerald-100 rounded-2xl border border-emerald-300">
                    All stock levels are currently healthy! No low stock alerts.
                  </div>
                );
              }

              return (
                <div className="rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto shadow-xs">
                  <div className="max-h-64 overflow-y-auto min-w-[320px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                          <th className="py-2.5 px-3">Item & SKU</th>
                          <th className="py-2.5 px-2 text-center">Status</th>
                          <th className="py-2.5 px-3 text-right">Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {displayItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-100 transition-colors">
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</div>
                              <div className="text-[10px] sm:text-[11px] text-cyan-700 font-mono">{item.sku}</div>
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold font-mono inline-block ${
                                item.quantity <= 0 
                                  ? 'bg-red-100 text-red-800 border border-red-300' 
                                  : item.quantity <= item.minStock 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}>
                                {item.quantity} {item.unit}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => updateStock(item.id, item.quantity + 10)}
                                className="px-2.5 py-1 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-xs font-bold text-cyan-800 border border-cyan-300 transition-all"
                              >
                                +10 Restock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* 10. VALUATION STATS KPI GRID */}
            {message.widget.type === 'VALUATION_STATS' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500 block">Total Value</span>
                  <span className="text-sm sm:text-base font-extrabold text-cyan-700 font-mono mt-1 block">
                    ${totalValuation.toLocaleString()}
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500 block">Catalog Size</span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 font-mono mt-1 block">
                    {items.length} SKUs
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500 block">Stock Units</span>
                  <span className="text-sm sm:text-base font-extrabold text-indigo-700 font-mono mt-1 block">
                    {totalUnits} units
                  </span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase text-slate-500 block">Low / Out Alerts</span>
                  <span className="text-sm sm:text-base font-extrabold text-amber-700 font-mono mt-1 block">
                    {lowStockCount + outOfStockCount} items
                  </span>
                </div>
              </div>
            )}

            {/* 11. QUICK SUGGESTION CHIPS */}
            {message.widget.type === 'QUICK_TIPS' && message.widget.tips && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {message.widget.tips.map((tip, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendChatMessage(tip.cmd)}
                    className="text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-bold text-cyan-700 font-mono">{tip.cmd}</code>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    {tip.desc && <p className="text-xs text-slate-600 mt-1">{tip.desc}</p>}
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

        <div className="mt-2 flex justify-end">
          <span className="text-[10px] text-slate-400 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
