
export interface Message {
  type: 'name' | 'wish' | 'location';
  content: string;
}

export interface WishlistItem {
  key?: string;
  name: string;
  priority?: number;
}

export interface Wishlist {
  items: WishlistItem[];
  priority_order: string[];
  notes: string;
}

export interface CardData {
  name: string;
  wishes: string[];
  location: string;
}
