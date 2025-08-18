// src/supabase/client.js
import { createClient } from '@supabase/supabase-js'

// Reemplaza con la URL y la Key de tu proyecto de Supabase
const supabaseUrl = 'https://xvltpkolccwrennpdlvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bHRwa29sY2N3cmVubnBkbHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NDYxODQsImV4cCI6MjA3MTEyMjE4NH0.PsVvBcG1-3nFTglWi8rMn_zM5FuOz1ybKNjP5WF58Es'

// Creamos y exportamos el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)