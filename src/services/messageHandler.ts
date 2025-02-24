export interface Message {
  source: 'ai' | 'user';
  message: string;
  type?: string;
}

export interface CardData {
  name: string;
  wishes: string[];
  location: string;
}

export class MessageHandler {
  private static wishKeywords = [
    'wish for',
    'would like',
    'want',
    'hoping to get',
    'soccer jersey',
    'nike shoes',
    'mangoes'
  ];

  private static locationKeywords = [
    'celebrating in',
    'spending christmas in',
    'going to',
    'will be in'
  ];

  static processMessage(message: Message): Partial<CardData> | null {
    const text = message.message.toLowerCase();
    const updates: Partial<CardData> = {};

    // Handle system messages or special types
    if (message.type === 'START_CONVERSATION' || message.type === 'END_CONVERSATION') {
      return null;
    }

    // Process name introductions
    if (text.includes('my name is')) {
      const nameMatch = text.match(/my name is ([\w]+)/i);
      if (nameMatch && nameMatch[1]) {
        updates.name = nameMatch[1];
        return updates;
      }
    }

    // Process user responses for name
    if (message.source === 'user' && text.length > 0 && !text.includes(' ')) {
      updates.name = text.charAt(0).toUpperCase() + text.slice(1);
      return updates;
    }

    // Process wishes
    for (const keyword of this.wishKeywords) {
      if (text.includes(keyword)) {
        const wishes: string[] = [];
        if (text.includes('soccer jersey') || text.includes('jersey')) {
          wishes.push('Soccer Jersey');
        }
        if (text.includes('nike') || text.includes('shoes')) {
          wishes.push('Nike Shoes');
        }
        if (text.includes('mango') || text.includes('mangoes')) {
          wishes.push('Mangoes');
        }
        if (wishes.length > 0) {
          updates.wishes = wishes;
          return updates;
        }
      }
    }

    // Process locations
    for (const keyword of this.locationKeywords) {
      if (text.includes(keyword)) {
        const locationMatch = text.match(new RegExp(`${keyword}\\s+([\\w\\s]+)`, 'i'));
        if (locationMatch && locationMatch[1]) {
          updates.location = locationMatch[1].trim();
          return updates;
        }
      }
    }

    return null;
  }
}