import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://mnxvgclqwykfosnvxwin.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueHZnY2xxd3lrZm9zbnZ4d2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NjEwODYsImV4cCI6MjA0NzAzNzA4Nn0.T27xw5EuugSpv86lyr4VdBZOUJzy4CU5gir5q3dcE4M'
export const supabase = createClient(supabaseUrl, supabaseKey)