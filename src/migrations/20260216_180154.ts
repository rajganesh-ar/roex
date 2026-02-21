import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blog_posts_blocks_image_block_size" AS ENUM('full', 'half', 'third');
  CREATE TYPE "public"."enum_blog_posts_blocks_embed_block_aspect_ratio" AS ENUM('16:9', '4:3', '1:1');
  ALTER TYPE "public"."enum_blog_posts_status" ADD VALUE 'scheduled';
  CREATE TABLE "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_posts_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"alt" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "blog_posts_blocks_text_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_posts_blocks_image_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"size" "enum_blog_posts_blocks_image_block_size" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_posts_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"external_url" varchar,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_posts_blocks_quote_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote_text" varchar NOT NULL,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blog_posts_blocks_embed_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"embed_url" varchar NOT NULL,
  	"caption" varchar,
  	"aspect_ratio" "enum_blog_posts_blocks_embed_block_aspect_ratio" DEFAULT '16:9',
  	"block_name" varchar
  );
  
  ALTER TABLE "blog_posts_tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blog_posts_tags" CASCADE;
  ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_author_avatar_id_media_id_fk";
  
  DROP INDEX "blog_posts_author_author_avatar_idx";
  ALTER TABLE "blog_posts" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "blog_posts" ALTER COLUMN "excerpt" DROP NOT NULL;
  ALTER TABLE "blog_posts" ALTER COLUMN "featured_image_id" SET NOT NULL;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "hero_sections" ADD COLUMN "background_video_id" integer;
  ALTER TABLE "hero_sections" ADD COLUMN "background_video_url" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "author_id" integer NOT NULL;
  ALTER TABLE "blog_posts" ADD COLUMN "scheduled_publish_date" timestamp(3) with time zone;
  ALTER TABLE "blog_posts" ADD COLUMN "reading_time" numeric;
  ALTER TABLE "blog_posts" ADD COLUMN "view_count" numeric DEFAULT 0;
  ALTER TABLE "blog_posts" ADD COLUMN "allow_comments" boolean DEFAULT true;
  ALTER TABLE "blog_posts" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "seo_meta_image_id" integer;
  ALTER TABLE "blog_posts" ADD COLUMN "seo_canonical_u_r_l" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "seo_keywords" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "created_by_id" integer;
  ALTER TABLE "blog_posts" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "blog_posts_rels" ADD COLUMN "blog_categories_id" integer;
  ALTER TABLE "blog_posts_rels" ADD COLUMN "blog_tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_tags_id" integer;
  ALTER TABLE "blog_categories" ADD CONSTRAINT "blog_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_gallery" ADD CONSTRAINT "blog_posts_gallery_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_gallery" ADD CONSTRAINT "blog_posts_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_blocks_text_block" ADD CONSTRAINT "blog_posts_blocks_text_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_blocks_image_block" ADD CONSTRAINT "blog_posts_blocks_image_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_blocks_image_block" ADD CONSTRAINT "blog_posts_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_blocks_video_block" ADD CONSTRAINT "blog_posts_blocks_video_block_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_blocks_video_block" ADD CONSTRAINT "blog_posts_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_blocks_quote_block" ADD CONSTRAINT "blog_posts_blocks_quote_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_blocks_embed_block" ADD CONSTRAINT "blog_posts_blocks_embed_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "blog_categories_name_idx" ON "blog_categories" USING btree ("name");
  CREATE UNIQUE INDEX "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX "blog_categories_image_idx" ON "blog_categories" USING btree ("image_id");
  CREATE INDEX "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_tags_name_idx" ON "blog_tags" USING btree ("name");
  CREATE UNIQUE INDEX "blog_tags_slug_idx" ON "blog_tags" USING btree ("slug");
  CREATE INDEX "blog_tags_updated_at_idx" ON "blog_tags" USING btree ("updated_at");
  CREATE INDEX "blog_tags_created_at_idx" ON "blog_tags" USING btree ("created_at");
  CREATE INDEX "blog_posts_gallery_order_idx" ON "blog_posts_gallery" USING btree ("_order");
  CREATE INDEX "blog_posts_gallery_parent_id_idx" ON "blog_posts_gallery" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_gallery_media_idx" ON "blog_posts_gallery" USING btree ("media_id");
  CREATE INDEX "blog_posts_blocks_text_block_order_idx" ON "blog_posts_blocks_text_block" USING btree ("_order");
  CREATE INDEX "blog_posts_blocks_text_block_parent_id_idx" ON "blog_posts_blocks_text_block" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_blocks_text_block_path_idx" ON "blog_posts_blocks_text_block" USING btree ("_path");
  CREATE INDEX "blog_posts_blocks_image_block_order_idx" ON "blog_posts_blocks_image_block" USING btree ("_order");
  CREATE INDEX "blog_posts_blocks_image_block_parent_id_idx" ON "blog_posts_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_blocks_image_block_path_idx" ON "blog_posts_blocks_image_block" USING btree ("_path");
  CREATE INDEX "blog_posts_blocks_image_block_image_idx" ON "blog_posts_blocks_image_block" USING btree ("image_id");
  CREATE INDEX "blog_posts_blocks_video_block_order_idx" ON "blog_posts_blocks_video_block" USING btree ("_order");
  CREATE INDEX "blog_posts_blocks_video_block_parent_id_idx" ON "blog_posts_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_blocks_video_block_path_idx" ON "blog_posts_blocks_video_block" USING btree ("_path");
  CREATE INDEX "blog_posts_blocks_video_block_video_idx" ON "blog_posts_blocks_video_block" USING btree ("video_id");
  CREATE INDEX "blog_posts_blocks_quote_block_order_idx" ON "blog_posts_blocks_quote_block" USING btree ("_order");
  CREATE INDEX "blog_posts_blocks_quote_block_parent_id_idx" ON "blog_posts_blocks_quote_block" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_blocks_quote_block_path_idx" ON "blog_posts_blocks_quote_block" USING btree ("_path");
  CREATE INDEX "blog_posts_blocks_embed_block_order_idx" ON "blog_posts_blocks_embed_block" USING btree ("_order");
  CREATE INDEX "blog_posts_blocks_embed_block_parent_id_idx" ON "blog_posts_blocks_embed_block" USING btree ("_parent_id");
  CREATE INDEX "blog_posts_blocks_embed_block_path_idx" ON "blog_posts_blocks_embed_block" USING btree ("_path");
  ALTER TABLE "hero_sections" ADD CONSTRAINT "hero_sections_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_seo_meta_image_id_media_id_fk" FOREIGN KEY ("seo_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_blog_tags_fk" FOREIGN KEY ("blog_tags_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_tags_fk" FOREIGN KEY ("blog_tags_id") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "hero_sections_background_video_idx" ON "hero_sections" USING btree ("background_video_id");
  CREATE INDEX "blog_posts_title_idx" ON "blog_posts" USING btree ("title");
  CREATE INDEX "blog_posts_author_idx" ON "blog_posts" USING btree ("author_id");
  CREATE INDEX "blog_posts_status_idx" ON "blog_posts" USING btree ("status");
  CREATE INDEX "blog_posts_published_date_idx" ON "blog_posts" USING btree ("published_date");
  CREATE INDEX "blog_posts_seo_seo_meta_image_idx" ON "blog_posts" USING btree ("seo_meta_image_id");
  CREATE INDEX "blog_posts_created_by_idx" ON "blog_posts" USING btree ("created_by_id");
  CREATE INDEX "blog_posts_updated_by_idx" ON "blog_posts" USING btree ("updated_by_id");
  CREATE INDEX "blog_posts_rels_blog_categories_id_idx" ON "blog_posts_rels" USING btree ("blog_categories_id");
  CREATE INDEX "blog_posts_rels_blog_tags_id_idx" ON "blog_posts_rels" USING btree ("blog_tags_id");
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_locked_documents_rels_blog_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_tags_id");
  ALTER TABLE "hero_sections" DROP COLUMN "background_video";
  ALTER TABLE "blog_posts" DROP COLUMN "category";
  ALTER TABLE "blog_posts" DROP COLUMN "author_name";
  ALTER TABLE "blog_posts" DROP COLUMN "author_role";
  ALTER TABLE "blog_posts" DROP COLUMN "author_avatar_id";
  ALTER TABLE "blog_posts" DROP COLUMN "read_time";
  DROP TYPE "public"."enum_blog_posts_category";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blog_posts_category" AS ENUM('technology', 'lifestyle', 'behind-the-sound', 'product-news', 'partnerships', 'events');
  CREATE TABLE "blog_posts_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  ALTER TABLE "blog_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_text_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_image_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_video_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_quote_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_posts_blocks_embed_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "blog_tags" CASCADE;
  DROP TABLE "blog_posts_gallery" CASCADE;
  DROP TABLE "blog_posts_blocks_text_block" CASCADE;
  DROP TABLE "blog_posts_blocks_image_block" CASCADE;
  DROP TABLE "blog_posts_blocks_video_block" CASCADE;
  DROP TABLE "blog_posts_blocks_quote_block" CASCADE;
  DROP TABLE "blog_posts_blocks_embed_block" CASCADE;
  ALTER TABLE "hero_sections" DROP CONSTRAINT "hero_sections_background_video_id_media_id_fk";
  
  ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_author_id_users_id_fk";
  
  ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_seo_meta_image_id_media_id_fk";
  
  ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_created_by_id_users_id_fk";
  
  ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_updated_by_id_users_id_fk";
  
  ALTER TABLE "blog_posts_rels" DROP CONSTRAINT "blog_posts_rels_blog_categories_fk";
  
  ALTER TABLE "blog_posts_rels" DROP CONSTRAINT "blog_posts_rels_blog_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_tags_fk";
  
  ALTER TABLE "blog_posts" ALTER COLUMN "status" SET DATA TYPE text;
  ALTER TABLE "blog_posts" ALTER COLUMN "status" SET DEFAULT 'draft'::text;
  DROP TYPE "public"."enum_blog_posts_status";
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');
  ALTER TABLE "blog_posts" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."enum_blog_posts_status";
  ALTER TABLE "blog_posts" ALTER COLUMN "status" SET DATA TYPE "public"."enum_blog_posts_status" USING "status"::"public"."enum_blog_posts_status";
  DROP INDEX "hero_sections_background_video_idx";
  DROP INDEX "blog_posts_title_idx";
  DROP INDEX "blog_posts_author_idx";
  DROP INDEX "blog_posts_status_idx";
  DROP INDEX "blog_posts_published_date_idx";
  DROP INDEX "blog_posts_seo_seo_meta_image_idx";
  DROP INDEX "blog_posts_created_by_idx";
  DROP INDEX "blog_posts_updated_by_idx";
  DROP INDEX "blog_posts_rels_blog_categories_id_idx";
  DROP INDEX "blog_posts_rels_blog_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_tags_id_idx";
  ALTER TABLE "blog_posts" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "blog_posts" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "blog_posts" ALTER COLUMN "featured_image_id" DROP NOT NULL;
  ALTER TABLE "hero_sections" ADD COLUMN "background_video" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "category" "enum_blog_posts_category" NOT NULL;
  ALTER TABLE "blog_posts" ADD COLUMN "author_name" varchar NOT NULL;
  ALTER TABLE "blog_posts" ADD COLUMN "author_role" varchar;
  ALTER TABLE "blog_posts" ADD COLUMN "author_avatar_id" integer;
  ALTER TABLE "blog_posts" ADD COLUMN "read_time" numeric;
  ALTER TABLE "blog_posts_tags" ADD CONSTRAINT "blog_posts_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "blog_posts_tags_order_idx" ON "blog_posts_tags" USING btree ("_order");
  CREATE INDEX "blog_posts_tags_parent_id_idx" ON "blog_posts_tags" USING btree ("_parent_id");
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_avatar_id_media_id_fk" FOREIGN KEY ("author_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "blog_posts_author_author_avatar_idx" ON "blog_posts" USING btree ("author_avatar_id");
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "hero_sections" DROP COLUMN "background_video_id";
  ALTER TABLE "hero_sections" DROP COLUMN "background_video_url";
  ALTER TABLE "blog_posts" DROP COLUMN "author_id";
  ALTER TABLE "blog_posts" DROP COLUMN "scheduled_publish_date";
  ALTER TABLE "blog_posts" DROP COLUMN "reading_time";
  ALTER TABLE "blog_posts" DROP COLUMN "view_count";
  ALTER TABLE "blog_posts" DROP COLUMN "allow_comments";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_meta_title";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_meta_description";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_meta_image_id";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_canonical_u_r_l";
  ALTER TABLE "blog_posts" DROP COLUMN "seo_keywords";
  ALTER TABLE "blog_posts" DROP COLUMN "created_by_id";
  ALTER TABLE "blog_posts" DROP COLUMN "updated_by_id";
  ALTER TABLE "blog_posts_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "blog_posts_rels" DROP COLUMN "blog_tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_tags_id";
  DROP TYPE "public"."enum_blog_posts_blocks_image_block_size";
  DROP TYPE "public"."enum_blog_posts_blocks_embed_block_aspect_ratio";`)
}
