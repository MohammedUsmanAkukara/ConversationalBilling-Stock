export const INITIAL_INVENTORY_ITEMS = [
  {
    id: 'sku-mbp-m3',
    sku: 'SKU-MBP-16M3',
    name: 'MacBook Pro 16" (M3 Max, 36GB RAM)',
    category: 'Electronics',
    quantity: 14,
    minStock: 5,
    price: 3499,
    unit: 'pcs',
    location: 'Warehouse A - Bay 1',
    lastUpdated: '2026-07-08T10:15:00.000Z',
    status: 'IN_STOCK'
  },
  {
    id: 'sku-airpods-2',
    sku: 'SKU-APP-2ND',
    name: 'Apple AirPods Pro (2nd Gen, USB-C)',
    category: 'Electronics',
    quantity: 4,
    minStock: 10,
    price: 249,
    unit: 'pcs',
    location: 'Storefront Display',
    lastUpdated: '2026-07-08T09:30:00.000Z',
    status: 'LOW_STOCK'
  },
  {
    id: 'sku-keychron-k2',
    sku: 'SKU-KEY-K2PRO',
    name: 'Keychron K2 Pro Mechanical Keyboard',
    category: 'Peripherals',
    quantity: 28,
    minStock: 8,
    price: 119,
    unit: 'pcs',
    location: 'Warehouse B - Shelf 4',
    lastUpdated: '2026-07-07T16:20:00.000Z',
    status: 'IN_STOCK'
  },
  {
    id: 'sku-lg-4k-27',
    sku: 'SKU-DIS-LG274K',
    name: 'LG UltraFine 27" 4K IPS UHD Monitor',
    category: 'Electronics',
    quantity: 0,
    minStock: 4,
    price: 499,
    unit: 'pcs',
    location: 'Warehouse A - Bay 3',
    lastUpdated: '2026-07-06T14:10:00.000Z',
    status: 'OUT_OF_STOCK'
  },
  {
    id: 'sku-anker-hub',
    sku: 'SKU-ANK-HUB10',
    name: 'Anker Prime 10-in-1 USB-C Docking Station',
    category: 'Accessories',
    quantity: 35,
    minStock: 12,
    price: 179,
    unit: 'pcs',
    location: 'Warehouse B - Shelf 2',
    lastUpdated: '2026-07-08T11:00:00.000Z',
    status: 'IN_STOCK'
  },
  {
    id: 'sku-logi-mx3s',
    sku: 'SKU-LOG-MX3S',
    name: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Peripherals',
    quantity: 6,
    minStock: 10,
    price: 99,
    unit: 'pcs',
    location: 'Storefront Display',
    lastUpdated: '2026-07-07T12:45:00.000Z',
    status: 'LOW_STOCK'
  },
  {
    id: 'sku-cisco-switch',
    sku: 'SKU-NET-CS24P',
    name: 'Cisco Catalyst 24-Port Gigabit PoE Switch',
    category: 'Networking',
    quantity: 9,
    minStock: 3,
    price: 849,
    unit: 'pcs',
    location: 'Server Room Rack 2',
    lastUpdated: '2026-07-05T09:00:00.000Z',
    status: 'IN_STOCK'
  }
];

export const INITIAL_CATEGORIES = [
  'All',
  'Electronics',
  'Peripherals',
  'Accessories',
  'Networking',
  'Hardware'
];

export const INITIAL_WELCOME_MESSAGES = [
  {
    id: 'msg-welcome-1',
    sender: 'assistant',
    timestamp: new Date().toISOString(),
    text: `👋 **Welcome to ChatStock AI Command Center!**\n\nI am your conversational inventory co-pilot. You can manage your stock by typing natural language or slash commands below, or click any interactive quick action!`,
    widget: {
      type: 'QUICK_TIPS',
      tips: [
        { cmd: '+ 20 AirPods Pro', desc: 'Quickly restock +20 units to AirPods Pro' },
        { cmd: 'add 15 Sony WH-1000XM5 @ $399 sku SKU-SONY-M5', desc: 'Create a brand new SKU natural language style' },
        { cmd: '/low', desc: 'Show all items below minimum stock threshold' },
        { cmd: '/stats', desc: 'View live inventory valuation and analytics' }
      ]
    }
  },
  {
    id: 'msg-welcome-2',
    sender: 'assistant',
    timestamp: new Date().toISOString(),
    text: `🚨 **Immediate Action Needed:** We detected **2 Low Stock items** and **1 Out of Stock item** in your catalog. You can restock directly from the interactive alert widget below:`,
    widget: {
      type: 'LOW_STOCK_TABLE',
      itemsFilter: 'NEEDS_ATTENTION'
    }
  }
];
