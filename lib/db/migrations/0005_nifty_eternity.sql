CREATE TABLE IF NOT EXISTS "AiModel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar NOT NULL,
	"modelId" varchar(100) NOT NULL,
	"modelName" varchar(100) NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp NOT NULL,
	"totalUsers" integer DEFAULT 0 NOT NULL,
	"activeUsers" integer DEFAULT 0 NOT NULL,
	"totalChats" integer DEFAULT 0 NOT NULL,
	"totalMessages" integer DEFAULT 0 NOT NULL,
	"apiCalls" integer DEFAULT 0 NOT NULL,
	"errors" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ApiKey" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" varchar NOT NULL,
	"keyName" varchar(100) NOT NULL,
	"encryptedKey" text NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SystemSettings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"updatedBy" uuid NOT NULL,
	CONSTRAINT "SystemSettings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" varchar DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SystemSettings" ADD CONSTRAINT "SystemSettings_updatedBy_User_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
