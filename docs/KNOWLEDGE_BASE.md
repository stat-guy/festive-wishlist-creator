# Santa's Wishlist Creator - Knowledge Base

## Project Overview
An interactive Christmas card creator that uses ElevenLabs' conversational AI to let children talk to Santa Claus and create their Christmas wishlist.

## Key Components

### 1. Database Structure (Supabase)

#### Conversations Table
```sql
CREATE TABLE public.conversations (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    name text NULL,
    wishlist jsonb NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT conversations_pkey PRIMARY KEY (id)
);
```

#### ElevenLabs Credentials Table
```sql
CREATE TABLE public.elevenlabs_credentials (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
    api_key text NOT NULL,
    agent_id text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT elevenlabs_credentials_pkey PRIMARY KEY (id)
);
```

### 2. ElevenLabs Integration

#### Conversation Flow
1. Fetch credentials from Supabase
2. Get signed URL from ElevenLabs API
3. Get conversation token
4. Initialize conversation with signed URL and token
5. Handle real-time message updates
6. Update card with conversation content

#### Key API Endpoints Used
- `/v1/convai/conversation/get_signed_url` - Get signed URL for conversation
- `/v1/convai/agents/:agent_id/link` - Get conversation token
- `/v1/convai/conversations` - Manage conversations

### 3. UI Components

#### Christmas Card
- Dynamic updates based on conversation
- Candy cane border styling
- Wishlist items with animations
- Loading states and error handling

#### Conversation Controls
- Talk with Santa button with states:
  - Initial: "Talk with Santa"
  - Loading: "Connecting to Santa..."
  - Active: "End Call with Santa"

### 4. State Management

#### Card Data
```typescript
interface CardData {
  name: string;
  wishes: string[];
  location: string;
}
```

#### Conversation State
```typescript
interface ConversationState {
  isActive: boolean;
  conversationId?: string;
  signedUrl?: string;
  conversationToken?: string;
}
```

### 5. Message Processing
- Handle both AI and user messages
- Extract relevant information (name, wishes, location)
- Update card in real-time
- Manage conversation flow

## Common Issues & Solutions

### 1. Conversation Timeout
Issue: `useConversation failed to start conversation: Error: Conversation start timeout`
Solution: Implemented proper initialization flow with signed URLs and tokens

### 2. Message Processing
Issue: Card not updating with conversation content
Solution: Enhanced message processing with better state management

### 3. UI State Management
Issue: Button states not reflecting conversation status
Solution: Added proper loading and error states with visual feedback

## Future Enhancements

1. Email Functionality
- Implement card sharing via email
- Add email templates
- Handle attachments

2. Voice Interaction Improvements
- Add voice activity visualization
- Implement noise cancellation
- Add audio feedback for better UX

3. Card Customization
- Add theme selection
- Allow custom backgrounds
- Support different letter formats

## Resources

### Documentation
- [ElevenLabs API Documentation](https://docs.elevenlabs.io/api/conversational)
- [Supabase Documentation](https://supabase.com/docs)

### Libraries Used
- React + TypeScript
- Framer Motion for animations
- Tailwind CSS for styling

### Development Tools
- Vite for build system
- PostCSS for CSS processing
- ESLint + Prettier for code formatting
