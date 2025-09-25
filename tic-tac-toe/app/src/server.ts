import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, makeMove, type GameState } from "./tictactoe";
// import uuid

const app = express();
app.use(express.json())

// list the games
// let games = new Map<string, GameState>()

let gameState  = initialGameState

app.use((req,res,next)=>{ console.log(req.method, req.url); next(); })

// add a /games endpoint to fetch all of the games and display in the server

// add a /create endpoint to create a new game

// add a /games/:id endpoing to fetch a single game


app.get("/api/message", (_, res) => res.send("Hello from express!"));

app.get("/api/game", (_, res) => res.json(gameState))

app.post("/api/move", (req, res) => {
    const moveRequest = req.body
    const cellIndex = moveRequest.boardIndex
    gameState = makeMove(gameState, cellIndex)
    console.log('Data received:', moveRequest, gameState)
    res.json( {ok: true, gameState} )
})

app.post("/api/reset", (req, res) => {
    gameState = initialGameState
    console.log('Reset button pressed', gameState)
    res.json( {ok: true, gameState} )
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));