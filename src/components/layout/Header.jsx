import React, { useState } from 'react';
import { 
  Boxes, 
  Volume2, 
  VolumeX, 
  Download, 
  DollarSign, 
  PanelLeftClose, 
  PanelLeftOpen, 
  ChevronDown,
  Package,
  ShoppingCart,
  Truck,
  Users,
  BarChart3,
  User,
  LogOut
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export default function Header({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  onOpenBillingModal,
  onOpenPartiesModal,
  onOpenReportsModal,
  currentUser,
  onLogout
}) {
  const { 
    totalValuation, 
    soundEnabled, 
    setSoundEnabled,
    exportCSV,
    exportJSON,
    totalItems
  } = useInventory();

  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-slate-200 px-3 py-2 sm:px-6 shadow-sm">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-600 to-indigo-600 shadow-md">
            <Boxes className="h-5 w-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 truncate">
                ChatStock AI ERP
              </h1>
              <span className="rounded-full bg-cyan-50 border border-cyan-200 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
                POS & Billing Active
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden lg:block truncate">
              {currentUser?.businessName ? `${currentUser.businessName} • Connected` : 'Conversational Inventory & Accounting Suite'}
            </p>
          </div>
        </div>

        {/* Middle: Visual Health Pills */}
        <div className="hidden xl:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200">
            <Package className="w-3.5 h-3.5 text-cyan-600" />
            <div>
              <span className="text-[9px] font-semibold text-slate-500 block uppercase">Total Items</span>
              <span className="text-xs font-bold text-slate-800">{totalItems} SKUs</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200">
            <div className="p-1 rounded-full bg-emerald-100 text-emerald-700">
              <DollarSign className="w-3 h-3" />
            </div>
            <div>
              <span className="text-[9px] font-semibold text-slate-500 block uppercase">Stock Value</span>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                ${totalValuation.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions - Fully Responsive */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          
          {/* USER PROFILE BADGE & DIRECT LOGOUT BUTTON ("header me signin hata ke logout ka option") */}
          {currentUser && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 pl-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800 truncate max-w-[95px] sm:max-w-[130px]">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-2xs transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}

          {/* SELL BILLING BUTTON */}
          <button
            onClick={() => onOpenBillingModal && onOpenBillingModal('SALE')}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-sm transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>New Sell Bill</span>
          </button>

          {/* PURCHASE STOCK BUTTON */}
          <button
            onClick={() => onOpenBillingModal && onOpenBillingModal('PURCHASE')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold transition-all"
          >
            <Truck className="w-3.5 h-3.5 text-indigo-700" />
            <span>Purchase Entry</span>
          </button>

          {/* PARTIES DIRECTORY BUTTON */}
          <button
            onClick={() => onOpenPartiesModal && onOpenPartiesModal()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            <Users className="w-3.5 h-3.5 text-cyan-700" />
            <span>Parties</span>
          </button>

          {/* FINANCIAL REPORTS BUTTON */}
          <button
            onClick={() => onOpenReportsModal && onOpenReportsModal()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-700" />
            <span>Reports</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100'
                : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Toggle Catalog Drawer */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border font-semibold text-xs transition-all ${
              isSidebarOpen
                ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Catalog ({totalItems})</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="h-4 w-4" />
                <span>Catalog ({totalItems})</span>
              </>
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
