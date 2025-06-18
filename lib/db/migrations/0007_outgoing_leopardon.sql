ALTER TABLE "AiModel" ADD COLUMN "apiKeyName" text;
--> statement-breakpoint
ALTER TABLE "AiModel" ADD COLUMN "encryptedApiKey" text NOT NULL DEFAULT '';