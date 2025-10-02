ALTER TABLE "chat_message" ADD COLUMN "role" text;
ALTER TABLE "chat_message" RENAME COLUMN "title" TO "message";