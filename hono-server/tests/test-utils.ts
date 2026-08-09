import { newDb, DataType } from 'pg-mem';
import { drizzle } from 'drizzle-orm/pg-mem';
import * as schema from '../src/db/schema.js';
import { setTestDb } from '../src/db/index.js';

export function createTestDatabase() {
  const memDb = newDb();

  // Register Postgres extension functions needed by Drizzle
  memDb.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: () => crypto.randomUUID(),
  });

  memDb.public.registerFunction({
    name: 'now',
    returns: DataType.timestamp,
    implementation: () => new Date(),
  });

  memDb.public.registerFunction({
    name: 'current_timestamp',
    returns: DataType.timestamp,
    implementation: () => new Date(),
  });

  // Create Enum and Tables matching src/db/schema.ts
  memDb.public.none(`
    CREATE TYPE priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );

    CREATE TABLE refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );

    CREATE TABLE todos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      is_completed BOOLEAN DEFAULT FALSE NOT NULL,
      priority priority_enum DEFAULT 'MEDIUM' NOT NULL,
      due_date TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );

    CREATE INDEX users_email_idx ON users (email);
    CREATE INDEX refresh_tokens_token_idx ON refresh_tokens (token);
    CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens (user_id);
    CREATE INDEX todos_user_id_idx ON todos (user_id);
  `);

  const drizzleDb = drizzle(memDb, { schema });
  setTestDb(drizzleDb as any);
  return drizzleDb;
}
