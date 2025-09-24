import { useState } from 'react'
import { initialGameState, makeMove, getGameStatusMessage, resetGame, type GameState } from '../tictactoe'


export default function Gameboard() {
  const [gameState, setGameState] = useState<GameState>(initialGameState())
  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <h3>{getGameStatusMessage(gameState)}</h3>
      <div className="
        grid grid-cols-3
        gap-[6px]             
        bg-black              
        p-[6px]               
        w-72 sm:w-80           /* total board width */
        rounded-lg"
      >
        {gameState.board.map((cell, i) => (
          <button 
            key={i} 
            className="bg-white aspect-square rounded-[2px]" 
            onClick={() => makeMove(gameState, i)}
          >
            {cell}
          </button>
        ))}
      </div>
      
      <button 
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset Game
      </button>
    </>
  )
  
  }