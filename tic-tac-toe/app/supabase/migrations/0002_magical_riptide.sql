DROP TABLE "posts_table" CASCADE;--> statement-breakpoint
DROP TABLE "users_table" CASCADE;--> statement-breakpoint
ALTER TABLE "games_table" RENAME TO "games";--> statement-breakpoint
ALTER TABLE "games" RENAME COLUMN "cell" TO "board";