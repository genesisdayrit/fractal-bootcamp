import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, makeMove, type GameState } from "./tictactoe";
import { randomUUID } from 'crypto';

const app = express();
app.use(express.json())
app.use((req,res,next)=>{ console.log(req.method, req.url); next(); })

let games = new Map<string, GameState>()

// create a game id and initial gamestate
app.post("/api/create", (req, res) => {
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
app.get("/api/game/:id", (req, res) => {
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
app.get("/api/message", (_, res) => res.send("Hello from express!"));


// app.get("/api/game", (_, res) => res.json(gameState))

// get games
app.get("/api/games", (_, res) => res.json(Array.from(games.keys())))

// update gameState for specific game id
app.post("/api/game/:id/move", (req, res) => {
    const moveRequest = req.body
    const cellIndex = moveRequest.boardIndex
    const gameId = moveRequest.id

    const prev = games.get(gameId); if (!prev) return 404;
    const updatedGameState = makeMove(prev, cellIndex); 
    games.set(gameId, updatedGameState);

    console.log('Data received:', moveRequest, updatedGameState)
    res.json( {ok: true, updatedGameState} )
})

app.post("/api/game/:id/reset", (req, res) => {
    const gameId = req.params.id
    const prev = games.get(gameId)
    const gameState = initialGameState()
    games.set(gameId, gameState)
    console.log(prev)
    console.log('Reset request received', gameState)
    res.json( {ok: true, gameState} )
})
    


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));