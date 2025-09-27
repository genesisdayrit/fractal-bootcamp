import { db } from './index'
import { sql, eq } from 'drizzle-orm';
import { gamesTable, gameMovesTable, type InsertGameMove } from './schema';
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
export const fetchGames = async () => {
    try {

        const rawStatement = sql`SELECT * FROM games ORDER BY updated_at DESC`
        const result = await db.execute(rawStatement)
        
        return result
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

export const fetchGameMoves = async (gameId: string) => {
    try {
        const result = await db
            .select()
            .from(gameMovesTable)
            .where(eq(gameMovesTable.gameId, gameId))
            .orderBy(gameMovesTable.gameMoveNum);
        
        console.log('Game Moves:', result);
        return result;
    } catch (error) {
        console.error('error fetching game moves:', error);
        throw error;
    }
}

export const createGameMove = async (gameMove: InsertGameMove) => {
    try {
        const result = await db.insert(gameMovesTable).values(gameMove).returning()
        console.log('Game move created successfully:', result[0])
        return result[0]
    } catch (error) {
        console.error('Error creating game move:', error)
        throw error
    }
}

export const getMoveNumber = async (gameId: string): Promise<number> => {
    try {
        const moves = await db
            .select()
            .from(gameMovesTable)
            .where(eq(gameMovesTable.gameId, gameId))
        
        return moves.length + 1
    } catch (error) {
        console.error('Error getting next move number:', error)
        return 1
    }
}
