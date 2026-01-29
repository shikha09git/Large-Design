import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pgkucvaxgkqfwnoaajcp.supabase.co';
const supabaseAnonKey = 'sb_publishable_VSAIHbfTMW7PwCZbGdtRjw_a5sZQXum';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
