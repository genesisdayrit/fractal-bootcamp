import { integer, pgTable, boolean, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

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

export const gameMovesTable = pgTable('game_moves', {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references(() => gamesTable.id, { onDelete: 'cascade' }),
    playerMove: text('player_move').notNull(),
    boardArrayPosition: integer('board_array_position').notNull(),
    updatedBoard: text('board').array(),
    previousBoard: text('board').array(),
    isWinningMove: boolean('is_winning_move').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
});

export type InsertGame = typeof gamesTable.$inferInsert;
export type SelectGame = typeof gamesTable.$inferSelect;

export type InsertGameMove = typeof gameMovesTable.$inferInsert;
export type SelectGameMove = typeof gameMovesTable.$inferSelect;
