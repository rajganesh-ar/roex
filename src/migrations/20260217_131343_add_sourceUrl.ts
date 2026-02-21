import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "source_url" varchar;
  CREATE INDEX "products_source_url_idx" ON "products" USING btree ("source_url");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "products_source_url_idx";
  ALTER TABLE "products" DROP COLUMN "source_url";`)
}
