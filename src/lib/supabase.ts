import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export type AppRow = {
  id: string
  slug: string
  name: string
  category: string
  description: string
  icon: string
  accent: string
  screenshots: string[]
  updated_at: string
}
