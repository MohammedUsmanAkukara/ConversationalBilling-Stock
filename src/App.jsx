import React, { useState, useEffect } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import Header from './components/layout/Header';
import MobileNavBar from './components/layout/MobileNavBar';
import ChatContainer from './components/chat/ChatContainer';
import CommandBar from './components/chat/CommandBar';
import InventorySidebar from './components/inventory/InventorySidebar';
import EditItemModal from './components/modals/EditItemModal';
import BillingModal from './components/modals/BillingModal';
import FullPageInvoiceModal from './components/modals/FullPageInvoiceModal';
import PartiesModal from './components/modals/PartiesModal';
import ReportsModal from './components/modals/ReportsModal';
import GstReportModal from './components/modals/GstReportModal';
import LoginScreen from './components/auth/LoginScreen';
import { X, ShieldAlert } from 'lucide-react';


function AppContent() {
  const { alertNotification, closeStockAlert, activeInvoiceBill, setActiveInvoiceBill, totalItems } = useInventory();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Auth user state stored in localStorage (defaults to null so user logs in first)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('chatstock_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chatstock_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('chatstock_auth_user');
    }
  }, [currentUser]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Billing & Purchase modal state
  const [billingModalState, setBillingModalState] = useState({
    isOpen: false,
    type: 'SALE', // 'SALE' | 'PURCHASE'
    initialItem: null
  });

  // Parties directory modal state
  const [partiesModalOpen, setPartiesModalOpen] = useState(false);

  // Reports modal state
  const [reportsModalOpen, setReportsModalOpen] = useState(false);

  // GST Compliance Report modal state ("ab last me gst report ka option bhi dedo")
  const [gstReportModalOpen, setGstReportModalOpen] = useState(false);

  const handleOpenBillingModal = (type = 'SALE', initialItem = null) => {
    setBillingModalState({
      isOpen: true,
      type,
      initialItem
    });
  };

  // GATEKEEPER: If user is not logged in, show LoginScreen first!
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] h-screen max-h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-900 relative">
      
      {/* Top Floating Alert Notification Toast (Oversell Validation Warning) */}
      {alertNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top-4 duration-300">
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-400 p-4 shadow-2xl flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-amber-950">
                  {alertNotification.title}
                </h4>
                <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                  {alertNotification.message}
                </p>
              </div>
            </div>
            <button
              onClick={closeStockAlert}
              className="p-1.5 rounded-lg hover:bg-amber-200/60 text-amber-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header with Logout Button */}
      <Header 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        onOpenBillingModal={handleOpenBillingModal}
        onOpenPartiesModal={() => setPartiesModalOpen(true)}
        onOpenReportsModal={() => setReportsModalOpen(true)}
        onOpenGstReportModal={() => setGstReportModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Split Interface */}
      <main className="flex-1 flex min-h-0 overflow-hidden relative">
        
        {/* Collapsible Inventory Sidebar (Catalog) - Desktop Left Sidebar (md and up) */}
        {isSidebarOpen && (
          <aside className="w-80 lg:w-96 shrink-0 h-full hidden md:block border-r border-slate-200 bg-white shadow-lg z-20">
            <InventorySidebar 
              onOpenEditModal={(item) => setEditingItem(item)}
              onOpenBillingModal={handleOpenBillingModal}
            />
          </aside>
        )}

        {/* Main Chat Workstation (Right side when Catalog is open) */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full bg-slate-50 overflow-hidden">
          <ChatContainer 
            onOpenEditModal={(item) => setEditingItem(item)}
            onOpenBillingModal={handleOpenBillingModal}
            onOpenPartiesModal={() => setPartiesModalOpen(true)}
            onOpenReportsModal={() => setReportsModalOpen(true)}
            onOpenGstReportModal={() => setGstReportModalOpen(true)}
          />
          <CommandBar />
        </div>

        {/* Collapsible Inventory Sidebar - Mobile Slide-Over Drawer Modal (< md, Left side) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div 
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="relative mr-auto w-full max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-100">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Mobile Inventory Catalog
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <InventorySidebar 
                  onOpenEditModal={(item) => setEditingItem(item)}
                  onOpenBillingModal={handleOpenBillingModal}
                />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Touch-Optimized Bottom Mobile App Bar (Only visible on phones < md) */}
      <MobileNavBar
        activeTab={isSidebarOpen ? 'CATALOG' : 'CHAT'}
        setActiveTab={(tab) => {
          if (tab === 'CATALOG') setIsSidebarOpen(true);
          else setIsSidebarOpen(false);
        }}
        onOpenBillingModal={handleOpenBillingModal}
        onOpenPartiesModal={() => setPartiesModalOpen(true)}
        onOpenReportsModal={() => setReportsModalOpen(true)}
        onOpenGstReportModal={() => setGstReportModalOpen(true)}
        totalItems={totalItems}
      />

      {/* Item Editing Modal */}
      <EditItemModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
      />

      {/* Purchase & Sales Billing POS Modal */}
      <BillingModal
        isOpen={billingModalState.isOpen}
        onClose={() => setBillingModalState({ ...billingModalState, isOpen: false })}
        initialType={billingModalState.type}
        initialItem={billingModalState.initialItem}
      />

      {/* Parties Directory Modal */}
      <PartiesModal
        isOpen={partiesModalOpen}
        onClose={() => setPartiesModalOpen(false)}
        onOpenBillingModal={handleOpenBillingModal}
      />

      {/* Financial & Inventory ERP Reports Modal */}
      <ReportsModal
        isOpen={reportsModalOpen}
        onClose={() => setReportsModalOpen(false)}
        onOpenGstReportModal={() => setGstReportModalOpen(true)}
      />

      {/* GST Compliance Report Modal ("ab last me gst report ka option bhi dedo") */}
      <GstReportModal
        isOpen={gstReportModalOpen}
        onClose={() => setGstReportModalOpen(false)}
      />

      {/* Full Page Print-Ready GST Tax Invoice Preview View */}
      <FullPageInvoiceModal
        bill={activeInvoiceBill}
        onClose={() => setActiveInvoiceBill(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
