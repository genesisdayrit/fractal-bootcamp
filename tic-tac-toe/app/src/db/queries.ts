import { db } from './index'
import { sql, eq } from 'drizzle-orm';
import { gamesTable } from './schema';
import { type GameState } from '../tictactoe'

// test supabase connection
export const testConnection = async () => {
    try {

        const rawStatement = sql`SELECT 1 FROM games`
        const result = await db.execute(rawStatement)
        console.log('Supabase Successfully Connected')
        console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
        return result
    } catch (error) {
        console.log('Error testing Supabase connection', error)
    }
}

    // currentPlayer: 'X',
    // board: Array(9).fill(''),
    // gameStatus: 'new game',
    // winner: null

export const createGame = async (id: string, initialGameState: GameState) => {
    try {
        const {currentPlayer, board, gameStatus, winner } = initialGameState
        const gameId = id
        const result = await db.insert(gamesTable).values({
             id: gameId,
             board: board,
             gameStatus: gameStatus,
             currentPlayer: currentPlayer,
             winner: winner,
             createdAt: new Date(),
             updatedAt: new Date(),
            }).returning()
            
            const newGameRecord = result[0]
            console.log('Game created successfully:', newGameRecord)
            return newGameRecord
    } catch (error) {
    console.error('error creating game:', error)
    throw error
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
        throw error
    } finally {}
}

// fetch a single game id
export const fetchGame = async (id: String) => {
    try {
        const rawStatement = sql`SELECT * FROM games WHERE id = ${id}`
        const result = await db.execute(rawStatement)
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
        throw error
    } finally {}
}

// drizzle version
export const updateGameState = async (id: string, gameState: GameState) => {
    const {currentPlayer, gameStatus, winner, board} = gameState
    console.log('Updating game with board:', board)
    try {
        const result = await db.update(gamesTable).set({
            board: board,
            currentPlayer: currentPlayer,
            gameStatus: gameStatus,
            winner: winner, 
            updatedAt: new Date()
        }).where(eq(gamesTable.id, id)).returning()
        
        if (result.length === 0) throw Error('Update failed (no row)')
        console.log('update successful:', result[0])
        return result[0]
    } catch (error) {
        console.error('error updating Game ID:', error)
        throw error
    }
}
