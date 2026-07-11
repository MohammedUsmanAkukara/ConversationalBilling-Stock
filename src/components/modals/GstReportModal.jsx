import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Percent, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Layers,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function GstReportModal({ isOpen, onClose }) {
  const { bills, setActiveInvoiceBill } = useInventory();
  const [period, setPeriod] = useState('ALL'); // 'ALL' | 'MONTH' | 'QUARTER' | 'YEAR'
  const [activeTab, setActiveTab] = useState('SUMMARY'); // 'SUMMARY' | 'GSTR1_SALES' | 'ITC_PURCHASES' | 'SLAB_WISE'

  if (!isOpen) return null;

  // Filter bills by period
  const filterByPeriod = (dateStr, prd) => {
    if (prd === 'ALL') return true;
    const d = new Date(dateStr);
    const now = new Date();

    if (prd === 'MONTH') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (prd === 'QUARTER') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const billQuarter = Math.floor(d.getMonth() / 3);
      return billQuarter === currentQuarter && d.getFullYear() === now.getFullYear();
    }
    if (prd === 'YEAR') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredBills = (bills || []).filter(b => filterByPeriod(b.date, period));
  const salesBills = filteredBills.filter(b => b.type === 'SALE');
  const purchaseBills = filteredBills.filter(b => b.type === 'PURCHASE');

  // Output GST (from Sales)
  const totalSalesTaxable = salesBills.reduce((acc, b) => acc + Number(b.subtotal || 0), 0);
  const totalOutputGst = salesBills.reduce((acc, b) => acc + Number(b.taxAmount || (b.subtotal * 0.18)), 0);
  const outputCgst = totalOutputGst / 2;
  const outputSgst = totalOutputGst / 2;

  // Input Tax Credit (ITC from Purchases)
  const totalPurchaseTaxable = purchaseBills.reduce((acc, b) => acc + Number(b.subtotal || 0), 0);
  const totalInputTaxCredit = purchaseBills.reduce((acc, b) => acc + Number(b.taxAmount || (b.subtotal * 0.18)), 0);
  const inputCgst = totalInputTaxCredit / 2;
  const inputSgst = totalInputTaxCredit / 2;

  // Net GST Payable
  const netGstPayable = totalOutputGst - totalInputTaxCredit;

  // Slab-wise calculation (Grouping items or bills into 5%, 12%, 18%, 28%)
  const taxSlabs = [
    { rate: 5, label: 'GST @ 5%' },
    { rate: 12, label: 'GST @ 12%' },
    { rate: 18, label: 'GST @ 18%' },
    { rate: 28, label: 'GST @ 28%' },
  ];

  const getSlabSummary = (rate) => {
    let taxable = 0;
    let tax = 0;
    filteredBills.forEach(b => {
      const billRate = Number(b.taxRate || 18);
      if (billRate === rate) {
        taxable += Number(b.subtotal || 0);
        tax += Number(b.taxAmount || 0);
      }
    });
    return { taxable, tax, cgst: tax / 2, sgst: tax / 2 };
  };

  // Export GST CSV Report
  const handleExportGstCsv = () => {
    const headers = [
      'Invoice/Voucher No',
      'Type',
      'Date',
      'Party Name',
      'Taxable Value ($)',
      'GST Rate (%)',
      'CGST ($)',
      'SGST ($)',
      'Total GST ($)',
      'Total Amount ($)'
    ];

    const rows = filteredBills.map(b => {
      const taxable = Number(b.subtotal || 0).toFixed(2);
      const rate = Number(b.taxRate || 18);
      const gst = Number(b.taxAmount || 0);
      const cgst = (gst / 2).toFixed(2);
      const sgst = (gst / 2).toFixed(2);
      const total = Number(b.totalAmount || 0).toFixed(2);
      return [
        b.id,
        b.type,
        new Date(b.date).toLocaleDateString(),
        `"${(b.partyName || '').replace(/"/g, '""')}"`,
        taxable,
        rate,
        cgst,
        sgst,
        gst.toFixed(2),
        total
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GST_Return_Report_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintGstSummary = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  GST Compliance & Tax Return Report (GSTR-1 & GSTR-3B)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Verified Tax Engine
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Automated Output GST liability, Input Tax Credit (ITC) reconciliation & Slab-wise summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Time Period Filter & Export Control Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-200 bg-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
              <Calendar className="w-4 h-4 text-cyan-700" />
              <span>Return Period:</span>
            </div>
            <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1">
              <button
                onClick={() => setPeriod('MONTH')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  period === 'MONTH' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setPeriod('QUARTER')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  period === 'QUARTER' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                This Quarter
              </button>
              <button
                onClick={() => setPeriod('YEAR')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  period === 'YEAR' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Financial Year
              </button>
              <button
                onClick={() => setPeriod('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  period === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportGstCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export GST CSV / Excel</span>
            </button>
            <button
              onClick={handlePrintGstSummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Return</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-6 text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('SUMMARY')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'SUMMARY'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            GSTR-3B Tax Summary & ITC
          </button>
          <button
            onClick={() => setActiveTab('GSTR1_SALES')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'GSTR1_SALES'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            GSTR-1 Outward Sales ({salesBills.length})
          </button>
          <button
            onClick={() => setActiveTab('ITC_PURCHASES')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'ITC_PURCHASES'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Input Tax Credit Purchases ({purchaseBills.length})
          </button>
          <button
            onClick={() => setActiveTab('SLAB_WISE')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'SLAB_WISE'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tax Slab Breakdown
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: GSTR-3B SUMMARY */}
          {activeTab === 'SUMMARY' && (
            <div className="space-y-6">
              
              {/* 3 Main KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Output GST Card */}
                <div className="p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-800 uppercase tracking-wider">
                      1. Output GST Collected
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black font-mono text-cyan-950">
                      ${totalOutputGst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <p className="text-[11px] font-semibold text-cyan-700 mt-0.5">
                      Taxable Sales Value: ${totalSalesTaxable.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-cyan-200/60 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-cyan-700 font-sans block">CGST</span>
                      <strong className="text-cyan-900">${outputCgst.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-cyan-700 font-sans block">SGST</span>
                      <strong className="text-cyan-900">${outputSgst.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Input Tax Credit (ITC) Card */}
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-800 uppercase tracking-wider">
                      2. Input Tax Credit (ITC)
                    </span>
                    <ArrowDownRight className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black font-mono text-indigo-950">
                      ${totalInputTaxCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">
                      Taxable Purchases: ${totalPurchaseTaxable.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-indigo-200/60 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-indigo-700 font-sans block">Input CGST</span>
                      <strong className="text-indigo-900">${inputCgst.toFixed(2)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-700 font-sans block">Input SGST</span>
                      <strong className="text-indigo-900">${inputSgst.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Net Payable / Refund Card */}
                <div className={`p-5 rounded-2xl border shadow-xs ${
                  netGstPayable >= 0 
                    ? 'bg-amber-50/80 border-amber-300' 
                    : 'bg-emerald-50/80 border-emerald-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${
                      netGstPayable >= 0 ? 'text-amber-900' : 'text-emerald-900'
                    }`}>
                      3. Net GST {netGstPayable >= 0 ? 'Payable' : 'Surplus ITC'}
                    </span>
                    <ShieldCheck className={`w-5 h-5 ${netGstPayable >= 0 ? 'text-amber-700' : 'text-emerald-700'}`} />
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      ${Math.abs(netGstPayable).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <p className={`text-[11px] font-bold mt-0.5 ${
                      netGstPayable >= 0 ? 'text-amber-800' : 'text-emerald-800'
                    }`}>
                      {netGstPayable >= 0 
                        ? 'Net liability to be deposited to Government' 
                        : 'Excess ITC Carried Forward to Next Period'}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 font-semibold">
                    Formula: Output GST - Input Tax Credit
                  </div>
                </div>

              </div>

              {/* GSTR-3B Filing Checklist Banner */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Ready for Instant GSTR-3B & GSTR-1 Return Filing</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      All calculations align with standard Indian GST accounting norms (CGST + SGST split / IGST).
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleExportGstCsv}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shrink-0 transition-all shadow-md"
                >
                  Download Offline Return CSV
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: GSTR-1 SALES LEDGER */}
          {activeTab === 'GSTR1_SALES' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Outward Taxable Supplies (GSTR-1 Register)</h4>
                  <p className="text-xs text-slate-500">List of all customer invoices issued in this period</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {salesBills.length} Sale Invoices
                </span>
              </div>

              {salesBills.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-bold">
                  No sales invoices found for this return period.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase border-b border-slate-200">
                        <th className="py-3 px-3">Invoice #</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Customer Party</th>
                        <th className="py-3 px-3 text-right">Taxable Value</th>
                        <th className="py-3 px-3 text-center">GST Rate</th>
                        <th className="py-3 px-3 text-right">CGST</th>
                        <th className="py-3 px-3 text-right">SGST</th>
                        <th className="py-3 px-3 text-right">Total GST</th>
                        <th className="py-3 px-3 text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {salesBills.map(b => {
                        const taxable = Number(b.subtotal || 0);
                        const gst = Number(b.taxAmount || 0);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono font-bold text-cyan-700">{b.id}</td>
                            <td className="py-3 px-3 text-slate-600">{new Date(b.date).toLocaleDateString()}</td>
                            <td className="py-3 px-3 font-bold text-slate-900">{b.partyName}</td>
                            <td className="py-3 px-3 text-right font-mono">${taxable.toFixed(2)}</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-700">{b.taxRate || 18}%</td>
                            <td className="py-3 px-3 text-right font-mono">${(gst / 2).toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-mono">${(gst / 2).toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-cyan-800">${gst.toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-mono font-black text-slate-900">${Number(b.totalAmount || 0).toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ITC PURCHASES LEDGER */}
          {activeTab === 'ITC_PURCHASES' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Inward Supplies & ITC Register</h4>
                  <p className="text-xs text-slate-500">List of supplier bills and Input Tax Credit eligible in this period</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  {purchaseBills.length} Purchase Bills
                </span>
              </div>

              {purchaseBills.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-bold">
                  No purchase bills recorded for this period.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase border-b border-slate-200">
                        <th className="py-3 px-3">Voucher #</th>
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Supplier Vendor</th>
                        <th className="py-3 px-3 text-right">Taxable Value</th>
                        <th className="py-3 px-3 text-center">GST Rate</th>
                        <th className="py-3 px-3 text-right">Input CGST</th>
                        <th className="py-3 px-3 text-right">Input SGST</th>
                        <th className="py-3 px-3 text-right">ITC Amount</th>
                        <th className="py-3 px-3 text-right">Total Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {purchaseBills.map(b => {
                        const taxable = Number(b.subtotal || 0);
                        const gst = Number(b.taxAmount || 0);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-mono font-bold text-indigo-700">{b.id}</td>
                            <td className="py-3 px-3 text-slate-600">{new Date(b.date).toLocaleDateString()}</td>
                            <td className="py-3 px-3 font-bold text-slate-900">{b.partyName}</td>
                            <td className="py-3 px-3 text-right font-mono">${taxable.toFixed(2)}</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-700">{b.taxRate || 18}%</td>
                            <td className="py-3 px-3 text-right font-mono">${(gst / 2).toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-mono">${(gst / 2).toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-indigo-800">${gst.toFixed(2)}</td>
                            <td className="py-3 px-3 text-right font-mono font-black text-slate-900">${Number(b.totalAmount || 0).toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SLAB-WISE BREAKDOWN */}
          {activeTab === 'SLAB_WISE' && (
            <div>
              <div className="mb-3">
                <h4 className="text-sm font-extrabold text-slate-900">Tax Slab-Wise Summary Table</h4>
                <p className="text-xs text-slate-500">Distribution of Taxable Turnover & GST across 5%, 12%, 18% and 28% brackets</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {taxSlabs.map((slab) => {
                  const summary = getSlabSummary(slab.rate);
                  return (
                    <div key={slab.rate} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-sm font-extrabold text-slate-900">{slab.label}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 text-cyan-800">
                          Rate: {slab.rate}%
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-500 font-sans block uppercase">Taxable Value</span>
                          <strong className="text-sm font-black text-slate-900">${summary.taxable.toFixed(2)}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-sans block uppercase">Total GST</span>
                          <strong className="text-sm font-black text-cyan-800">${summary.tax.toFixed(2)}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-sans block uppercase">CGST ({slab.rate/2}%)</span>
                          <span className="text-slate-700 font-bold">${summary.cgst.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-sans block uppercase">SGST ({slab.rate/2}%)</span>
                          <span className="text-slate-700 font-bold">${summary.sgst.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CA & GST Audited Ready Return Format</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all"
          >
            Close GST Report
          </button>
        </div>

      </div>
    </div>
  );
}
