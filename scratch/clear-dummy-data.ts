import { db } from '../db';
import { staff, services, products, appointments, workspaces } from '../db/schema';
import { inArray, eq } from 'drizzle-orm';

async function clearDummyData() {
  console.log('--- Clearing Dummy Data from Neon DB ---');

  // Identify dummy workspaces or just wipe all to be safe?
  // Let's delete the specific dummy data seeded in seed-db.ts
  const dummyStaffNames = ['Eduardo Moreno', 'Agnes K.', 'Marco Rossi'];
  const dummyServiceNames = ['Signature Haircut & Style', 'Beard Sculpting & Hot Towel', 'Full Deluxe Combo (Hair + Beard)'];
  const dummyProducts = ['Matte Clay Pomade', 'Organic Cedarwood Beard Oil'];

  await db.delete(staff).where(inArray(staff.name, dummyStaffNames));
  await db.delete(services).where(inArray(services.name, dummyServiceNames));
  await db.delete(products).where(inArray(products.name, dummyProducts));
  
  // Optionally, if we just want to start fresh:
  // await db.delete(appointments);
  // await db.delete(staff);
  // await db.delete(services);
  // await db.delete(products);

  console.log('🎉 Dummy data cleared successfully!');
}

clearDummyData().catch((e) => {
  console.error('Error clearing data:', e);
  process.exit(1);
});
