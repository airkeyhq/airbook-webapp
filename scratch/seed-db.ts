import { db } from '../db';
import { workspaces, staff, services, products } from '../db/schema';

async function seedInitialData() {
  console.log('--- Seeding Initial Workspace & Defaults to Neon DB ---');

  const existingWs = await db.select().from(workspaces);
  if (existingWs.length > 0) {
    console.log('Workspace already exists:', existingWs[0].name);
    return;
  }

  // 1. Create default workspace
  const [ws] = await db
    .insert(workspaces)
    .values({
      name: "Eduardo's Lounge",
      slug: 'eduardos-lounge',
      phone: '(555) 234-5678',
      email: 'eduardo@airbook.app',
      address: '742 Evergreen Terrace, Suite 100',
      currency: 'USD',
      brandColor: '#007AFF',
      cancellationNoticeHours: 24,
      depositRequiredPercent: 20,
    })
    .returning();

  console.log('Created Workspace:', ws.name, ws.id);

  // 2. Seed Default Staff
  const staffList = await db
    .insert(staff)
    .values([
      {
        workspaceId: ws.id,
        name: 'Eduardo Moreno',
        role: 'Master Barber & Founder',
        email: 'eduardo@airbook.app',
        avatarEmoji: '💈',
        commissionPercent: 70,
      },
      {
        workspaceId: ws.id,
        name: 'Agnes K.',
        role: 'Senior Stylist',
        email: 'agnes@airbook.app',
        avatarEmoji: '✂️',
        commissionPercent: 65,
      },
      {
        workspaceId: ws.id,
        name: 'Marco Rossi',
        role: 'Color Specialist',
        email: 'marco@airbook.app',
        avatarEmoji: '🎨',
        commissionPercent: 60,
      },
    ])
    .returning();

  console.log('Seeded Staff:', staffList.map((s) => s.name).join(', '));

  // 3. Seed Default Services
  const serviceList = await db
    .insert(services)
    .values([
      {
        workspaceId: ws.id,
        name: 'Signature Haircut & Style',
        description: 'Hot towel treatment, precision cut, scalp massage and styling.',
        category: 'Haircut',
        durationMinutes: 45,
        priceCents: 6500,
        depositCents: 1300,
        colorTag: '#007AFF',
      },
      {
        workspaceId: ws.id,
        name: 'Beard Sculpting & Hot Towel',
        description: 'Beard shaping, razor line up, organic beard oil treatment.',
        category: 'Beard',
        durationMinutes: 30,
        priceCents: 4000,
        depositCents: 800,
        colorTag: '#AF52DE',
      },
      {
        workspaceId: ws.id,
        name: 'Full Deluxe Combo (Hair + Beard)',
        description: 'Complete grooming package with custom facial steam.',
        category: 'Combo',
        durationMinutes: 75,
        priceCents: 9500,
        depositCents: 1900,
        colorTag: '#34C759',
      },
    ])
    .returning();

  console.log('Seeded Services:', serviceList.map((s) => s.name).join(', '));

  // 4. Seed Default Products
  const productList = await db
    .insert(products)
    .values([
      {
        workspaceId: ws.id,
        name: 'Matte Clay Pomade',
        sku: 'POM-001',
        category: 'Hair Styling',
        retailPriceCents: 2800,
        costPriceCents: 1200,
        stockQuantity: 24,
        lowStockAlertThreshold: 5,
        isRetail: true,
      },
      {
        workspaceId: ws.id,
        name: 'Organic Cedarwood Beard Oil',
        sku: 'OIL-002',
        category: 'Beard Care',
        retailPriceCents: 3200,
        costPriceCents: 1400,
        stockQuantity: 18,
        lowStockAlertThreshold: 4,
        isRetail: true,
      },
    ])
    .returning();

  console.log('Seeded Products:', productList.map((p) => p.name).join(', '));
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
}

seedInitialData().catch((e) => {
  console.error('Seeding error:', e);
  process.exit(1);
});
