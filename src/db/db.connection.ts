import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import dotenv from 'dotenv';

import { DB_CONNECTION } from '../constants';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DATABASE } = process.env;

const dbProvider = {
  provide: DB_CONNECTION,
  useValue: new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASS,
    port: DB_PORT,
  }),
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
