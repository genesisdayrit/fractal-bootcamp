import { db } from './index'
import { sql, eq } from 'drizzle-orm';
import { gamesTable } from './schema';
import type { GameState } from '../tictactoe'


// test supabase connection
export const testConnection = async () => {
    try {

        const rawStatement = sql`SELECT 1 FROM games`
        const result = await db.execute(rawStatement)
        console.log('Supabase Successfully Connected')
        console.log('DATABASE_URL exists:', process.env.DATABASE_URL)
        return result
    } catch (error) {
        console.log('Error testing Supabase connection', error)
    }
}


// export const testConnection = async () => {
//     try {
//         console.log('Attempting database connection...')
//         console.log('DATABASE_URL exists:', process.env.DATABASE_URL)
//         const rawStatement = sql`SELECT 1 FROM games`
//         const result = await db.execute(rawStatement)
//         console.log('Supabase Successfully Connected')
//         return result
//     } catch (error) {
//         console.log('Error testing Supabase connection')
//         console.log('Error name:', error.name)
//         console.log('Error message:', error.message)
//         console.log('Full error:', error)
//     }
// }

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

// Raw SQL update gameState -- can't get the Board to work, but so close!!!
// export const updateGameState = async (id: String, gameState: GameState) => {

// working sql in supabase UI

// UPDATE games
//   SET 
//       board = ARRAY['', '', '', '', '', '', '', '', ''],
//       current_player = 'X',
//       game_status = 'new game',
//       winner = null,
//       updated_at = NOW()
//   WHERE id = '6cc91d89-1fe3-439a-80b9-ec26dd86a35f'
//   RETURNING id, board, current_player, game_status, winner


//     const {currentPlayer, gameStatus, winner, board} = gameState
//     const boardString = JSON.stringify(board)
//     console.log(boardString)
//     try {
//         const rawStatement = sql`
//             UPDATE games
//             SET 
//                 board = ARRAY[${boardString}],
//                 current_player = ${currentPlayer},
//                 game_status = ${gameStatus},
//                 winner = ${winner},
//                 updated_at = NOW()
//             WHERE id = ${id}
//             RETURNING id, board, current_player, game_status, winner
//         `
//         const result = await db.execute(rawStatement)

//         if (result.length === 0) throw new Error('Update failed (no row)')
//         console.log(result)
//     } catch (error) {
//         console.error('Error updating Game ID:', error)
//     }
// }

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
