
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txisyzhqemzxzumxywxr.supabase.co';  
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aXN5emhxZW16eHp1bXh5d3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjA1NzIsImV4cCI6MjA2OTYzNjU3Mn0.rdLV_D3rowm0Pd8rrQBxeFJIhO4UjhpQg19Ni_V4lTQ';  // Supabase anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
