// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oljvuziofzymjyaifulp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sanZ1emlvZnp5bWp5YWlmdWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwODMzNDYsImV4cCI6MjA1MjY1OTM0Nn0.gOTbLYrZqL-Nv_GnCUxlWOK04XJTfTgjXDH_l0ttWWw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);