import { useState } from 'react'
import { initialGameState, makeMove, getGameStatusMessage, type GameState } from '../tictactoe'


export default function Gameboard() {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  return (
    <>
      <div className="flex flex-col items-center bg-gray-100 justify-center space-y-4">
      <h1>Tic-Tac-Toe</h1>
      <h3>{getGameStatusMessage(gameState)}</h3>
      <div className="grid grid-cols-3 grid-rows-3 gap-0 w-[300px] mx-auto"
      >
        {gameState.board.map((cell, i) => (
          <button 
            key={i} 
            className="flex items-center justify-center w-[100px] h-[100px] border-[4px] border-black bg-white text-4xl font-bold" 
            onClick={() => setGameState(prev => makeMove(prev, i))}
          >
            {cell}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => setGameState(initialGameState)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reset Game
      </button>
      </div>
    </>
  )
  
  }