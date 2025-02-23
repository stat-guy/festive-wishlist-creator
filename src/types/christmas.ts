
export interface Message {
  type: 'name' | 'wish' | 'location';
  content: string;
}

export interface CardData {
  name: string;
  wishes: string[];
  location: string;
}
