import { db } from './index';
import { users, customers, products, inventory, jobs } from './schema';
import { hash } from 'bcryptjs';

/**
 * Seed Script
 * Run with `npm run seed` or `tsx src/db/seed.ts`
 */
async function seed() {
  console.log('🌱 Starting seed...');

  // 1. Clean existing data
  await db.delete(jobs);
  await db.delete(inventory);
  await db.delete(products);
  await db.delete(customers);
  await db.delete(users);

  // 2. Create Users
  const passwordHash = await hash('password123', 10);
  
  const [owner] = await db.insert(users).values([
    {
      name: 'Alice Owner',
      email: 'alice@auricrypt.com',
      passwordHash,
      role: 'owner',
      phoneNumber: '555-0101',
    },
    {
      name: 'Bob Manager',
      email: 'bob@auricrypt.com',
      passwordHash,
      role: 'manager',
      phoneNumber: '555-0102',
    },
    {
      name: 'Charlie Plumber',
      email: 'charlie@auricrypt.com',
      passwordHash,
      role: 'staff',
      phoneNumber: '555-0103',
    },
  ]).returning();

  const staffId = owner.find((u: any) => u.role === 'staff')!.id;

  // 3. Create Products
  const [product1, product2, product3] = await db.insert(products).values([
    { name: 'Standard Pipe Wrench', sku: 'TOOL-001', unitPrice: '45.00', unitType: 'each' },
    { name: 'PVC Pipe 1/2 inch', sku: 'PART-PVC-12', unitPrice: '2.50', unitType: 'ft' },
    { name: 'Labor Hour', sku: 'SVC-LABOR', unitPrice: '120.00', unitType: 'hour' },
  ]).returning();

  // 4. Create Customers
  const [customer1] = await db.insert(customers).values([
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-9999',
      addressLine1: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      notes: 'Dog in backyard, please close gate.',
    },
  ]).returning();

  // 5. Create Inventory (Stock on Charlie's truck)
  await db.insert(inventory).values([
    { staffId, productId: product1.id, quantityOnHand: 2 },
    { staffId, productId: product2.id, quantityOnHand: 50 },
  ]);

  // 6. Create a Job
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const [job1] = await db.insert(jobs).values([
    {
      customerId: customer1.id,
      staffId,
      title: 'Kitchen Sink Leak Repair',
      description: 'Replace p-trap and supply lines under kitchen sink.',
      scheduledStart: tomorrow,
      scheduledEnd: new Date(tomorrow.getTime() + 60 * 60 * 1000), // +1 hour
      status: 'scheduled',
    },
  ]).returning();

  console.log('✅ Seed completed successfully');
  console.log('Owner Login: alice@auricrypt.com / password123');
  console.log('Staff Login: charlie@auricrypt.com / password123');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});