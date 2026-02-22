import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_sections" ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "hero_sections" DROP COLUMN IF EXISTS "order";
  `)
}
