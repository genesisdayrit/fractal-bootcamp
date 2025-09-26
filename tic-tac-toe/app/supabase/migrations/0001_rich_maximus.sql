CREATE TABLE "games_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cell" text[],
	"game_status" text NOT NULL,
	"current_player" text NOT NULL,
	"winner" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
