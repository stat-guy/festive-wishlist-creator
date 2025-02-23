# Festive Wishlist Creator

An interactive Santa Chat experience with real-time letter updates and voice interaction.

## Features

- Snowfall animation effect
- Dynamic letter card updates
- Countdown timer to Christmas
- Age verification modal
- Voice chat interface with Santa
- Real-time updates via WebSocket
- ElevenLabs voice integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

3. Run the development server:
```bash
npm run dev
```

## Database Schema

The project uses Supabase with the following tables:
- conversations
- conversation_context
- voice_interactions
- elevenlabs_credentials

## Components

- SantaChat: Main container component
- Snowfall: Animated snow effect
- ChristmasCard: Interactive letter template
- CountdownTimer: Days until Christmas counter
- AgeVerification: Age verification modal
- VoiceChat: Voice interaction interface

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License

MIT