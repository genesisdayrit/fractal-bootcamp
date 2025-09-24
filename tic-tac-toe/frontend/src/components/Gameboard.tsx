
import { useGameState } from '../tictactoe'

export default function Gameboard() {
  const { gameState, makeMove, resetGame, getGameStatusMessage } = useGameState()

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <h3>{getGameStatusMessage()}</h3>
      <div className="
        grid grid-cols-3
        gap-[6px]              /* line thickness between squares */
        bg-black               /* the gap color becomes the grid lines */
        p-[6px]                /* outer border thickness */
        w-72 sm:w-80           /* total board width */
        rounded-lg"
      >
        {gameState.board.map((cell, i) => (
          <button 
            key={i} 
            className="bg-white aspect-square rounded-[2px]" 
            onClick={() => makeMove(i)}
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