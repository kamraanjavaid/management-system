import { createClient } from '@supabase/supabase-js';

// This script creates demo users in Supabase Auth
// Run this once to set up test accounts

const supabaseUrl = process.env.PROJECT_URL || '';
const serviceRoleKey = process.env.SERVICE_ROLE || '';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDemoUsers() {
  console.log('Creating demo users...');

  // Create Admin user
  const { data: admin, error: adminError } = await supabase.auth.admin.createUser({
    email: 'admin@mobilehub.com',
    password: 'admin123',
    email_confirm: true,
    user_metadata: {
      role: 'admin',
      shop: 'Main Store',
      shop_id: 'shop_001',
      full_name: 'Admin User',
    },
  });

  if (adminError) {
    console.error('Error creating admin:', adminError.message);
  } else {
    console.log('Admin user created:', admin.user?.email);
  }

  // Create Staff user
  const { data: staff, error: staffError } = await supabase.auth.admin.createUser({
    email: 'staff@mobilehub.com',
    password: 'staff123',
    email_confirm: true,
    user_metadata: {
      role: 'staff',
      shop: 'Main Store',
      shop_id: 'shop_001',
      full_name: 'Staff User',
    },
  });

  if (staffError) {
    console.error('Error creating staff:', staffError.message);
  } else {
    console.log('Staff user created:', staff.user?.email);
  }

  console.log('Demo users setup complete!');
}

setupDemoUsers().catch(console.error);
