import { db } from './index'
import { sql } from 'drizzle-orm';
import { AnyPgTable } from "drizzle-orm/pg-core";

export const fetchGameIds = async (table: AnyPgTable) => {
    try {
        
        const rawStatement = sql`SELECT id FROM games ORDER BY updated_at DESC`
        const rows = await db.execute(rawStatement)
        const gameIds = rows.map(row => row.id)

        return gameIds
    } catch (error) {
        console.error('Error connecting to Supabase with Drizzle:', error)
    } finally {}
}