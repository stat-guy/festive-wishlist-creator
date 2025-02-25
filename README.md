# Festive Wishlist Creator

An interactive Santa Chat experience with real-time letter updates and voice interaction, featuring a glossy festive design with animated snowfall.

## Features

- Enhanced snowfall animation with custom snowflake designs
- Dynamic and glossy letter card with delightful animations
- Comprehensive countdown timer showing months, weeks, days, hours, minutes, and seconds until Christmas
- Festive background with decorative holiday elements
- Voice chat interface with Santa
- Real-time updates via WebSocket
- ElevenLabs voice integration

## Enhanced UI Features

- **Glassmorphism Effects**: Translucent frosted glass look for elements
- **Festive Color Scheme**: Rich red and green color palette
- **Interactive Elements**: Hover and animation effects throughout
- **Responsive Design**: Works on all device sizes
- **Custom Font Families**: Festive and handwritten fonts for the perfect holiday feel

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

3. Generate festive images (optional - placeholder images are included):
```bash
# First, replace YOUR_API_KEY in the script if you want to use fal.ai
# Then run:
node scripts/generate-images-with-sdk.js
```

4. Run the development server:
```bash
npm run dev
```

## Customizing Images

The application includes placeholder images for:
- `christmas-bg.jpg` - Main background
- `holly-decoration.png` & `holly-small.png` - Decorative holly elements
- `ornament-decoration.png` & `ornament-small.png` - Christmas ornament decorations
- `snowflake1.png`, `snowflake2.png`, `snowflake3.png` - Unique snowflake designs

You can replace these with your own festive images in the `/public` directory to customize the look.

## Database Schema

The project uses Supabase with the following tables:
- conversations
- conversation_context
- voice_interactions
- elevenlabs_credentials

## Components

- **SantaChat**: Main container component
- **Snowfall**: Enhanced animated snow effect with custom snowflakes
- **ChristmasCard**: Interactive glossy letter template with animations
- **ChristmasTimer**: Comprehensive countdown to Christmas with months, weeks, days, hours, minutes, and seconds
- **VoiceChat**: Voice interaction interface with Santa

## Technology

- React & TypeScript
- Next.js for server-side rendering
- Tailwind CSS with custom utilities
- Framer Motion for animations
- ElevenLabs for voice interaction
- Supabase for backend

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License

MIT