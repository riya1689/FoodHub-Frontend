export interface Provider {
  id: number;
  user: {
    name: string;
  };
}

export interface Category {
  id: number;
  name: string;
}

export interface Meal {
  id: number;
  name: string;
  description: string;
  price: string; 
  imageUrl?: string;
  categoryId: number;
  providerId: number;
  provider?: Provider;
  category?: Category;
}