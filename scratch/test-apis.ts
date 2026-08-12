import { db } from '../db';
import { workspaces, clients, staff, services, products, appointments } from '../db/schema';

async function testDatabaseQueries() {
  console.log('--- Testing Neon DB Connection & Tables ---');

  const wsList = await db.select().from(workspaces);
  console.log('Workspaces:', wsList.length, wsList[0]?.name || 'None');

  const clientList = await db.select().from(clients);
  console.log('Clients count:', clientList.length);

  const staffList = await db.select().from(staff);
  console.log('Staff count:', staffList.length);

  const serviceList = await db.select().from(services);
  console.log('Services count:', serviceList.length);

  const productList = await db.select().from(products);
  console.log('Products count:', productList.length);

  const aptList = await db.select().from(appointments);
  console.log('Appointments count:', aptList.length);

  console.log('✅ ALL NEON DB QUERIES EXECUTED SUCCESSFULLY WITH 0 ERRORS!');
}

testDatabaseQueries().catch((err) => {
  console.error('❌ DB Test error:', err);
  process.exit(1);
});
