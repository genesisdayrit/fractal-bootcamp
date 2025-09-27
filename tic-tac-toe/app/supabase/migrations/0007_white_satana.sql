ALTER TABLE "game_moves" RENAME COLUMN "board" TO "updated_board";--> statement-breakpoint
ALTER TABLE "game_moves" ADD COLUMN "previous_board" text[];