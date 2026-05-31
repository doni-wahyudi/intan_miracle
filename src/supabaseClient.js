import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pserstneauolpxoatbcb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXJzdG5lYXVvbHB4b2F0YmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzQ4NzMsImV4cCI6MjA4ODExMDg3M30.5ah-j2PownIlLB_IVnSTZOPeSZMi3pSg4E_pY4nPAxc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
