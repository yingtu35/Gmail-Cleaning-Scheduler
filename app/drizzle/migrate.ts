import "dotenv-flow/config";
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import log from "../../utils/log";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "app/drizzle/migrations",
    });
    log.info("Migration completed successfully");
  } catch (error) {
    log.error("Migration failed", error);
    process.exit(1);
  }
};

main();