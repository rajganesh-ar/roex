import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Create the new availability enum
    CREATE TYPE "public"."enum_products_availability" AS ENUM('available', 'unavailable');

    -- 2. Add availability column to products, default existing rows to 'available'
    ALTER TABLE "products" ADD COLUMN "availability" "enum_products_availability" DEFAULT 'available' NOT NULL;

    -- 3. Drop old pricing/stock columns from products
    ALTER TABLE "products" DROP COLUMN IF EXISTS "price";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "compare_at_price";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "stock";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "low_stock_threshold";
    ALTER TABLE "products" DROP COLUMN IF EXISTS "stock_status";

    -- 4. Drop the old stock status enum
    DROP TYPE IF EXISTS "public"."enum_products_stock_status";

    -- 5. Drop old pricing/stock columns from product variants
    ALTER TABLE "products_variants" DROP COLUMN IF EXISTS "price";
    ALTER TABLE "products_variants" DROP COLUMN IF EXISTS "compare_price";
    ALTER TABLE "products_variants" DROP COLUMN IF EXISTS "stock";

    -- 6. Add parent_id column to categories for subcategory support
    ALTER TABLE "categories" ADD COLUMN "parent_id" integer;
    ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Revert categories parent
    DROP INDEX IF EXISTS "categories_parent_idx";
    ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_parent_id_categories_id_fk";
    ALTER TABLE "categories" DROP COLUMN IF EXISTS "parent_id";

    -- Revert product variants
    ALTER TABLE "products_variants" ADD COLUMN "price" numeric;
    ALTER TABLE "products_variants" ADD COLUMN "compare_price" numeric;
    ALTER TABLE "products_variants" ADD COLUMN "stock" numeric DEFAULT 0;

    -- Revert products
    CREATE TYPE "public"."enum_products_stock_status" AS ENUM('in_stock', 'low_stock', 'out_of_stock');
    ALTER TABLE "products" ADD COLUMN "price" numeric NOT NULL DEFAULT 0;
    ALTER TABLE "products" ADD COLUMN "compare_at_price" numeric;
    ALTER TABLE "products" ADD COLUMN "stock" numeric DEFAULT 0 NOT NULL;
    ALTER TABLE "products" ADD COLUMN "low_stock_threshold" numeric DEFAULT 5;
    ALTER TABLE "products" ADD COLUMN "stock_status" "enum_products_stock_status" DEFAULT 'in_stock';

    -- Drop availability
    ALTER TABLE "products" DROP COLUMN IF EXISTS "availability";
    DROP TYPE IF EXISTS "public"."enum_products_availability";
  `)
}
