import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_INVENTORY_ITEMS, INITIAL_CATEGORIES, INITIAL_WELCOME_MESSAGES } from '../data/sampleInventory';
import { parseAndExecuteChatCommand } from '../services/inventoryChatEngine';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

// Web Audio API high-tech UI feedback sounds
const playSoundEffect = (type = 'click', soundEnabled = true) => {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'add') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'remove') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(293.66, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(329.63, ctx.currentTime);
      osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    }
  } catch (err) {
    // Audio context might be restricted before user interaction
  }
};

export const InventoryProvider = ({ children }) => {
  const [theme] = useState('light');

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('chatstock_items');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY_ITEMS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('chatstock_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatstock_messages');
    return saved ? JSON.parse(saved) : INITIAL_WELCOME_MESSAGES;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('chatstock_transactions');
    return saved ? JSON.parse(saved) : [
      { id: 'tx-1', type: 'RESTOCK', title: 'Received +14 MacBook Pro 16"', time: '2h ago', sku: 'SKU-MBP-16M3' },
      { id: 'tx-2', type: 'DISPATCH', title: 'Sold -2 Apple AirPods Pro', time: '3h ago', sku: 'SKU-APP-2ND' }
    ];
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('chatstock_bills');
    return saved ? JSON.parse(saved) : [
      {
        id: 'INV-1001',
        type: 'SALE',
        partyName: 'Aarav Sharma',
        phone: '+91 98765 43210',
        email: 'aarav.sharma@example.com',
        address: 'Sector 18, Noida, UP',
        date: new Date().toISOString(),
        itemsList: [
          { itemId: 'sku-sony-xm5', name: 'Sony WH-1000XM5 Wireless Headphones', sku: 'SKU-SONY-XM5', qty: 2, price: 349, subtotal: 698 }
        ],
        subtotal: 698,
        taxRate: 18,
        taxAmount: 125.64,
        discount: 0,
        totalAmount: 823.64,
        status: 'PAID'
      }
    ];
  });

  // Saved Customers & Suppliers Directory
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('chatstock_customers');
    return saved ? JSON.parse(saved) : [
      { id: 'cust-1', name: 'Aarav Sharma', phone: '+91 98765 43210', email: 'aarav@example.com', address: 'Noida, UP', type: 'CUSTOMER' },
      { id: 'cust-2', name: 'Priya Verma', phone: '+91 91234 56789', email: 'priya.v@example.com', address: 'Mumbai, MH', type: 'CUSTOMER' },
      { id: 'supp-1', name: 'TechCorp Supplier Ltd.', phone: '+91 11 4000 8000', email: 'orders@techcorp.in', address: 'Okhla Ind. Area, Delhi', type: 'SUPPLIER' }
    ];
  });

  // Active full page invoice view state
  const [activeInvoiceBill, setActiveInvoiceBill] = useState(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Floating Toast / Alert Notification State
  const [alertNotification, setAlertNotification] = useState(null);

  const showStockAlert = useCallback((title, message, type = 'warning') => {
    playSoundEffect('alert', soundEnabled);
    setAlertNotification({ id: Date.now(), title, message, type });
  }, [soundEnabled]);

  const closeStockAlert = useCallback(() => {
    setAlertNotification(null);
  }, []);

  useEffect(() => {
    if (alertNotification) {
      const timer = setTimeout(() => {
        setAlertNotification(null);
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [alertNotification]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('chatstock_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('chatstock_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('chatstock_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatstock_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('chatstock_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('chatstock_customers', JSON.stringify(customers));
  }, [customers]);

  const calculateStatus = (quantity, minStock) => {
    if (quantity <= 0) return 'OUT_OF_STOCK';
    if (quantity <= minStock) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  const getLowStockItems = useCallback(() => {
    return items.filter(item => item.quantity <= item.minStock);
  }, [items]);

  const addItem = (newItemData) => {
    playSoundEffect('success', soundEnabled);
    const id = `sku-${Date.now()}`;
    const quantity = Number(newItemData.quantity || 0);
    const minStock = Number(newItemData.minStock || 5);
    const price = Number(newItemData.price || 0);

    const newItem = {
      id,
      sku: (newItemData.sku || `SKU-${newItemData.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`).toUpperCase(),
      name: newItemData.name || 'Untitled Stock Item',
      category: newItemData.category || 'Electronics',
      quantity,
      minStock,
      price,
      unit: newItemData.unit || 'pcs',
      location: newItemData.location || 'Main Warehouse',
      lastUpdated: new Date().toISOString(),
      status: calculateStatus(quantity, minStock)
    };

    setItems(prev => [newItem, ...prev]);

    if (!categories.includes(newItem.category)) {
      setCategories(prev => [...prev, newItem.category]);
    }

    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'CREATE',
        title: `Created new SKU "${newItem.name}" (${quantity} ${newItem.unit})`,
        time: 'Just now',
        sku: newItem.sku
      },
      ...prev.slice(0, 30)
    ]);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 }
    });

    return newItem;
  };

  const addCustomer = (customerData) => {
    playSoundEffect('success', soundEnabled);
    const newCust = {
      id: `cust-${Date.now()}`,
      name: customerData.name || 'New Party',
      phone: customerData.phone || '',
      email: customerData.email || '',
      address: customerData.address || '',
      type: customerData.type || 'CUSTOMER'
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateStock = (itemId, newQuantity) => {
    const qty = Math.max(0, Number(newQuantity));
    let updatedItem = null;

    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const prevQty = item.quantity;
        updatedItem = {
          ...item,
          quantity: qty,
          lastUpdated: new Date().toISOString(),
          status: calculateStatus(qty, item.minStock)
        };

        if (qty > prevQty) {
          playSoundEffect('add', soundEnabled);
        } else if (qty < prevQty) {
          playSoundEffect('remove', soundEnabled);
        }

        return updatedItem;
      }
      return item;
    }));

    if (updatedItem) {
      setTransactions(prev => [
        {
          id: `tx-${Date.now()}`,
          type: qty > 0 ? 'UPDATE' : 'OUT_OF_STOCK',
          title: `Updated "${updatedItem.name}" to ${qty} ${updatedItem.unit}`,
          time: 'Just now',
          sku: updatedItem.sku
        },
        ...prev.slice(0, 30)
      ]);
    }

    return updatedItem;
  };

  // Create & Process a Sale Invoice or Purchase Bill with 100% Reliable Stock Deduction/Addition
  const createBill = (billData) => {
    playSoundEffect('success', soundEnabled);

    const billId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBill = {
      id: billId,
      type: billData.type || 'SALE',
      partyName: billData.partyName || (billData.type === 'PURCHASE' ? 'Supplier Vendor' : 'Retail Customer'),
      phone: billData.phone || '',
      email: billData.email || '',
      address: billData.address || '',
      date: new Date().toISOString(),
      itemsList: billData.itemsList || [],
      subtotal: Number(billData.subtotal || 0),
      taxRate: Number(billData.taxRate || 18),
      taxAmount: Number(billData.taxAmount || 0),
      discount: Number(billData.discount || 0),
      totalAmount: Number(billData.totalAmount || 0),
      status: 'PAID'
    };

    // Accurately update inventory stock for every line item in the bill
    setItems(prevItems => {
      let updatedList = [...prevItems];

      newBill.itemsList.forEach(billedRow => {
        updatedList = updatedList.map(item => {
          if (item.id === billedRow.itemId || item.sku === billedRow.sku) {
            const delta = newBill.type === 'SALE' ? -Number(billedRow.qty) : Number(billedRow.qty);
            const nextQty = Math.max(0, item.quantity + delta);

            return {
              ...item,
              quantity: nextQty,
              lastUpdated: new Date().toISOString(),
              status: calculateStatus(nextQty, item.minStock)
            };
          }
          return item;
        });
      });

      return updatedList;
    });

    setBills(prev => [newBill, ...prev]);

    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: newBill.type === 'SALE' ? 'SALE_BILL' : 'PURCHASE_BILL',
        title: `${newBill.type === 'SALE' ? 'Sold' : 'Purchased'} ${newBill.itemsList.length} item(s) (${newBill.id}) - $${newBill.totalAmount}`,
        time: 'Just now',
        sku: newBill.partyName
      },
      ...prev.slice(0, 30)
    ]);

    // Add receipt directly into chat stream
    setMessages(prev => [
      ...prev,
      {
        id: `msg-bill-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: `🧾 **${newBill.type === 'SALE' ? 'Sales Invoice Generated' : 'Purchase Bill Recorded'} (${newBill.id})**\nParty: **${newBill.partyName}** • Total: **$${newBill.totalAmount.toLocaleString()}**`,
        widget: {
          type: 'BILL_RECEIPT_CARD',
          billId: newBill.id
        }
      }
    ]);

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 }
    });

    return newBill;
  };

  const editItemDetails = (itemId, updatedFields) => {
    playSoundEffect('success', soundEnabled);
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const qty = Number(updatedFields.quantity ?? item.quantity);
        const min = Number(updatedFields.minStock ?? item.minStock);
        return {
          ...item,
          ...updatedFields,
          quantity: qty,
          minStock: min,
          lastUpdated: new Date().toISOString(),
          status: calculateStatus(qty, min)
        };
      }
      return item;
    }));
  };

  const deleteItem = (itemId) => {
    playSoundEffect('remove', soundEnabled);
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const sendChatMessage = (userInput) => {
    if (!userInput || !userInput.trim()) return;

    playSoundEffect('click', soundEnabled);

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: userInput
    };

    const response = parseAndExecuteChatCommand(userInput, items, {
      addItem,
      updateStock,
      getLowStockItems,
      clearChat: () => setMessages([]),
      showStockAlert,
      customers,
      addCustomer
    });

    const assistantMsg = {
      id: `msg-assistant-${Date.now() + 1}`,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      text: response.text,
      widget: response.widget || null
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: '✨ Conversation history cleared. Ask me anything about your stock or type `/help` for commands!'
      }
    ]);
  };

  const resetDemo = () => {
    setItems(INITIAL_INVENTORY_ITEMS);
    setCategories(INITIAL_CATEGORIES);
    setMessages(INITIAL_WELCOME_MESSAGES);
    localStorage.removeItem('chatstock_items');
    localStorage.removeItem('chatstock_categories');
    localStorage.removeItem('chatstock_messages');
    localStorage.removeItem('chatstock_bills');
    localStorage.removeItem('chatstock_customers');
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `chatstock-inventory-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Quantity', 'Min Stock', 'Unit Price ($)', 'Total Value ($)', 'Status', 'Location'];
    const rows = items.map(item => [
      item.sku,
      `"${item.name.replace(/"/g, '""')}"`,
      item.category,
      item.quantity,
      item.minStock,
      item.price,
      item.quantity * item.price,
      item.status,
      `"${(item.location || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chatstock-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const totalItems = items.length;
  const totalUnits = items.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
  const totalValuation = items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
  const lowStockCount = items.filter(i => i.quantity <= i.minStock && i.quantity > 0).length;
  const outOfStockCount = items.filter(i => i.quantity <= 0).length;

  return (
    <InventoryContext.Provider
      value={{
        theme,
        items,
        categories,
        messages,
        transactions,
        bills,
        customers,
        addCustomer,
        activeInvoiceBill,
        setActiveInvoiceBill,
        soundEnabled,
        setSoundEnabled,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        alertNotification,
        showStockAlert,
        closeStockAlert,
        addItem,
        updateStock,
        createBill,
        editItemDetails,
        deleteItem,
        sendChatMessage,
        clearChat,
        resetDemo,
        exportJSON,
        exportCSV,
        getLowStockItems,
        totalItems,
        totalUnits,
        totalValuation,
        lowStockCount,
        outOfStockCount
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
