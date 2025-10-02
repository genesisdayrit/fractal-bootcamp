import { db } from './db'
import { sql, eq } from 'drizzle-orm';
import { chatTable, chatMessagesTable } from './schema';

// test supabase connection
export const testConnection = async () => {
    try {

        const rawStatement = sql`SELECT 1 FROM chat`
        const result = await db.execute(rawStatement)
        console.log('Supabase Successfully Connected')
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
        return result
    } catch (error) {
        console.log('Error testing Supabase connection', error)
    }
}

// return all chats for testing
export const fetchChats = async () => {
    try {
        const rawStatement = sql`SELECT * FROM chat ORDER BY updated_at DESC`
        const result = await db.execute(rawStatement)
        
        return result
    } catch (error) {
        console.error('Error fetching Game IDs:', error)
        throw error
    } finally {}
}

// start and insert a brand new chat thread
export const createChat = async (id: string, userId: string, chatTitle?: string) => {
    try {
        const chatId = id

        const result = await db.insert(chatTable).values({
            id: id,
            userId: userId,
            chatTitle: chatTitle,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning()

        const newChatRecord = result[0]
        console.log(newChatRecord)
        return newChatRecord
    } catch (error) {
        console.log(error)
    }
}

// insert a chat message that is already associated with a chat ID
// figure out how to set flexible object type for modelConfig - since might not always have same config
export const insertChatMessage = async (id: string, chatId: string, userId: string, message: string, role: string, modelConfig: any) => {
    try {

        const result = await db.insert(chatMessagesTable).values({
            id: id,
            chatId: chatId,
            userId: userId,
            message: message,
            modelConfig: modelConfig,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning()

        const newChatMessageRecord = result[0]
        console.log(newChatMessageRecord)
        return newChatMessageRecord
    } catch (error) {
        console.log(error)
    }
}