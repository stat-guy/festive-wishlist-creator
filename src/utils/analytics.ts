
import posthog from 'posthog-js';
import { supabase } from "@/integrations/supabase/client";

export const POSTHOG_API_KEY = 'phc_J9d4iidYwSLUR1LAwZ1pQ1IZVf699Hswj6rud7nB0EL';

// Initialize PostHog
posthog.init(POSTHOG_API_KEY, { 
  api_host: 'https://app.posthog.com'
});

// Custom analytics function to capture events in both PostHog and Supabase
export const captureEvent = async (eventName: string, properties: Record<string, any> = {}) => {
  try {
    // Capture in PostHog
    posthog.capture(eventName, properties);
    
    // Capture in Supabase
    await supabase.rpc('captureposthogevent', {
      api_key: POSTHOG_API_KEY,
      event: eventName,
      properties
    });
  } catch (error) {
    console.error('Error capturing event:', error);
  }
};
