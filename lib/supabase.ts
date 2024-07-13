import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymrhkjxqkhuzvpzsubve.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltcmhranhxa2h1enZwenN1YnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3ODAyODYsImV4cCI6MjAzNjM1NjI4Nn0.AKvK686QtTM8WwS48_-ZOQCEwpmDQUlTzCNYdzlCG-4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})