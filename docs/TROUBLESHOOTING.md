# Troubleshooting Guide

## Common Issues

### 1. ElevenLabs Connection Issues

#### Symptoms
- Talk with Santa button not responding
- Timeout errors in console
- Connection failed messages

#### Solutions
1. Check Supabase credentials:
```sql
SELECT * FROM public.elevenlabs_credentials LIMIT 1;
```

2. Verify API key validity:
```typescript
const response = await fetch('https://api.elevenlabs.io/v1/convai/agents/[agent_id]', {
  headers: {
    'xi-api-key': '[your-api-key]'
  }
});
```

3. Check for CORS issues:
- Ensure proper origins are set in ElevenLabs dashboard
- Verify web security settings

### 2. Card Update Issues

#### Symptoms
- Card not updating with conversation
- Missing or incorrect information
- Delayed updates

#### Solutions
1. Check message processing:
```typescript
const handleMessage = (event: MessageEvent) => {
  console.log('Received message:', event.data);
  // Add your debugging here
};
```

2. Verify state updates:
```typescript
useEffect(() => {
  console.log('Card data updated:', cardData);
}, [cardData]);
```

### 3. UI State Issues

#### Symptoms
- Incorrect button states
- Loading indicators not showing
- Error messages not displaying

#### Solutions
1. Log state changes:
```typescript
useEffect(() => {
  console.log('Conversation state:', {
    isActive,
    isInitializing,
    error
  });
}, [isActive, isInitializing, error]);
```

2. Check component props:
```typescript
console.log('ChristmasCard props:', {
  isCallActive,
  isInitializing,
  error
});
```

## Development Tips

### 1. Local Testing
- Use browser dev tools to monitor WebSocket connections
- Check Network tab for API calls
- Monitor Console for errors and state logs

### 2. State Management
- Use React DevTools to inspect component state
- Monitor realtime database changes in Supabase dashboard
- Check message flow in browser console

### 3. Performance
- Monitor memory usage for audio processing
- Check for unnecessary re-renders
- Verify WebSocket connection stability

## Support Resources

### Documentation
- ElevenLabs API Status: https://status.elevenlabs.io
- Supabase Status: https://status.supabase.com

### Tools
- WebSocket testing: https://websocket.org/echo.html
- API testing: Postman or Insomnia

### Community
- ElevenLabs Discord
- Supabase Discord
- React Community Forums
