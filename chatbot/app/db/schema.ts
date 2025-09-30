import { integer, pgTable, varchar, uuid, timestamp, text, json} from "drizzle-orm/pg-core";
import { user } from './auth-schema'

export const thread = pgTable('thread', {
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

export const threadMessage = pgTable('thread_message', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id),
    threadId: uuid('thread_id')
        .notNull()
        .references(() => thread.id),
    message: text('title'),
    modelConfig: json('model_config'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

