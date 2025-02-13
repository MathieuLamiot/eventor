import { createConnection } from 'typeorm';

export async function setupTestDatabase() {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'eventuser',
    password: 'eventpass',
    database: 'eventdb_test',
    entities: ['./**/*.entity.ts'],
    synchronize: true,
  });

  await connection.synchronize(true); // This will drop and recreate tables
  await connection.close();
}
