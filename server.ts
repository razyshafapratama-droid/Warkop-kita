import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface DbSchema {
  products: any[];
  transactions: any[];
  settings: any;
  users: any[];
}

// Initial fallback seed for Warkop Kita
const defaultProducts = [
  { id: 'prod-1', name: 'Kopi Hitam', category: 'Kopi', description: 'Kopi robusta pilihan, nikmat dan pekat', price: 8000, cost: 4000, stock: 50, unit: 'cup', barcode: 'WK-001', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-2', name: 'Kopi Susu', category: 'Kopi', description: 'Perpaduan kopi dan susu berkualitas', price: 10000, cost: 5500, stock: 45, unit: 'cup', barcode: 'WK-002', image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-3', name: 'Americano', category: 'Kopi', description: 'Kopi hitam dengan rasa ringan', price: 9000, cost: 4500, stock: 40, unit: 'cup', barcode: 'WK-003', image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-4', name: 'Cappuccino', category: 'Kopi', description: 'Espresso, susu, dan foam lembut', price: 12000, cost: 6500, stock: 35, unit: 'cup', barcode: 'WK-004', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-5', name: 'Latte', category: 'Kopi', description: 'Rasa lembut, aroma khas', price: 13000, cost: 7000, stock: 30, unit: 'cup', barcode: 'WK-005', image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-6', name: 'Mochaccino', category: 'Kopi', description: 'Cokelat berpadu dengan kopi dan susu', price: 14000, cost: 7500, stock: 25, unit: 'cup', barcode: 'WK-006', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-7', name: 'Matcha Latte', category: 'Non Kopi', description: 'Teh hijau premium dengan susu', price: 13000, cost: 7000, stock: 28, unit: 'cup', barcode: 'WK-007', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-8', name: 'Es Teh Manis', category: 'Teh', description: 'Segar dan menyegarkan', price: 5000, cost: 2000, stock: 80, unit: 'cup', barcode: 'WK-008', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-9', name: 'Es Cokelat', category: 'Non Kopi', description: 'Cokelat premium rasa autentik', price: 12000, cost: 6000, stock: 30, unit: 'cup', barcode: 'WK-009', image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-10', name: 'Susu Cokelat', category: 'Susu', description: 'Perpaduan susu dan cokelat', price: 10000, cost: 5000, stock: 35, unit: 'cup', barcode: 'WK-010', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-11', name: 'Taro Latte', category: 'Non Kopi', description: 'Rasa taro yang creamy', price: 13000, cost: 7000, stock: 22, unit: 'cup', barcode: 'WK-011', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-12', name: 'Roti Bakar', category: 'Camilan', description: 'Roti dengan topping pilihan', price: 12000, cost: 6000, stock: 40, unit: 'porsi', barcode: 'WK-012', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-13', name: 'Pisang Goreng Keju', category: 'Camilan', description: 'Pisang renyah topping keju susu', price: 12000, cost: 5500, stock: 25, unit: 'porsi', barcode: 'WK-013', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-14', name: 'Kentang Goreng', category: 'Camilan', description: 'French fries garing gurih', price: 11000, cost: 5000, stock: 30, unit: 'porsi', barcode: 'WK-014', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-15', name: 'Indomie Goreng Telur', category: 'Makanan', description: 'Indomie warkop dengan telur ceplok', price: 10000, cost: 5500, stock: 50, unit: 'porsi', barcode: 'WK-015', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-16', name: 'Indomie Kuah Rebus', category: 'Makanan', description: 'Indomie kuah hangat dengan sayur telur', price: 10000, cost: 5500, stock: 45, unit: 'porsi', barcode: 'WK-016', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' },
];

function initDatabase(): DbSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db file, reinitializing', err);
  }

  const today = new Date();
  const sampleTransactions = [
    {
      id: 'trx-1',
      invoiceNumber: `WK-${today.toISOString().slice(0, 10).replace(/-/g, '')}-001`,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      orderType: 'dine_in',
      tableNumber: 'T1',
      items: [
        { productId: 'prod-2', name: 'Kopi Susu', price: 10000, cost: 5500, quantity: 1, unit: 'cup', subtotal: 10000, table: 'T1' },
        { productId: 'prod-4', name: 'Cappuccino', price: 12000, cost: 6500, quantity: 1, unit: 'cup', subtotal: 12000, table: 'T1' },
        { productId: 'prod-7', name: 'Matcha Latte', price: 13000, cost: 7000, quantity: 1, unit: 'cup', subtotal: 13000, table: 'T1' },
        { productId: 'prod-12', name: 'Roti Bakar', price: 12000, cost: 6000, quantity: 1, unit: 'porsi', subtotal: 12000, table: 'T1' },
      ],
      subtotal: 47000,
      discount: 0,
      tax: 4700,
      total: 51700,
      paymentMethod: 'TUNAI',
      amountPaid: 60000,
      change: 8300,
      cashierName: 'Admin',
      cashierRole: 'admin',
    },
  ];

  const initialData: DbSchema = {
    products: defaultProducts,
    transactions: sampleTransactions,
    settings: {
      storeName: 'Warkop Kita',
      tagline: 'Ngopi, Santai, Produktif',
      address: 'Jl. Kopi Kenangan No. 12, Jakarta',
      phone: '0812-9876-5432',
      receiptFooterMessage: 'Terima kasih telah berkunjung ke Warkop Kita!\nNikmati hari santai dan produktif Anda bersama secangkir kopi terbaik.',
      enableTax: true,
      taxRatePercent: 10,
    },
    users: [
      { id: 'user-admin', name: 'Admin', role: 'admin', avatarBg: 'bg-[#4A2C1D]', pin: '1234' },
      { id: 'user-kasir-1', name: 'Kasir', role: 'kasir', avatarBg: 'bg-[#6F4E37]', pin: '0000' },
    ],
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write initial db:', err);
  }

  return initialData;
}

let db = initDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

// REST Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    totalProducts: db.products.length,
    totalTransactions: db.transactions.length,
  });
});

app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.unshift(newProduct);
  saveDatabase();
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Produk tidak ditemukan' });
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase();
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.products = db.products.filter((p) => p.id !== id);
  saveDatabase();
  res.json({ success: true, message: 'Produk berhasil dihapus' });
});

app.get('/api/transactions', (req, res) => {
  res.json(db.transactions);
});

app.post('/api/transactions', (req, res) => {
  const transaction = req.body;
  if (!transaction || !transaction.items || transaction.items.length === 0) {
    return res.status(400).json({ error: 'Transaksi tidak valid' });
  }

  // Deduct stock automatically
  transaction.items.forEach((item: any) => {
    const prod = db.products.find((p) => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, (prod.stock || 0) - item.quantity);
      prod.updatedAt = new Date().toISOString();
    }
  });

  const savedTransaction = {
    ...transaction,
    id: transaction.id || `trx-${Date.now()}`,
    timestamp: transaction.timestamp || new Date().toISOString(),
  };

  db.transactions.unshift(savedTransaction);
  saveDatabase();
  res.status(201).json(savedTransaction);
});

app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDatabase();
  res.json(db.settings);
});

app.post('/api/reset', (req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
  } catch (e) {}
  db = initDatabase();
  res.json({ success: true, message: 'Database reset to demo state' });
});

// Vite dev server mounting
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KasirKu POS running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
