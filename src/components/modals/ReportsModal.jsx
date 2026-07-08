import React, { useState } from 'react';
import { X, BarChart3, TrendingUp, DollarSign, Package, AlertTriangle, Download, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function ReportsModal({ isOpen, onClose }) {
  const { 
    items, 
    bills, 
    totalValuation, 
    totalUnits, 
    lowStockCount, 
    outOfStockCount,
    exportCSV,
    exportJSON,
    setActiveInvoiceBill
  } = useInventory();

  const [timeframe, setTimeframe] = useState('ALL'); // 'ALL' | 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'

  if (!isOpen) return null;

  const filterByTimeframe = (dateStr, tf) => {
    if (tf === 'ALL') return true;
    const d = new Date(dateStr);
    const now = new Date();

    if (tf === 'TODAY') {
      return d.toDateString() === now.toDateString();
    }
    if (tf === 'WEEK') {
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    if (tf === 'MONTH') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (tf === 'YEAR') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredBills = bills.filter(b => filterByTimeframe(b.date, timeframe));

  const saleBills = filteredBills.filter(b => b.type === 'SALE');
  const purchaseBills = filteredBills.filter(b => b.type === 'PURCHASE');

  const totalSalesRevenue = saleBills.reduce((acc, b) => acc + Number(b.totalAmount || 0), 0);
  const totalPurchaseCost = purchaseBills.reduce((acc, b) => acc + Number(b.totalAmount || 0), 0);
  const estimatedGrossProfit = totalSalesRevenue - totalPurchaseCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-800">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Business & Inventory Analytics ERP Report
              </h3>
              <p className="text-xs text-slate-500">
                Real-time financial performance, P&L audit, and timeframe reports
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

        {/* Timeframe Filter Bar ("reports me na monthly yearly aur weekly and today ka option") */}
        <div className="px-5 sm:px-6 py-3 border-b border-slate-200 bg-slate-100/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
            <Calendar className="w-4 h-4 text-cyan-700" />
            <span>Time Period Filter:</span>
          </div>

          <div className="flex flex-wrap bg-slate-200/80 p-1 rounded-xl gap-1">
            <button
              onClick={() => setTimeframe('TODAY')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'TODAY' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Today (Aaj)
            </button>
            <button
              onClick={() => setTimeframe('WEEK')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'WEEK' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Weekly (Hafta)
            </button>
            <button
              onClick={() => setTimeframe('MONTH')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'MONTH' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Monthly (Mahina)
            </button>
            <button
              onClick={() => setTimeframe('YEAR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'YEAR' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Yearly (Saal)
            </button>
            <button
              onClick={() => setTimeframe('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeframe === 'ALL' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* 1. Financial KPI Grid for Selected Timeframe */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Revenue & Profit ({timeframe === 'TODAY' ? 'Today' : timeframe === 'WEEK' ? 'This Week' : timeframe === 'MONTH' ? 'This Month' : timeframe === 'YEAR' ? 'This Year' : 'All Time'})
              </h4>
              <span className="text-[11px] font-bold text-slate-500">
                {filteredBills.length} invoice(s) found
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase block">Sales Revenue</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-base sm:text-xl font-black font-mono text-slate-900">
                    ${totalSalesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">{saleBills.length} sale invoice(s)</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase block">Purchase Costs</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <ArrowDownRight className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-base sm:text-xl font-black font-mono text-slate-900">
                    ${totalPurchaseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">{purchaseBills.length} purchase bill(s)</span>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 shadow-xs">
                <span className="text-[10px] sm:text-xs font-bold text-cyan-800 uppercase block">Current Stock Value</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <DollarSign className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span className="text-base sm:text-xl font-black font-mono text-cyan-900">
                    ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-700 block mt-1">{totalUnits} units active</span>
              </div>

              <div className={`p-4 rounded-2xl border shadow-xs ${
                estimatedGrossProfit >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
              }`}>
                <span className="text-[10px] sm:text-xs font-bold uppercase block text-slate-600">Net Balance ({timeframe})</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-base sm:text-xl font-black font-mono text-slate-900">
                    ${estimatedGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 block mt-1">Sales - Purchases</span>
              </div>
            </div>
          </div>

          {/* 2. Filtered Bills / Transactions List */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
              Invoices Recorded in Selected Timeframe ({filteredBills.length})
            </h4>

            {filteredBills.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-semibold">
                No invoices recorded in this timeframe yet. Try selecting "All Time" or generate a new bill!
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredBills.map(b => (
                  <div key={b.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-2 ${
                        b.type === 'SALE' ? 'bg-cyan-100 text-cyan-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {b.type}
                      </span>
                      <strong className="text-slate-900">{b.id}</strong> — <span className="text-slate-600">{b.partyName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-extrabold text-slate-900">${b.totalAmount.toFixed(2)}</span>
                      <button
                        onClick={() => { onClose(); setActiveInvoiceBill(b); }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 font-bold"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Inventory Health Breakdown */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
              Catalog Stock Health Distribution
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs font-extrabold text-emerald-800 uppercase block">Healthy Stock</span>
                <span className="text-2xl font-black font-mono text-emerald-900 block mt-1">
                  {items.length - lowStockCount - outOfStockCount}
                </span>
                <span className="text-[10px] text-emerald-700">Optimal levels</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs font-extrabold text-amber-800 uppercase block">Low Stock Alert</span>
                <span className="text-2xl font-black font-mono text-amber-900 block mt-1">
                  {lowStockCount}
                </span>
                <span className="text-[10px] text-amber-700">Below minimum threshold</span>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                <span className="text-xs font-extrabold text-red-800 uppercase block">Out of Stock</span>
                <span className="text-2xl font-black font-mono text-red-900 block mt-1">
                  {outOfStockCount}
                </span>
                <span className="text-[10px] text-red-700">Immediate reorder needed</span>
              </div>
            </div>
          </div>

          {/* 4. Data Backups & Exports */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Complete ERP Backup & Spreadsheet Export</h4>
                <p className="text-xs text-slate-600">Download your full inventory database & financial ledgers anytime</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Excel/CSV Spreadsheet</span>
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Export JSON Database Backup</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
