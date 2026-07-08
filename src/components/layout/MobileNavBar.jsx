import React from 'react';
import { 
  MessageSquare, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3,
  ScanLine
} from 'lucide-react';

export default function MobileNavBar({ 
  activeTab, 
  setActiveTab, 
  onOpenBillingModal, 
  onOpenPartiesModal, 
  onOpenReportsModal,
  onOpenScannerModal,
  totalItems 
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        
        {/* 1. Chat AI Workstation */}
        <button
          type="button"
          onClick={() => setActiveTab('CHAT')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
            activeTab === 'CHAT'
              ? 'text-cyan-700 font-extrabold bg-cyan-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Chat AI</span>
        </button>

        {/* 2. New Sell Bill (POS) */}
        <button
          type="button"
          onClick={() => onOpenBillingModal('SALE')}
          className="flex flex-col items-center justify-center py-1.5 rounded-2xl text-cyan-700 hover:bg-cyan-50 transition-all font-bold"
        >
          <ShoppingCart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Sell Bill</span>
        </button>

        {/* 3. Catalog Drawer / Items */}
        <button
          type="button"
          onClick={() => setActiveTab('CATALOG')}
          className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative ${
            activeTab === 'CATALOG'
              ? 'text-cyan-700 font-extrabold bg-cyan-50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Catalog</span>
          {totalItems > 0 && (
            <span className="absolute top-1 right-3 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-600 text-white">
              {totalItems}
            </span>
          )}
        </button>

        {/* 4. Parties Directory (Customers & Suppliers) */}
        <button
          type="button"
          onClick={onOpenPartiesModal}
          className="flex flex-col items-center justify-center py-1.5 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all font-bold"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Parties</span>
        </button>

        {/* 5. Reports & Analytics */}
        <button
          type="button"
          onClick={onOpenReportsModal}
          className="flex flex-col items-center justify-center py-1.5 rounded-2xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all font-bold"
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Reports</span>
        </button>

      </div>
    </nav>
  );
}
