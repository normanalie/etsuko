const { createClient } = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient(
    'https://xwnpgapjafoyukdfeunm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3bnBnYXBqYWZveXVrZGZldW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzOTMwMDEsImV4cCI6MjAxMzk2OTAwMX0.91pRE9tyY3R0NsaFtrQF3AN7MJX_wtet-cgpgT_j8Rc'
)

exports.supabase = supabase
