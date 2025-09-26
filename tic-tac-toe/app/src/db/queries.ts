import { db } from './index'
import { sql } from 'drizzle-orm';
import { AnyPgTable } from "drizzle-orm/pg-core";


// test supabase connection
export const testConnection = async () => {
    try {

        const rawStatement = sql`SELECT 1 FROM games`
        const result = await db.execute(rawStatement)
        console.log('Supabase Successfully Connected')
        return result
    } catch (error) {
        console.log('Error testing Supabase connection', error)
    }
}

// fetch all game ids
export const fetchGameIds = async () => {
    try {

        const rawStatement = sql`SELECT id FROM games ORDER BY updated_at DESC`
        const rows = await db.execute(rawStatement)
        const gameIds = rows.map(row => row.id)

        return gameIds
    } catch (error) {
        console.error('Error fetching Game IDs:', error)
    } finally {}
}

// fetch a single game id
export const fetchGame = async (id: String) => {
    try {
        const rawStatement = sql`SELECT * FROM games WHERE id = ${id}`
        const result = await db.execute(rawStatement)
        const gameId = result[0].id
        const gameState = {
            id: result[0].id,
            currentPlayer: result[0].current_player,
            board: result[0].board,
            gameStatus: result[0].game_status,
            winner: result[0].winner
        }
        return gameState
    } catch (error) {
        console.error('Error fetching Game ID:', error)
    } finally {}
}