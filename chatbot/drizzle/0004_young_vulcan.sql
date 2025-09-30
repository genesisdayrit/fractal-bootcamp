ALTER TABLE "thread" RENAME TO "chat";--> statement-breakpoint
ALTER TABLE "thread_message" RENAME TO "chat_message";--> statement-breakpoint
ALTER TABLE "chat_message" RENAME COLUMN "thread_id" TO "chat_id";--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "thread_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_message" DROP CONSTRAINT "thread_message_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "chat_message" DROP CONSTRAINT "thread_message_thread_id_thread_id_fk";
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chat_id_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("id") ON DELETE no action ON UPDATE no action;