import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useInventory } from '../../context/InventoryContext';

export default function ChatContainer({ onOpenEditModal, onOpenBillingModal, onOpenPartiesModal, onOpenReportsModal }) {
  const { messages } = useInventory();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-8 py-4 sm:py-6 bg-slate-50 relative">
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        
        {/* Beginner Guide Banner - Fully Mobile Responsive */}
        <div className="mb-4 sm:mb-6 rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  Welcome to ChatStock AI — Full Conversational ERP System
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  100% Mobile Touch Friendly
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Ab pura business & inventory mobile se ya desktop se aaram se handle karein:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white font-bold text-[10px]">1</span>
                  <span className="text-slate-700"><strong>Sell Bill / Purchase</strong> se invoice banayein & stock auto-update karein</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px]">2</span>
                  <span className="text-slate-700"><strong>Parties</strong> se Customers & Suppliers ki ledger manage karein</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">3</span>
                  <span className="text-slate-700"><strong>Reports</strong> me P&L Analytics check karein ya Excel/CSV export karein</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onOpenEditModal={onOpenEditModal}
            onOpenBillingModal={onOpenBillingModal}
            onOpenPartiesModal={onOpenPartiesModal}
            onOpenReportsModal={onOpenReportsModal}
          />
        ))}

        <div ref={endRef} className="h-4" />
      </div>
    </div>
  );
}
