import process from 'node:process';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export interface DatabaseOptions {
  applicationName?: string;
  connectionString?: string;
  maxConnections?: number;
}

export function createDatabase(options: DatabaseOptions = {}) {
  const connectionString = options.connectionString ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to create a database connection');
  }

  const pool = new Pool({
    application_name: options.applicationName ?? 'kuxmate',
    connectionString,
    max: options.maxConnections ?? 10,
  });

  return {
    db: drizzle(pool),
    pool,
  };
}
