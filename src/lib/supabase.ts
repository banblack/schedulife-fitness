
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzbpmqoolkoclxsrzcqv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YnBtcW9vbGtvY2x4c3J6Y3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NjM0NjksImV4cCI6MjA1NDUzOTQ2OX0.7g8z7Zsb2gJGNAqzv6qq1jdbRYWfO3SGIgo0HPexdyo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
