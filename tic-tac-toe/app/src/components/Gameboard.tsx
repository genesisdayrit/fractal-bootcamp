import { useState, useEffect } from 'react'
import { initialGameState, getGameStatusMessage, type GameState, type Cell, type GameMove } from '../tictactoe'

type GameboardProps = {
  id: string
  backToLobbyClicked: () => void
}

export default function Gameboard(props: GameboardProps) {

const {id, backToLobbyClicked} = props
const [gameState, setGameState] = useState<GameState>(initialGameState())
const [gameMoves, setGameMoves] = useState<GameMove[]>([])
const [aiResponse, setAiResponse] = useState('')
const [aiRecommendedMove, setAiRecommendedMove] = useState('')
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const loadGameData = async () => {
    setLoading(true)
    await fetchGameState()
    await fetchGameMoves()
    setLoading(false)
  }
  
  loadGameData()
  }, []
)

const fetchGameState = async () => {
  try {
    console.log(`Game ID: ${id} received successfully`)

    let response = await fetch(`/api/game/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch game state: ${response.status}`)
    }
    
    let gameState = await response.json()
    setGameState(gameState)
    console.log(gameState)
    setError(null)
  } catch (error) {
    console.error('Error fetching game state:', error)
    setError('Failed to load game. Returning to lobby.')
    setTimeout(() => backToLobbyClicked(), 2000)
  }
}

const fetchGameMoves = async () => {
  try {
    let response = await fetch(`/api/game/${id}/game-moves`)
    if (!response.ok) {
      throw new Error(`Failed to fetch game moves: ${response.status}`)
    }
    
    let gameMoves = await response.json()
    setGameMoves(gameMoves)
    console.log(gameMoves)
  } catch (error) {
    console.error('Error fetching game moves:', error)
    // Don't redirect for game moves errors, just log them
  }
}

const sendMove = async (gameId: String, cellIndex: Number) => {
  console.log('cell clicked')
  console.log(`Game ${gameId} Updated`)
  let response = await fetch(`/api/game/${id}/move`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({cellPosition: cellIndex, id: gameId, gameState: gameState})
  })

  let result = await response.json()

  if (result.ok) {
    console.log("Data sent sucessfully!", gameState)
    fetchGameState()
    fetchGameMoves()
    }
  }

const handleAiRequest = async (boardState: Cell[], currentPlayer: string) => {
  let response = await fetch('/api/recommend-move', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({boardState: boardState, currentPlayer: currentPlayer})
  })
  
  let result = await response.json()

  if (result.ok) {
    console.log('OpenAI Response:', result)
    setAiResponse(result.recommendedAction)
    setAiRecommendedMove(result.parsedResponse)
  }
}



// sends post request and resets the gameState
const resetGame = async (gameId: String) => {
  console.log('reset game clicked')
  let response = await fetch(`api/game/${gameId}/reset`, {
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id: gameId})
  })

  let result = await response.json()
  if (result.ok) {
    fetchGameState()
    fetchGameMoves()
    setAiResponse('')
    console.log(gameState)
  }
}

// Show loading state
if (loading) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="text-xl text-yellow-300">Loading game...</h1>
    </div>
  )
}

// Show error state
if (error) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="text-xl text-red-400">Error: {error}</h1>
      <p className="text-yellow-200">Redirecting to lobby...</p>
    </div>
  )
}

return (
  // if activeGameID is null, then render the lobby, if not render the active game
  <>
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
    <h1 className="text-xl text-center text-yellow-300">Active Game ID: <br /> {id} </h1>
    <h3 className="text-yellow-200">{getGameStatusMessage(gameState)}</h3>
    <div className="grid grid-cols-3 grid-rows-3 gap-0 w-[300px] mx-auto"
    >
      {gameState.board.map((cell, i) => (
        <button 
          key={i} 
          className="flex items-center justify-center w-[100px] h-[100px] border-[4px] border-black bg-white hover:shadow-xl shadow-yellow-200 text-4xl font-bold" 
          onClick={() => sendMove(id, i)}
        >
          {cell}
        </button>
      ))}
    </div>

    <div className="flex gap-4">
    <button 
      // backToLobby from props updates activeGameId = null
      onClick={backToLobbyClicked}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
      Back to Lobby
    </button>
    <button 
      // update this to reset initial state
      onClick={() => resetGame(id)}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
      Reset Game
    </button>
    </div>
    <button 
      className="mt-4 px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded hover:bg-blue-600"
      onClick={() => handleAiRequest(gameState.board, gameState.currentPlayer)}
    >
      Recommend Move
    </button>
    <div className="mt-4">
      <h3 className="text-lg font-bold text-yellow-300">Game Moves:</h3>
      <div className="max-h-40 overflow-y-auto">
        {gameMoves.map((move) => (
          <div key={move.id} className="text-sm text-yellow-200">
            Move {move.gameMoveNum}: Player {move.playerMove} to Position {move.boardArrayPosition}
          </div>
        ))}
      </div>
    </div>
    {aiResponse && (
      <div className="flex flex-col justify-center items-center mt-4 gap-4 w-2/5 bg-gray-200 border rounded-lg">
      <h1>AI Response</h1>
      <p>{aiRecommendedMove}</p>
      <p>{aiResponse}</p>
      <button onClick={()=>setAiResponse('')} className="px-4 py-2 bg-gray-400 hover:bg-gray-600">
          Clear Response
      </button>
    </div>
    )}
    
    </div>
  </>
)
}