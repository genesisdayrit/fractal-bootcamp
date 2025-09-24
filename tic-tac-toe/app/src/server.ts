import express from "express";
import ViteExpress from "vite-express";
import { initialGameState, type GameState } from "./tictactoe";

const app = express();
app.use(express.json())

let gameState = initialGameState

app.use((req,res,next)=>{ console.log(req.method, req.url); next(); })

app.get("/api/message", (_, res) => res.send("Hello from express!"));
app.get("/api/game", (_, res) => res.json(gameState))
    

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));