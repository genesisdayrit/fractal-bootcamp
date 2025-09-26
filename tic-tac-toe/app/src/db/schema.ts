import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const gamesTable = pgTable('games', {
    id: uuid('id').primaryKey().defaultRandom(),
    board: text('board').array(),
    gameStatus: text('game_status').notNull(),
    currentPlayer: text('current_player').notNull(),
    winner: text('winner'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  });

export type InsertGame = typeof gamesTable.$inferInsert;
export type SelectGame = typeof gamesTable.$inferSelect;
