const { createClient } = require("@supabase/supabase-js");

function requireEnv(name) {
  const value = process.env[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    throw new Error("Usage: node scripts/set-admin.cjs <user_id|email>");
  }

  const supabase = createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  let profile;
  if (target.includes("@")) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,role")
      .eq("email", target)
      .maybeSingle();
    if (error) throw new Error(error.message);
    profile = data;
  } else {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,role")
      .eq("id", target)
      .maybeSingle();
    if (error) throw new Error(error.message);
    profile = data;
  }

  if (!profile) {
    throw new Error("Profile not found. Ensure the user has signed in once.");
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", profile.id);

  if (updateError) throw new Error(updateError.message);

  process.stdout.write(
    JSON.stringify({ ok: true, id: profile.id, email: profile.email }, null, 2) +
      "\n",
  );
}

main().catch((err) => {
  process.stderr.write((err && err.message) || String(err));
  process.stderr.write("\n");
  process.exit(1);
});
