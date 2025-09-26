import express, { Request, Response } from 'express';
import ViteExpress from "vite-express";
import { initialGameState, makeMove, type GameState } from "./tictactoe";
import { randomUUID } from 'crypto';
import { db } from './db/index'
import { gamesTable } from './db/schema'


// currentPlayer: text('current_player').notNull(),
//     winner: text('winner'),
//     createdAt: timestamp('created_at').notNull().defaultNow(),
//     updatedAt: timestamp('updated_at')

async function fetchGameIds(): Promise<string[]> {
    try {
        const rows = await db.select({id: gamesTable.id}
        ).from(gamesTable);

        const gameIds = rows.map(r => r.id)
        console.log('Successfully connected to supabase and fetched data:', gameIds)

        console.log('request received')

        return gameIds
        // await db.insert(gamesTable).values(
        //     { 
        //         id: randomUUID(),
        //         board: [Array(9).fill('')],
        //         gameStatus: 'new game',
        //         currentPlayer: 'X',
        //         winner: null,
        //         // createdAt: new Date(),
        //         updatedAt: new Date()  
        //     });
        // console.log('Successfully inserted data.');

    } catch (error) {
        console.error('Error connecting to Supabase with Drizzle:', error)
    } finally {}
}

// getGameIds()

async function testConnection() {
    try {
        const games = await db.select().from(gamesTable);
        console.log('Successfully connected to supabase and fetched data:', games)

        // await db.insert(gamesTable).values(
        //     { 
        //         id: randomUUID(),
        //         board: [Array(9).fill('')],
        //         gameStatus: 'new game',
        //         currentPlayer: 'X',
        //         winner: null,
        //         // createdAt: new Date(),
        //         updatedAt: new Date()  
        //     });
        // console.log('Successfully inserted data.');

    } catch (error) {
        console.error('Error connecting to Supabase with Drizzle:', error)
    } finally {

    }
}

testConnection();

const app = express();
app.use(express.json())

let games = new Map<string, GameState>()

// create a game id and initial gamestate
app.post("/api/create", (req: Request, res: Response) => {
    // create a random uuid
    let gameId = randomUUID()

    // set an initial game state
    let gameState = initialGameState()
    games.set(gameId, gameState)
    console.log(gameId)
    console.log(games)

    // send an object back with the id and boardstate
    res.json( {ok: true, id: gameId, boardState: gameState} )
})

// return the gameState for specific gameId
app.get("/api/game/:id", (req: Request, res: Response) => {
    // receive the game id from the component
        const gameId = req.params.id
        const gameState = games.get(gameId)

        if (gameState) {
            res.json(gameState)
        } else {
            res.status(404).send('Game not found')
        }
})

// test message
app.get("/api/message", (req: Request, res: Response) => res.send("Hello from express!"));


// app.get("/api/game", (_, res) => res.json(gameState))

// get games
// app.get("/api/games", (req: Request, res: Response) => res.json(Array.from(games.keys())))
// app.get("/api/games", (req: Request, res: Response) => res.send(getGameIds))

app.get("/api/games", async (req: Request, res: Response) => {
    try {
        const result = await fetchGameIds()
        res.json(result)
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({'Failed to retrieve data': error})
    }
})

// update gameState for specific game id
app.post("/api/game/:id/move", (req: Request, res: Response) => {
    const moveRequest = req.body
    const cellIndex = moveRequest.cellPosition
    const gameId = moveRequest.id

    const prev = games.get(gameId); if (!prev) return 404;
    const updatedGameState = makeMove(prev, cellIndex); 
    games.set(gameId, updatedGameState);

    console.log('Data received:', moveRequest, updatedGameState)
    res.json( {ok: true, updatedGameState} )
})

app.post("/api/game/:id/reset", (req: Request, res: Response) => {
    const gameId = req.params.id
    const prev = games.get(gameId)
    const gameState = initialGameState()
    games.set(gameId, gameState)
    console.log(prev)
    console.log('Reset request received', gameState)
    res.json( {ok: true, gameState} )
})
    


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));