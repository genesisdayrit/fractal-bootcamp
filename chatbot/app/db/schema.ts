import { integer, pgTable, varchar, uuid, timestamp, text, json} from "drizzle-orm/pg-core";
import { user } from './auth-schema'

export const chat = pgTable('chat', {
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

export const chatMessage = pgTable('chat_message', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    chatId: uuid('chat_id')
        .notNull()
        .references(() => chat.id),
    message: text('title'),
    modelConfig: json('model_config'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

