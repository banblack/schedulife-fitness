
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfwpwpjinixnwbmivdwp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmd3B3cGppbml4bndibWl2ZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc2NjI5MzAsImV4cCI6MjAyMzIzODkzMH0.JQND6QxHNmbo75QUoZwPEFpJEHiCgo-5ZSg_vvzYtXY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
