export interface Provider {
  id: number;
  restaurantName: string;
  cuisines: string[];
  address: string;
  imageUrl: string | null;
  rating: number;
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
  price: string | number; 
  imageUrl: string | null;
  dietaryPref: string | null;
  categoryId: number;
  providerId: number;
  provider?: Provider;
  category?: Category;
}