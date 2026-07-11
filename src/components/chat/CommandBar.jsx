import React, { useState, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  AlertTriangle, 
  BarChart3, 
  PackagePlus,
  PackageCheck,
  Mic,
  ArrowRight,
  Receipt,
  ShoppingCart,
  Truck,
  Users,
  ChevronUp,
  ChevronDown,
  FileText
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

const EASY_ACTION_CARDS = [
  {
    cmd: 'sell 2 AirPods Pro to Aarav Sharma',
    title: '⚡ Chat Express Sale',
    subtitle: 'Sell to Registered Customer',
    icon: ShoppingCart,
    bgClass: 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100'
  },
  {
    cmd: 'buy 10 AirPods Pro from TechCorp',
    title: '📥 Chat Express Buy',
    subtitle: 'Restock / Purchase Command',
    icon: Truck,
    bgClass: 'bg-indigo-50 border-indigo-300 text-indigo-900 hover:bg-indigo-100'
  },
  {
    cmd: 'sell 1 Sony WH-1000XM5 to 9876543210',
    title: '📱 Sell by Phone No.',
    subtitle: 'Auto-Create Party Modal',
    icon: Users,
    bgClass: 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
  },
  {
    cmd: '/bill',
    title: '🧾 POS Invoice Modal',
    subtitle: 'Open Full Billing Window',
    icon: Receipt,
    bgClass: 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
  },
  {
    cmd: '/gst',
    title: '📊 GST Compliance Suite',
    subtitle: 'GSTR-1, GSTR-3B & Tax Report',
    icon: FileText,
    bgClass: 'bg-teal-50 border-teal-300 text-teal-900 hover:bg-teal-100'
  }
];

export default function CommandBar() {
  const { sendChatMessage } = useInventory();
  const [input, setInput] = useState('');
  const [activeCmdIdx, setActiveCmdIdx] = useState(0);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    sendChatMessage(input);
    setInput('');
  };

  const handlePrevCommand = () => {
    setActiveCmdIdx((prev) => (prev - 1 + EASY_ACTION_CARDS.length) % EASY_ACTION_CARDS.length);
  };

  const handleNextCommand = () => {
    setActiveCmdIdx((prev) => (prev + 1) % EASY_ACTION_CARDS.length);
  };

  const currentMobileCard = EASY_ACTION_CARDS[activeCmdIdx];
  const MobileIcon = currentMobileCard.icon;

  return (
    <div className="shrink-0 w-full border-t border-slate-200 bg-white p-2 sm:p-4 shadow-lg z-30">
      <div className="max-w-4xl mx-auto space-y-2.5 sm:space-y-3">
        
        {/* Beginner Friendly Action Launcher Cards - Horizontal Scrollable on ALL screens ("responsive me aur big screen me scrollable rakho taaki chat screen jyda choti na ho") */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
              <span>Easy Conversational Commands</span>
              <span className="text-[10px] font-normal text-slate-400 hidden sm:inline">(Scroll horizontally →)</span>
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">
              {EASY_ACTION_CARDS.length} Quick Actions
            </span>
          </div>

          {/* SINGLE COMPACT HORIZONTAL SCROLLABLE ROW ON ALL SCREENS */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 snap-x scroll-smooth w-full">
            {EASY_ACTION_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendChatMessage(card.cmd)}
                  className={`shrink-0 w-52 sm:w-60 snap-start text-left p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95 flex flex-col justify-between ${card.bgClass}`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="p-1.5 rounded-xl bg-white/80 shrink-0 shadow-2xs">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-extrabold truncate">{card.title}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] opacity-85 truncate mt-0.5 font-mono">{card.cmd}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Friendly Command Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command (e.g. 'sell 2 AirPods Pro to Rahul')..."
            className="w-full rounded-2xl bg-slate-100 border border-slate-300 pl-3.5 sm:pl-5 pr-20 sm:pr-48 py-2.5 sm:py-3.5 text-[16px] sm:text-sm text-slate-900 placeholder:text-xs sm:placeholder:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner font-medium"
          />

          <div className="absolute right-1.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setInput('buy 10 AirPods Pro from TechCorp')}
              title="Test purchase command"
              className="px-2.5 py-1.5 rounded-xl bg-indigo-100 text-indigo-900 hover:bg-indigo-200 transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Test Buy</span>
            </button>

            <button
              type="button"
              onClick={() => setInput('sell 1 AirPods Pro to 9876543210')}
              title="Test phone number billing command"
              className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 hover:text-cyan-700 transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Test Phone</span>
            </button>

            <button
              type="submit"
              disabled={!input.trim()}
              className="flex items-center justify-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 text-xs font-bold text-white shadow-md transition-all shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
