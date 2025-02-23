export interface Message {
  source: 'ai' | 'user';
  message: string;
}

export interface CardData {
  name: string;
  wishes: string[];
  location: string;
}

export class MessageHandler {
  static processMessage(message: Message): Partial<CardData> | null {
    const text = message.message.toLowerCase();
    const updates: Partial<CardData> = {};

    // Process name
    if (text.includes('my name is')) {
      const nameMatch = text.match(/my name is ([\w]+)/i);
      if (nameMatch && nameMatch[1]) {
        updates.name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
      }
    }

    // Process wishes
    const wishKeywords = ['wish for', 'would like', 'want', 'jersey', 'shoes', 'mangoes'];
    for (const keyword of wishKeywords) {
      if (text.includes(keyword)) {
        updates.wishes = [];
        if (text.includes('soccer jersey') || text.includes('jersey')) {
          updates.wishes.push('Soccer Jersey');
        }
        if (text.includes('nike') || text.includes('shoes')) {
          updates.wishes.push('Nike Shoes');
        }
        if (text.includes('mango') || text.includes('mangoes')) {
          updates.wishes.push('Mangoes');
        }
        break;
      }
    }

    // Process location
    const locationKeywords = ['celebrating in', 'spending christmas in', 'going to be in'];
    for (const keyword of locationKeywords) {
      if (text.includes(keyword)) {
        const locationMatch = text.match(new RegExp(`${keyword} ([\w\s]+)`, 'i'));
        if (locationMatch && locationMatch[1]) {
          updates.location = locationMatch[1].trim();
        }
      }
    }

    return Object.keys(updates).length > 0 ? updates : null;
  }
}
