export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at">;
        Update: Partial<Omit<Category, "id" | "created_at">>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "created_at">;
        Update: Partial<Omit<Order, "id" | "created_at">>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, "id">;
        Update: Partial<Omit<OrderItem, "id">>;
      };
    };
  };
}

export interface Category {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description_ar: string;
  description_en?: string;
  price: number;
  original_price: number | null;
  image_url: string;
  images: string[];
  category_id: number;
  category?: Category;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_notes: string | null;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
