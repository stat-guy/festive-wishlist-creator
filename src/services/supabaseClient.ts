
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dxjzlhnzmxpwptzjbhur.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4anpsaG56bXhwd3B0empiaHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNDA5OTksImV4cCI6MjA1NTkxNjk5OX0.h6HFSqzOf3EcMw_HwqC15m-9uxySzoD7iG9cSQKuOM0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
