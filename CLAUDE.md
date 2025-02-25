# Festive Wishlist Creator - Claude Notes

## Project Overview
This project is an interactive Santa Chat experience where users can create a Christmas wishlist through voice interaction with Santa. Features include:

- Snowfall animation effect with custom snowflakes
- Dynamic Christmas card updates based on chat interaction
- Comprehensive countdown timer showing months, weeks, days, hours, minutes and seconds until Christmas
- Voice chat with Santa via ElevenLabs integration
- Festive UI with responsive design

## Important Commands

### Development
```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start

# Lint the codebase
npm run lint
```

### Testing
The project currently doesn't have a dedicated test suite.

## Project Structure

- `src/components/` - React components including ChristmasCard, ChristmasTimer, etc.
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/services/` - Services for handling messages, ElevenLabs integration, etc.
- `src/integrations/` - Integration with external services like Supabase
- `public/` - Static assets and image files

## Code Conventions

- React functional components with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Custom hooks for shared logic
- CSS variables for theme colors

## UI/Design Guidelines

- **Color Scheme:** Red, green, and white (traditional Christmas colors)
- **Fonts:** 
  - Mountains of Christmas for festive titles
  - Caveat for handwritten text
- **Animations:** 
  - Snowfall with custom snowflake images
  - Hover and click animations on interactive elements

## Deployment

The site is deployed on [your deployment platform] and can be accessed at [your URL].

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

## Architecture Decisions

1. **Vertical Layout:** Timer at top, Christmas Card in middle, ElevenLabs widget at bottom for clear user flow
2. **Responsive Design:** Adapts to mobile, tablet, and desktop screen sizes
3. **Real-time Updates:** Christmas card updates in real-time as users chat with Santa
4. **Performance Optimization:** Reduced snowflake count on mobile for better performance

## External Services

- **Supabase:** Database for storing conversation history and user preferences
- **ElevenLabs:** Voice interaction with realistic voice synthesis
- **Posthog:** Analytics tracking

## Maintenance Notes

The app requires the following external services to be operational:
- Supabase account with proper tables configured
- ElevenLabs account with API key
- Properly configured environment variables

## Troubleshooting

- If the ElevenLabs widget doesn't load, check the API key and your connection to ElevenLabs
- If the Christmas Card doesn't update, check the message handling functions
- For snowfall performance issues on mobile, reduce the snowflake count