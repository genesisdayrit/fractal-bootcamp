import express, { Request, Response } from 'express';
import ViteExpress from "vite-express";
import { initialGameState, makeMove, type GameState } from "./tictactoe";
import { randomUUID } from 'crypto';
import { testConnection, fetchGames, fetchGame, updateGameState, createGame, fetchGameMoves, createGameMove, getMoveNumber, deleteGameMoves } from './db/queries';
import OpenAI from 'openai';
require('dotenv').config();

// const openai = new OpenAI();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

// Check for successful supabase connection
testConnection()

const app = express();
app.use(express.json())

// create a game id and initial gamestate
app.post("/api/create", (req: Request, res: Response) => {
    // create a random uuid
    let gameId = randomUUID()

    // set an initial game state
    let gameState = initialGameState()

    createGame(gameId, gameState)
    console.log(gameId)

    // send an object back with the id and boardstate
    res.json( {ok: true, id: gameId, boardState: gameState} )
})

// new fetch game id
app.get("/api/game/:id", async (req: Request, res: Response) => {
    // receive the game id from the component
        const gameId = req.params.id
        try {
            const gameState = await fetchGame(gameId)
            res.json(gameState)
            console.log("Fetched Game State:", gameState)

        } catch (error) {
            console.error("Error:", error)
            res.status(500).json({'Failed to retrieve data': error})
        }
})

// get game moves for game id
app.get("/api/game/:id/game-moves", async (req: Request, res: Response) => {
    // receive the game id from the component
        const gameId = req.params.id
        try {
            const gameMoves = await fetchGameMoves(gameId)
            res.json(gameMoves)
            console.log("Fetched Game Moves:", gameMoves)

        } catch (error) {
            console.error("Error:", error)
            res.status(500).json({'Failed to retrieve data': error})
        }
})

// get gameIds
app.get("/api/games", async (req: Request, res: Response) => {
    try {
        const result = await fetchGames()
        res.json(result)
        console.log("Fetch Games:", result);
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({'Failed to retrieve data': error})
    }
})

// update gameState for specific game id with database persistence
app.post("/api/game/:id/move", async (req: Request, res: Response) => {
    try {
        const moveRequest = req.body
        const cellIndex = moveRequest.cellPosition as number
        const gameId = req.params.id

        console.log('Move request received:', { gameId, cellIndex })

        // Fetch current game state from database
        const currentGameState = await fetchGame(gameId)
        if (!currentGameState) {
            return res.status(404).json({ error: 'Game not found' })
        }

        // Apply the move
        const updatedGameState = makeMove(currentGameState, cellIndex)
        
        // Save updated state to database
        const savedGame = await updateGameState(gameId, updatedGameState)
        
        const moveData = {
            gameId: gameId,
            playerMove: currentGameState.currentPlayer,
            gameMoveNum: await getMoveNumber(gameId),
            boardArrayPosition: cellIndex,
            updatedBoard: updatedGameState.board,
            previousBoard: currentGameState.board,
            isWinningMove: (updatedGameState.gameStatus === 'X' || updatedGameState.gameStatus === 'O')
        }
        
        await createGameMove(moveData)
        
        console.log('Move processed successfully:', savedGame)
        res.json({ ok: true, gameState: updatedGameState })
        
    } catch (error) {
        console.error("Error processing move:", error)
        res.status(500).json({ error: 'Failed to process move', details: error })
    }
})

app.post("/api/game/:id/reset", async (req: Request, res: Response) => {
    const gameId = req.params.id

    try {
        // delete game moves
        await deleteGameMoves(gameId)

        // set to initial game state
        const gameState = initialGameState()
        await updateGameState(gameId, gameState)

        console.log('Reset request received', gameState)
        res.json( {ok: true, gameState} )
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to reset game', details: error })
    }
    
})

app.post('/api/recommend-move', async (req, res) => {
    const { boardState, currentPlayer } = req.body; 

    console.log(req.body)
    const systemPrompt = `You are a tic-tac toe playing expert, the current state of the board is ${boardState} 
    and the current player to move is ${currentPlayer}. Please recommend a next move and explain your reasoning. 
    Speak in terms of human decipherable language (top-left, center, bottom-right, etc.) instead of cell array positions.`

    if (!boardState || !currentPlayer) {
        return res.status(400).json({error: 'Board State not available'})
    }
    try {
        console.log(`Attempting AI Response for ${systemPrompt}`)
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: systemPrompt }],
            max_tokens: 400
        })

        console.log(completion)

        const openaiResponse = completion.choices[0].message.content;

        const parseRecommendedMovePrompt = `You are helping recommend a tic-tac-toe move. 
        Based on the response from ${openaiResponse}, please return just the concise recommendeded 
        answe rto pass back to the user including the player (e.g. X to Middle Bottom Row). 
        `

        const parsedResponseCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: parseRecommendedMovePrompt },
            ]
        })

        const parsedResponse = parsedResponseCompletion.choices[0].message.content
        res.status(200).json({ok: true, recommendedAction: openaiResponse, parsedResponse: parsedResponse})

    } catch (error) {
        res.status(500).json({ error: 'Failed to get OpenAI response'})
    }
})
    


ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));