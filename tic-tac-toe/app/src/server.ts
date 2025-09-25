import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, makeMove, type GameState } from "./tictactoe";
import { randomUUID } from 'crypto';

const app = express();
app.use(express.json())

// list the games
// let gameState  = initialGameState()

// let {gameState: GameState} = initialGameState

let games = new Map<string, GameState>()


app.use((req,res,next)=>{ console.log(req.method, req.url); next(); })

// add a /games endpoint to fetch all of the games and display in the server

// add a /create endpoint to create a new game

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

app.get("/api/message", (_, res) => res.send("Hello from express!"));

app.get("/api/game", (_, res) => res.json(gameState))

app.get("/api/games", (_, res) => res.json(Array.from(games.keys())))

// Old api/move
// app.post("/api/move", (req, res) => {
//     const moveRequest = req.body
//     const cellIndex = moveRequest.boardIndex
//     gameState = makeMove(gameState, cellIndex)
//     console.log('Data received:', moveRequest, gameState)
//     res.json( {ok: true, gameState} )
// })


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

// Old Reset Game End point
// app.post("/api/reset", (req, res) => {
//     gameState = initialGameState()
//     console.log('Reset request received', gameState)
//     res.json( {ok: true, gameState} )
// })

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