import { Product, StoreSettings, Transaction, UserAccount } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    name: 'Admin',
    role: 'admin',
    avatarBg: 'bg-[#4A2C1D]',
    pin: '1234',
  },
  {
    id: 'user-kasir-1',
    name: 'Kasir',
    role: 'kasir',
    avatarBg: 'bg-[#6F4E37]',
    pin: '0000',
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Warkop Kita',
  tagline: 'Ngopi, Santai, Produktif',
  address: 'Jl. Kopi Kenangan No. 12, Jakarta',
  phone: '0812-9876-5432',
  receiptFooterMessage: 'Terima kasih telah berkunjung ke Warkop Kita!\nNikmati hari santai dan produktif Anda bersama secangkir kopi terbaik.',
  enableTax: true,
  taxRatePercent: 10,
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kopi Hitam',
    category: 'Kopi',
    description: 'Kopi robusta pilihan, nikmat dan pekat',
    price: 8000,
    cost: 4000,
    stock: 50,
    unit: 'cup',
    barcode: 'WK-001',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-2',
    name: 'Kopi Susu',
    category: 'Kopi',
    description: 'Perpaduan kopi dan susu berkualitas',
    price: 10000,
    cost: 5500,
    stock: 45,
    unit: 'cup',
    barcode: 'WK-002',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-3',
    name: 'Americano',
    category: 'Kopi',
    description: 'Kopi hitam dengan rasa ringan',
    price: 9000,
    cost: 4500,
    stock: 40,
    unit: 'cup',
    barcode: 'WK-003',
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-4',
    name: 'Cappuccino',
    category: 'Kopi',
    description: 'Espresso, susu, dan foam lembut',
    price: 12000,
    cost: 6500,
    stock: 35,
    unit: 'cup',
    barcode: 'WK-004',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-5',
    name: 'Latte',
    category: 'Kopi',
    description: 'Rasa lembut, aroma khas',
    price: 13000,
    cost: 7000,
    stock: 30,
    unit: 'cup',
    barcode: 'WK-005',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-6',
    name: 'Mochaccino',
    category: 'Kopi',
    description: 'Cokelat berpadu dengan kopi dan susu',
    price: 14000,
    cost: 7500,
    stock: 25,
    unit: 'cup',
    barcode: 'WK-006',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-7',
    name: 'Matcha Latte',
    category: 'Non Kopi',
    description: 'Teh hijau premium dengan susu',
    price: 13000,
    cost: 7000,
    stock: 28,
    unit: 'cup',
    barcode: 'WK-007',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-8',
    name: 'Es Teh Manis',
    category: 'Teh',
    description: 'Segar dan menyegarkan',
    price: 5000,
    cost: 2000,
    stock: 80,
    unit: 'cup',
    barcode: 'WK-008',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-9',
    name: 'Es Cokelat',
    category: 'Non Kopi',
    description: 'Cokelat premium rasa autentik',
    price: 12000,
    cost: 6000,
    stock: 30,
    unit: 'cup',
    barcode: 'WK-009',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-10',
    name: 'Susu Cokelat',
    category: 'Susu',
    description: 'Perpaduan susu dan cokelat',
    price: 10000,
    cost: 5000,
    stock: 35,
    unit: 'cup',
    barcode: 'WK-010',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-11',
    name: 'Taro Latte',
    category: 'Non Kopi',
    description: 'Rasa taro yang creamy',
    price: 13000,
    cost: 7000,
    stock: 22,
    unit: 'cup',
    barcode: 'WK-011',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-12',
    name: 'Roti Bakar',
    category: 'Camilan',
    description: 'Roti dengan topping pilihan',
    price: 12000,
    cost: 6000,
    stock: 40,
    unit: 'porsi',
    barcode: 'WK-012',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-13',
    name: 'Pisang Goreng Keju',
    category: 'Camilan',
    description: 'Pisang renyah topping keju susu',
    price: 12000,
    cost: 5500,
    stock: 25,
    unit: 'porsi',
    barcode: 'WK-013',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-14',
    name: 'Kentang Goreng',
    category: 'Camilan',
    description: 'French fries garing gurih',
    price: 11000,
    cost: 5000,
    stock: 30,
    unit: 'porsi',
    barcode: 'WK-014',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-15',
    name: 'Indomie Goreng Telur',
    category: 'Makanan',
    description: 'Indomie warkop dengan telur ceplok',
    price: 10000,
    cost: 5500,
    stock: 50,
    unit: 'porsi',
    barcode: 'WK-015',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-16',
    name: 'Indomie Kuah Rebus',
    category: 'Makanan',
    description: 'Indomie kuah hangat dengan sayur telur',
    price: 10000,
    cost: 5500,
    stock: 45,
    unit: 'porsi',
    barcode: 'WK-016',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
];

// Seed initial transactions
export const generateInitialTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  const sampleData = [
    {
      items: [
        { prodId: 'prod-2', qty: 2 }, // Kopi Susu
        { prodId: 'prod-12', qty: 1 }, // Roti Bakar
      ],
      method: 'TUNAI' as const,
      orderType: 'dine_in' as const,
      table: 'T1' as const,
      time: '14:20',
    },
    {
      items: [
        { prodId: 'prod-4', qty: 2 }, // Cappuccino
        { prodId: 'prod-14', qty: 1 }, // Kentang Goreng
      ],
      method: 'QRIS' as const,
      orderType: 'dine_in' as const,
      table: 'T3' as const,
      time: '15:10',
    },
    {
      items: [
        { prodId: 'prod-1', qty: 3 }, // Kopi Hitam
        { prodId: 'prod-15', qty: 2 }, // Indomie Goreng Telur
      ],
      method: 'E_WALLET' as const,
      orderType: 'take_away' as const,
      table: null,
      time: '16:05',
    },
    {
      items: [
        { prodId: 'prod-2', qty: 1 },
        { prodId: 'prod-4', qty: 1 },
        { prodId: 'prod-7', qty: 1 },
        { prodId: 'prod-12', qty: 1 },
      ],
      method: 'TUNAI' as const,
      orderType: 'dine_in' as const,
      table: 'T1' as const,
      time: '20:52',
    },
  ];

  sampleData.forEach((sample, index) => {
    const num = index + 1;
    const invNumber = `WK-${today.toISOString().slice(0, 10).replace(/-/g, '')}-${String(num).padStart(3, '0')}`;
    const [h, m] = sample.time.split(':').map(Number);
    const dateObj = new Date(today);
    dateObj.setHours(h, m, 0);

    const lineItems = sample.items.map((itemDef) => {
      const p = INITIAL_PRODUCTS.find((x) => x.id === itemDef.prodId)!;
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        cost: p.cost,
        quantity: itemDef.qty,
        unit: p.unit,
        subtotal: p.price * itemDef.qty,
        table: sample.table,
        orderType: sample.orderType,
        image: p.image,
      };
    });

    const subtotal = lineItems.reduce((acc, cur) => acc + cur.subtotal, 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    const amountPaid = sample.method === 'TUNAI' ? Math.ceil(total / 10000) * 10000 : total;
    const change = amountPaid - total;

    transactions.push({
      id: `trx-${num}`,
      invoiceNumber: invNumber,
      timestamp: dateObj.toISOString(),
      orderType: sample.orderType,
      tableNumber: sample.table,
      items: lineItems,
      subtotal,
      discount: 0,
      tax,
      total,
      paymentMethod: sample.method,
      amountPaid,
      change,
      cashierName: 'Admin',
      cashierRole: 'admin',
    });
  });

  return transactions;
};
