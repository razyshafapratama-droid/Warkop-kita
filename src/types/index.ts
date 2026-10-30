export type UserRole = 'admin' | 'kasir';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  avatarBg: string;
  pin: string;
}

export type OrderType = 'dine_in' | 'take_away';
export type TableNumber = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | null;

export interface Product {
  id: string;
  name: string;
  category: 'Kopi' | 'Non Kopi' | 'Teh' | 'Susu' | 'Camilan' | 'Makanan' | string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  unit: string;
  barcode: string;
  icon?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  table?: TableNumber;
  orderType?: OrderType;
  notes?: string;
}

export type PaymentMethod = 'TUNAI' | 'QRIS' | 'E_WALLET';

export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  unit: string;
  subtotal: number;
  table?: TableNumber;
  orderType?: OrderType;
  image?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  timestamp: string;
  orderType: OrderType;
  tableNumber: TableNumber;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  cashierName: string;
  cashierRole: UserRole;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  receiptFooterMessage: string;
  enableTax: boolean;
  taxRatePercent: number; // default 10% as in screenshot
}
