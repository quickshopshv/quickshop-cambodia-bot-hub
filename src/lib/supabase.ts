
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://fxhtcdyxmtfyvanqhaty.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4aHRjZHl4bXRmeXZhbnFoYXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjU5NTEsImV4cCI6MjA2NTU0MTk1MX0.EdfLsNbHiEwx65x1gfv6OOLnvKKe8EBZYKsmJ9f5L2Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
