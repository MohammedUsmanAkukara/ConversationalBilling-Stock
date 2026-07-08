import React from 'react';
import { X, Printer, Boxes, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function FullPageInvoiceModal({ bill, onClose }) {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/70 backdrop-blur-md overflow-y-auto print:bg-white print:p-0">
      
      {/* Top Floating Control Bar (Hidden when printing via print:hidden) */}
      <div className="sticky top-0 z-10 bg-slate-900/90 border-b border-slate-700 px-4 sm:px-8 py-3.5 flex items-center justify-between text-white print:hidden">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            {bill.type === 'SALE' ? 'Official Tax Invoice' : 'Supplier Purchase Voucher'}
          </span>
          <span className="text-sm font-mono text-slate-300 font-bold">{bill.id}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs sm:text-sm font-extrabold shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice / Save PDF (A4)</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Invoice Container (Centrally aligned on screen, Full width on Print) */}
      <div className="flex-1 p-3 sm:p-8 flex justify-center print:p-0">
        <div className="w-full max-w-4xl bg-white text-slate-900 shadow-2xl rounded-3xl sm:rounded-2xl p-6 sm:p-12 print:shadow-none print:rounded-none print:w-full print:max-w-none print:p-8">
          
          {/* Top Brand & Invoice Title */}
          <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-6 pb-8 border-b-2 border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-600 to-indigo-600 text-white shadow-md">
                  <Boxes className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    CHATSTOCK AI TRADING CO.
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold">
                    Automated Conversational Inventory & Logistics Solution
                  </p>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600 space-y-1">
                <p><strong>HQ Office:</strong> Cyber Hub, Sector 24, New Delhi, India</p>
                <p><strong>GSTIN / Tax ID:</strong> 07AAACC4175D1Z4</p>
                <p><strong>Support Email:</strong> billing@chatstock-ai.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wider uppercase block">
                {bill.type === 'SALE' ? 'TAX INVOICE' : 'PURCHASE BILL'}
              </span>
              <p className="text-sm font-extrabold font-mono text-cyan-700 mt-1">
                Invoice No: #{bill.id}
              </p>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <p><strong>Billing Date:</strong> {new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p><strong>Time:</strong> {new Date(bill.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  STATUS: PAID & SETTLED
                </p>
              </div>
            </div>
          </div>

          {/* Party Info (Bill To / Ship To) */}
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                {bill.type === 'SALE' ? 'Billed To (Customer Details)' : 'Supplier / Vendor Details'}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">{bill.partyName}</h3>
              {bill.phone && <p className="text-xs text-slate-600 mt-1 font-mono">Contact: {bill.phone}</p>}
              {bill.email && <p className="text-xs text-slate-600">Email: {bill.email}</p>}
              {bill.address && <p className="text-xs text-slate-600 mt-1">Address: {bill.address}</p>}
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Payment & Fulfillment
              </span>
              <p className="text-xs text-slate-700"><strong>Mode:</strong> Verified AI Instant POS</p>
              <p className="text-xs text-slate-700 mt-0.5"><strong>Stock Update:</strong> Automatically Synchronized</p>
              <p className="text-xs text-slate-700 mt-0.5"><strong>Place of Supply:</strong> Delhi (07)</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="my-8 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 bg-slate-100 text-xs font-bold text-slate-700 uppercase">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Product Description & SKU</th>
                  <th className="py-3 px-3 text-center">Unit Price</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Line Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {bill.itemsList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-slate-900">{row.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{row.sku}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">${Number(row.price).toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold">{row.qty}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-extrabold text-slate-900">
                      ${Number(row.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary Breakup */}
          <div className="flex flex-wrap sm:flex-nowrap justify-between gap-8 pt-6 border-t-2 border-slate-200">
            <div className="flex-1 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Terms & Conditions:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Goods once sold can only be exchanged within 7 days with original receipt.</li>
                <li>All stock quantities have been audited and adjusted in real-time inventory.</li>
                <li>Thank you for doing business with ChatStock AI!</li>
              </ul>
            </div>

            <div className="w-full sm:w-80 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">${bill.subtotal.toFixed(2)}</span>
              </div>
              {bill.taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax ({bill.taxRate || 18}%):</span>
                  <span className="font-mono font-bold">+${bill.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {bill.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount Applied:</span>
                  <span className="font-mono font-bold">-${bill.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t-2 border-slate-800">
                <span>GRAND TOTAL:</span>
                <span className="font-mono text-cyan-800">${bill.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Signature & Footer */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex items-end justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Digitally Authenticated by ChatStock AI Engine</span>
            </div>

            <div className="text-center">
              <div className="w-44 border-b border-slate-400 pb-6"></div>
              <span className="text-[11px] font-bold text-slate-600 uppercase block mt-1">
                Authorized Signatory
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
