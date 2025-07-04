ALTER TABLE "blogknow_post" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "blogknow_post" ADD COLUMN "published" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "blogknow_post" ADD COLUMN "views" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "blogknow_post" ADD COLUMN "publishedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blogknow_post" ADD COLUMN "imageUrl" varchar(512);