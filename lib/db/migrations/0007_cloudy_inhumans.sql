ALTER TABLE "AiModel" ADD COLUMN "apiKeyName" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "AiModel" ADD COLUMN "encryptedApiKey" text NOT NULL;