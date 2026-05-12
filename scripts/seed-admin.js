import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Load from .env file or replace manually
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedAdmin() {
  console.log("Seeding initial Admin user...");

  const adminPhone = '0770000000';
  const adminEmail = `${adminPhone}@nexuslms.com`;
  const adminPassword = 'admin123';

  // 1. Clean up existing data to avoid unique constraint issues
  console.log("Cleaning up old admin data if exists...");
  
  // Search by phone in profiles
  const { data: profileByPhone } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('whatsapp_number', adminPhone)
    .single();

  if (profileByPhone) {
    await supabaseAdmin.auth.admin.deleteUser(profileByPhone.id);
    console.log("Deleted old user by phone.");
  }

  // Search by email in auth
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  const userByEmail = users.find(u => u.email === adminEmail);
  if (userByEmail) {
    await supabaseAdmin.auth.admin.deleteUser(userByEmail.id);
    console.log("Deleted old user by email.");
  }

  // 2. Create User
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true
  });

  if (authError) {
    console.error("Error creating user:", authError);
    return;
  }

  const userId = authData.user.id;

  // 3. Insert Profile
  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: userId,
    role: 'admin',
    full_name: 'System Admin',
    whatsapp_number: adminPhone,
    id_number: '000000000V',
    address: 'Nexus Institute'
  });

  if (profileError) {
    console.error("Error creating profile:", profileError);
    return;
  }

  console.log("✅ Admin user setup completed successfully!");
  console.log(`📱 WhatsApp (Username): ${adminPhone}`);
  console.log(`🔑 Password: ${adminPassword}`);
}

seedAdmin();
