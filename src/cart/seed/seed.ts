import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

(async () => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DATABASE } = process.env;

  const dbOptions = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASS,
    sel: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
  };

  const client = new Client(dbOptions);
  
  try {
    await client.connect();

    await client.query(`
        create type cart_status as enum ('OPEN', 'ORDERED')
    `);

    await client.query(`
        create table if not exists carts (
            id uuid PRIMARY KEY,
            user_id uuid NOT NULL,
            created_at date NOT NULL,
            updated_at date NOT NULL,
            status cart_status
        )
    `);

    await client.query(`
        insert into carts (id, user_id, created_at, updated_at, status) values
        ('a4172db0-e5d4-4e49-841a-173eae6c798e', '6a31c4d9-e9d9-4299-bff2-7d8e26c20915', '2023-05-16', '2023-05-16', 'OPEN'),
        ('e4a12dfd-55f3-44fa-9ce9-61d9ef501c80', '1f2b1310-3135-47b5-850b-7619885c44fa', '2023-05-10', '2023-05-12', 'ORDERED')
    `);

    await client.query(`
        create table if not exists cart_items (
            cart_id uuid,
            FOREIGN KEY (cart_id) REFERENCES carts (id),
            product_id uuid,
            count integer
            
        )
    `);

    await client.query(`
        insert into cart_items (cart_id, product_id, count) values
        ('a4172db0-e5d4-4e49-841a-173eae6c798e', 'dd9fc27f-bc40-4eb4-a8a6-75a9051c2f5d', 2)
    `);
  } catch (err) {
    console.log('Error during DB population', err);
  } finally {
    client.end();
  }
})();
