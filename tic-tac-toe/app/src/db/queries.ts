import { db } from './index'
import { sql } from 'drizzle-orm';
import { AnyPgTable } from "drizzle-orm/pg-core";

export const testConnection = async (table: AnyPgTable) => {
    try {

        const rawStatement = sql`SELECT 1 FROM games`
        const result = await db.execute(rawStatement)
        console.log('Supabase Successfully Connected')
        return result
    } catch (error) {
        console.log('Error testing Supabase connection', error)
    }
}

export const fetchGameIds = async (table: AnyPgTable) => {
    try {
        
        const rawStatement = sql`SELECT id FROM games ORDER BY updated_at DESC`
        const rows = await db.execute(rawStatement)
        const gameIds = rows.map(row => row.id)

        return gameIds
    } catch (error) {
        console.error('Error fetching Game IDs:', error)
    } finally {}
}