export interface Message {
  source: 'ai' | 'user';
  message: string;
  type?: 'name' | 'wish' | 'location';
}

export interface ProcessedMessage {
  type: 'name' | 'wish' | 'location';
  content: string;
}

export class MessageProcessor {
  private static wishKeywords = [
    'wish for',
    'would like',
    'want',
    'hoping to get',
    'soccer jersey'
  ];

  private static locationKeywords = [
    'celebrating in',
    'spending christmas in',
    'going to',
    'will be in'
  ];

  static processMessage(message: Message): ProcessedMessage | null {
    const text = message.message.toLowerCase();

    // Process name introductions
    if (text.includes('my name is')) {
      const name = text.split('my name is').pop()?.trim().split(' ')[0];
      return name ? { type: 'name', content: name.charAt(0).toUpperCase() + name.slice(1) } : null;
    }

    // Process wishes
    for (const keyword of this.wishKeywords) {
      if (text.includes(keyword)) {
        if (text.includes('soccer jersey')) {
          return { type: 'wish', content: 'Real Madrid soccer jersey' };
        }
        // Add more specific wish processing here
      }
    }

    // Process locations
    for (const keyword of this.locationKeywords) {
      if (text.includes(keyword)) {
        const locationStart = text.indexOf(keyword) + keyword.length;
        const location = text.slice(locationStart).trim().split('.')[0];
        return location ? { type: 'location', content: location.charAt(0).toUpperCase() + location.slice(1) } : null;
      }
    }

    // Add more message processing patterns here
    return null;
  }

  static isValidMessage(message: any): message is Message {
    return (
      message &&
      typeof message === 'object' &&
      (message.source === 'ai' || message.source === 'user') &&
      typeof message.message === 'string'
    );
  }
}
