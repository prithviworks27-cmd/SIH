import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log("🔍 Testing Supabase Connection...\n");
console.log(`URL: ${supabaseUrl}`);
console.log(`Anon Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("✅ Supabase client created successfully!\n");

  // Try to fetch users table
  const { data, error } = await supabase
    .from("users")
    .select("id, email, name, role")
    .limit(5);

  if (error) {
    console.log("❌ Error querying users table:");
    console.log(`   Code: ${error.code}`);
    console.log(`   Message: ${error.message}`);
    process.exit(1);
  }

  console.log("✅ Successfully connected to users table!");
  console.log(`\n📊 Current users in database: ${data.length}\n`);

  if (data.length > 0) {
    console.log("Sample users:");
    data.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });
  } else {
    console.log("No users in the database yet.");
  }

  console.log("\n✅ All tests passed! Supabase is connected and working correctly.\n");
  process.exit(0);
} catch (error) {
  console.log("❌ Connection Error:");
  console.log(`   ${error.message}`);
  process.exit(1);
}
