const { createClient } = require("@supabase/supabase-js");

/**
 * Do not use this on the client side.
 */

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY_DO_NOT_SHARE ?? "";

const supabase = createClient(supabaseUrl, supabaseSecretKey);

module.exports = { supabase };
