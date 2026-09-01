const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function checkSchema() {
  const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.definitions && data.definitions.reviews) {
      console.log("Reviews schema:", JSON.stringify(data.definitions.reviews.properties, null, 2));
  } else {
      console.log("Could not fetch schema definitions via OpenAPI.");
      // fallback
      const fallbackUrl = `${supabaseUrl}/rest/v1/reviews?limit=1&apikey=${supabaseKey}`;
      const res2 = await fetch(fallbackUrl);
      console.log("Direct fetch:", await res2.json());
  }
}

checkSchema();
