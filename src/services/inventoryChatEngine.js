// Natural language and command parsing engine for conversational inventory management

export function parseAndExecuteChatCommand(text, items, actions) {
  const { addItem, updateStock, getLowStockItems, clearChat, showStockAlert, customers } = actions;
  const lower = text.trim().toLowerCase();

  // 1. Check for help command
  if (lower === '/help' || lower === 'help' || lower === '?') {
    return {
      text: `🤖 **ChatStock AI — Complete Conversational ERP Cheat Sheet:**\n\n` +
            `• **Conversational Instant Billing:** \`sell 2 AirPods Pro to Aarav Sharma\` or \`- 2 AirPods Pro to 9876543210\`\n` +
            `• **Conversational Purchase Billing:** \`buy 10 AirPods Pro from TechCorp\` or \`+ 10 AirPods Pro from Supplier\`\n` +
            `• **Create Sale Bill / POS Invoice:** \`/bill\` or \`/sell\`\n` +
            `• **Record Stock Purchase Bill:** \`/purchase\` or \`/buy\`\n` +
            `• **Customer & Supplier Directory:** \`/parties\` or \`/customers\`\n` +
            `• **Business Profit & Loss Report:** \`/reports\` or \`/profit\`\n` +
            `• **Create New Stock Item:** \`/add\` (interactive SKU registration card)\n` +
            `• **Check Low Stock Report:** \`/low\` or \`/alert\`\n` +
            `• **View Portfolio Valuation:** \`/stats\` or \`/summary\`\n` +
            `• **View Complete Catalog:** \`/list\` or \`/all\`\n` +
            `• **Clear Chat Screen:** \`/clear\``,
      widget: {
        type: 'QUICK_TIPS',
        tips: [
          { cmd: 'sell 2 AirPods Pro to Aarav Sharma', desc: 'Test Conversational Instant Billing command' },
          { cmd: 'sell 1 Sony WH-1000XM5 to 9876543210', desc: 'Bill to customer by phone or register new party' },
          { cmd: '/parties', desc: 'Inspect customer and supplier ledgers' },
          { cmd: '/reports', desc: 'View Business analytics & financial summary' }
        ]
      }
    };
  }

  // 2. Check for clear command
  if (lower === '/clear' || lower === 'clear') {
    clearChat();
    return {
      text: `✨ Chat history cleared.`
    };
  }

  // 3. Check for Conversational SELL/BILL command with Party: "sell|- <qty> <item> to|for <party>"
  // Examples: "sell 2 AirPods Pro to Aarav Sharma", "- 2 AirPods Pro to 9876543210", "sell 1 Sony XM5 to Rahul"
  const conversationalSellRegex = /^(sell|sold|-|bill)\s+(\d+)\s+(.+?)\s+(to|for)\s+(.+)$/i;
  const sellMatch = text.match(conversationalSellRegex);
  if (sellMatch) {
    const qty = parseInt(sellMatch[2], 10);
    const itemQuery = sellMatch[3].trim();
    const partyInput = sellMatch[5].trim();

    const targetItem = findMatchingItem(items, itemQuery);
    if (!targetItem) {
      return {
        text: `❌ Could not find any inventory item matching **"${itemQuery}"**.\n\nPlease check the item name or SKU from your catalog first.`
      };
    }

    // Check overselling warning
    if (qty > targetItem.quantity) {
      if (showStockAlert) {
        showStockAlert(
          `⚠️ Insufficient Stock Alert!`,
          `Cannot sell ${qty} ${targetItem.unit} of "${targetItem.name}". Only approx ${targetItem.quantity} ${targetItem.unit} available in stock.`
        );
      }
      return {
        text: `⚠️ **Stock Validation Warning (Jyada Stock Nahi Hai!)**\n\nAap **-${qty} ${targetItem.unit || 'pcs'}** sell karna chahte hain, lekin **${targetItem.name}** me sirf **${targetItem.quantity} ${targetItem.unit || 'pcs'}** available hain!`,
        widget: {
          type: 'OVERSELL_ALERT',
          itemId: targetItem.id,
          requestedQty: qty,
          availableQty: targetItem.quantity
        }
      };
    }

    // Check if customer exists in directory
    const foundParty = findMatchingParty(customers, partyInput);
    if (foundParty) {
      return {
        text: `⚡ **Instant Sale Billing Ready for "${foundParty.name}"**\n\nVerify details below and click **Confirm & Generate Tax Invoice** to automatically minus stock and open your printable A4 bill:`,
        widget: {
          type: 'INSTANT_BILL_CONFIRM',
          billType: 'SALE',
          party: foundParty,
          item: targetItem,
          qty
        }
      };
    } else {
      // Unregistered party -> trigger inline party creation & immediate billing card
      return {
        text: `👤 **Customer/Party "${partyInput}" Directory Me Registered Nahi Hai!**\n\nNiche customer ka naam / mobile number verify karein aur **Save Party & Generate Bill Now** dabayein jisse party register hoke turant bill generate ho jaye:`,
        widget: {
          type: 'UNREGISTERED_PARTY_BILL',
          billType: 'SALE',
          partyInput,
          item: targetItem,
          qty
        }
      };
    }
  }

  // 4. Check for Conversational BUY/PURCHASE command with Supplier: "buy|+ <qty> <item> from|by|to|for|se <supplier>"
  const conversationalBuyRegex = /^(buy|purchase|bought|\+)\s+(\d+)\s+(.+?)\s+(?:from|by|to|for|se)\s+(.+)$/i;
  const buyMatch = text.match(conversationalBuyRegex);
  if (buyMatch) {
    const qty = parseInt(buyMatch[2], 10);
    const itemQuery = buyMatch[3].trim();
    const partyInput = buyMatch[4].trim();

    const targetItem = findMatchingItem(items, itemQuery);
    if (!targetItem) {
      return {
        text: `❌ Could not find any inventory item matching **"${itemQuery}"** for purchase entry.`
      };
    }

    const foundParty = findMatchingParty(customers, partyInput);
    if (foundParty) {
      return {
        text: `📥 **Instant Purchase Bill Ready from "${foundParty.name}"**\n\nVerify details below and click **Confirm Purchase & Restock** to automatically add +${qty} units to stock:`,
        widget: {
          type: 'INSTANT_BILL_CONFIRM',
          billType: 'PURCHASE',
          party: foundParty,
          item: targetItem,
          qty
        }
      };
    } else {
      return {
        text: `🏢 **Supplier/Party "${partyInput}" Directory Me Registered Nahi Hai!**\n\nNiche supplier details save karein aur turant purchase invoice record karein:`,
        widget: {
          type: 'UNREGISTERED_PARTY_BILL',
          billType: 'PURCHASE',
          partyInput,
          item: targetItem,
          qty
        }
      };
    }
  }

  // 5. Check for /bill or /sell or /invoice
  if (lower === '/bill' || lower === '/sell' || lower === '/invoice' || lower === 'bill' || lower === 'invoice') {
    return {
      text: `🧾 **POS Billing & Invoice Generator Ready!**\n\nClick the button below or use **New Sell Bill** in the top header to generate a tax invoice and deduct sold stock automatically.`,
      widget: {
        type: 'QUICK_TIPS',
        tips: [
          { cmd: 'sell 2 AirPods Pro to Aarav Sharma', desc: 'Try Conversational Billing command' },
          { cmd: '/parties', desc: 'Manage saved customer directory' }
        ]
      }
    };
  }

  // 6. Check for /purchase or /buy
  if (lower === '/purchase' || lower === '/buy' || lower === 'purchase') {
    return {
      text: `📥 **Stock Purchase Entry Ready!**\n\nUse natural command like \`buy 15 AirPods Pro from TechCorp\` or the **Purchase Entry** button in the top header to record invoices and restock items.`,
      widget: {
        type: 'QUICK_TIPS',
        tips: [
          { cmd: 'buy 10 AirPods Pro from TechCorp', desc: 'Try Conversational Purchase command' }
        ]
      }
    };
  }

  // 7. Check for /parties or /customers or /suppliers
  if (lower === '/parties' || lower === '/customers' || lower === '/suppliers' || lower === 'parties' || lower === 'customers') {
    return {
      text: `👥 **Parties Directory & Ledger Management:**\n\nYou can inspect saved customers, suppliers, and their transaction histories directly below:`,
      widget: {
        type: 'PARTIES_WIDGET'
      }
    };
  }

  // 8. Check for /reports or /profit or /analytics
  if (lower === '/reports' || lower === '/report' || lower === '/profit' || lower === '/analytics' || lower === 'report') {
    return {
      text: `📊 **Enterprise Financial Analytics & Profit/Loss Audit:**`,
      widget: {
        type: 'REPORTS_WIDGET'
      }
    };
  }

  // 9. Check for /add or "add item" or "new item"
  if (lower === '/add' || lower === 'add item' || lower === 'new item' || lower === 'create item') {
    return {
      text: `📝 Please fill out the interactive SKU registration card below to add a new product to your inventory:`,
      widget: {
        type: 'NEW_ITEM_FORM'
      }
    };
  }

  // 10. Check for /low or /alerts or "low stock"
  if (lower === '/low' || lower === '/alerts' || lower === 'low stock' || lower === 'check low stock') {
    const lowItems = getLowStockItems();
    if (lowItems.length === 0) {
      return {
        text: `✅ **Great news!** All stock levels are currently healthy and above their reorder alert thresholds.`,
        widget: {
          type: 'VALUATION_STATS'
        }
      };
    }
    return {
      text: `⚠️ Found **${lowItems.length} item(s)** requiring attention (Low Stock or Out of Stock):`,
      widget: {
        type: 'LOW_STOCK_TABLE',
        itemsFilter: 'NEEDS_ATTENTION'
      }
    };
  }

  // 11. Check for /stats or /summary or "valuation"
  if (lower === '/stats' || lower === '/summary' || lower === 'valuation' || lower === 'stats') {
    return {
      text: `📊 **Live Inventory Financial Valuation & Health Metrics:**`,
      widget: {
        type: 'VALUATION_STATS'
      }
    };
  }

  // 12. Check for /list or /all or "show all" or "list items"
  if (lower === '/list' || lower === '/all' || lower === 'show all' || lower === 'list items' || lower === 'inventory') {
    return {
      text: `📦 **Complete Inventory Catalog Overview (${items.length} SKUs total):**`,
      widget: {
        type: 'FULL_INVENTORY_TABLE'
      }
    };
  }

  // 13. Check for "+ <qty> <query>" or "add <qty> <query>" (Stock In without party)
  const plusRegex = /^([+]|add|restock|in)\s+(\d+)\s+(.+)$/i;
  const plusMatch = text.match(plusRegex);
  if (plusMatch) {
    const qty = parseInt(plusMatch[2], 10);
    const query = plusMatch[3].trim();
    
    const targetItem = findMatchingItem(items, query);
    if (targetItem) {
      const updated = updateStock(targetItem.id, targetItem.quantity + qty);
      return {
        text: `✅ **Stock In Recorded!** Added **+${qty} ${targetItem.unit || 'pcs'}** to **${targetItem.name}**.\n\nNew Total Stock: **${targetItem.quantity + qty} ${targetItem.unit || 'pcs'}**`,
        widget: {
          type: 'ITEM_CARD',
          itemId: targetItem.id
        }
      };
    } else {
      return {
        text: `❓ Could not find an existing inventory item matching **"${query}"**.\n\nWould you like to register **"${query}"** as a new SKU with initial quantity **${qty}**?`,
        widget: {
          type: 'NEW_ITEM_FORM',
          initialData: { name: query, quantity: qty }
        }
      };
    }
  }

  // 14. Check for "- <qty> <query>" or "remove <qty> <query>" (Stock Out without party)
  const minusRegex = /^([-]|remove|out|sell|sold)\s+(\d+)\s+(.+)$/i;
  const minusMatch = text.match(minusRegex);
  if (minusMatch) {
    const qty = parseInt(minusMatch[2], 10);
    const query = minusMatch[3].trim();

    const targetItem = findMatchingItem(items, query);
    if (targetItem) {
      if (qty > targetItem.quantity) {
        if (showStockAlert) {
          showStockAlert(
            `⚠️ Insufficient Stock Alert!`,
            `Cannot sell ${qty} ${targetItem.unit} of "${targetItem.name}". Only approx ${targetItem.quantity} ${targetItem.unit} available in stock.`
          );
        }

        return {
          text: `⚠️ **Insufficient Stock Validation Alert!**\n\nAap **-${qty} ${targetItem.unit || 'pcs'}** remove karna chahte hain, lekin **${targetItem.name}** me sirf **${targetItem.quantity} ${targetItem.unit || 'pcs'}** available hain!`,
          widget: {
            type: 'OVERSELL_ALERT',
            itemId: targetItem.id,
            requestedQty: qty,
            availableQty: targetItem.quantity
          }
        };
      }

      const newQty = Math.max(0, targetItem.quantity - qty);
      const updated = updateStock(targetItem.id, newQty);
      return {
        text: `📤 **Stock Out Recorded!** Removed **-${qty} ${targetItem.unit || 'pcs'}** from **${targetItem.name}**.\n\nRemaining Stock: **${newQty} ${targetItem.unit || 'pcs'}**`,
        widget: {
          type: 'ITEM_CARD',
          itemId: targetItem.id
        }
      };
    } else {
      return {
        text: `❌ Could not find an existing stock item matching **"${query}"** to reduce stock.`
      };
    }
  }

  // 15. Check for "check <query>" or "search <query>"
  const searchRegex = /^(search|find|check|sku|stock of|how many)\s+(.+)$/i;
  const searchMatch = text.match(searchRegex);
  const searchTerm = searchMatch ? searchMatch[2] : text;

  const matches = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (matches.length === 1) {
    const found = matches[0];
    return {
      text: `🔍 Found exact match for **"${found.name}"** (\`${found.sku}\`):`,
      widget: {
        type: 'ITEM_CARD',
        itemId: found.id
      }
    };
  } else if (matches.length > 1) {
    return {
      text: `🔍 Found **${matches.length} matching items** for **"${searchTerm}"**:`,
      widget: {
        type: 'SEARCH_RESULTS_TABLE',
        matchIds: matches.map(m => m.id)
      }
    };
  }

  // 16. Fallback natural conversation response
  return {
    text: `🤖 I understood your query **"${text}"**.\n\nYou can use conversational commands like:\n- \`sell 2 AirPods Pro to Aarav Sharma\`\n- \`sell 1 Sony WH-1000XM5 to 9876543210\`\n- \`buy 10 Keychron Keyboard from TechCorp\`\n- \`/parties\` to inspect customer ledger\n- \`/reports\` to view Profit & Loss`,
    widget: {
      type: 'QUICK_TIPS',
      tips: [
        { cmd: 'sell 2 AirPods Pro to Aarav Sharma', desc: 'Conversational Sale to registered party' },
        { cmd: 'sell 1 Sony WH-1000XM5 to 9876543210', desc: 'Conversational Sale by phone number' },
        { cmd: '/bill', desc: 'Create a customer Sales POS invoice modal' },
        { cmd: '/parties', desc: 'Inspect Customers and Suppliers directory' }
      ]
    }
  };
}

function findMatchingItem(items, query) {
  const q = query.toLowerCase();
  const skuMatch = items.find(i => i.sku.toLowerCase() === q);
  if (skuMatch) return skuMatch;

  const nameMatch = items.find(i => i.name.toLowerCase() === q);
  if (nameMatch) return nameMatch;

  const subMatch = items.find(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
  return subMatch || null;
}

function findMatchingParty(customers = [], query = '') {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  // 1. Check exact name match
  const exactName = customers.find(c => c.name.toLowerCase() === q);
  if (exactName) return exactName;

  // 2. Check phone match (e.g., user typed "9876543210" and phone contains it)
  const phoneMatch = customers.find(c => c.phone && c.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) && q.replace(/[^0-9]/g, '').length >= 5);
  if (phoneMatch) return phoneMatch;

  // 3. Check substring name match
  const subName = customers.find(c => c.name.toLowerCase().includes(q));
  return subName || null;
}
