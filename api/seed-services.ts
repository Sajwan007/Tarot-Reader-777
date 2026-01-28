import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedServices() {
  try {
    const services = [
      {
        id: randomUUID(), // Generate proper UUID
        name: 'Love Tarot Reading',
        description: 'Discover insights about your romantic path, soulmate connections, and relationship dynamics.',
        duration_minutes: 45,
        price: 999.00,
        is_active: true
      },
      {
        id: randomUUID(), // Generate proper UUID
        name: 'Career Guidance',
        description: 'Navigate your professional journey, uncover hidden opportunities, and find your true calling.',
        duration_minutes: 60,
        price: 1299.00,
        is_active: true
      },
      {
        id: randomUUID(), // Generate proper UUID
        name: 'Yes/No Reading',
        description: 'Quick, direct answers to your most pressing questions when you need immediate clarity.',
        duration_minutes: 30,
        price: 499.00,
        is_active: true
      },
      {
        id: randomUUID(), // Generate proper UUID
        name: 'Life Path Reading',
        description: "A deep dive into your life's purpose, spiritual lessons, and the grand design of your destiny.",
        duration_minutes: 90,
        price: 1799.00,
        is_active: true
      },
      {
        id: randomUUID(), // Generate proper UUID
        name: 'Custom Question',
        description: 'Personalized reading focused entirely on a specific situation or topic of your choice.',
        duration_minutes: 45,
        price: 899.00,
        is_active: true
      }
    ];

    // Insert services
    const { data, error } = await supabase
      .from('services')
      .insert(services)
      .select();

    if (error) {
      console.error('Error seeding services:', error);
      return;
    }

    console.log('Services seeded successfully:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

seedServices();
