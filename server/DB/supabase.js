import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const db = createClient(supabaseUrl, supabaseKey);

export default db;


// Test connection
const test = async () => {
  const { data, error } = await db
    .from('users')
    .select('*');

  console.log('DATA:', data);
  console.log('ERROR:', error);
};

test();
