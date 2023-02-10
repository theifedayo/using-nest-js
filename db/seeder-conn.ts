import { createConnection } from 'typeorm';
import { Seeder } from './seeder';

createConnection().then(async (connection) => {
  const seeder = new Seeder(connection);
  await connection.close();
});




