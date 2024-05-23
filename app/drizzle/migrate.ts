import "dotenv-flow/config";
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "app/drizzle/migrations",
    });
    console.log('Migration completed');
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

main();