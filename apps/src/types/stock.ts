export interface Category {
  id: number;
  nama_kategori: string;
  deskripsi_kategori: string;
  created_at: string;
  updated_at: string;
  products_count?: number;
}

export interface Product {
  id: number;
  nama_produk: string;
  deskripsi_produk: string;
  gambar_produk: string | null;
  category_id: number;
  stok_produk: number;
  harga_produk: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Transaction {
  id: number;
  product_id: number;
  type: 'stock_in' | 'stock_out';
  quantity: number;
  notes: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface DashboardStats {
  total_products: number;
  total_categories: number;
  low_stock_products: number;
  total_transactions_today: number;
  recent_transactions: Transaction[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  status_code?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}