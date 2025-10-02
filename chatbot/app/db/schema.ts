import { integer, pgTable, varchar, uuid, timestamp, text, json} from "drizzle-orm/pg-core";
import { user } from './auth-schema'

export const chatTable = pgTable('chat', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    chatTitle: text('title'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export const chatMessagesTable = pgTable('chat_message', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    chatId: uuid('chat_id')
        .notNull()
        .references(() => chatTable.id),
    message: text('message'),
    role: text('role'),
    modelConfig: json('model_config'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export type InsertChat = typeof chatTable.$inferInsert;
export type SelectChat = typeof chatTable.$inferSelect;

export type InsertChatMessage = typeof chatMessagesTable.$inferInsert;
export type SelectChatMessage = typeof chatMessagesTable.$inferSelect;