import { useState, useEffect } from 'react'
import GameBoard from './Gameboard'
import ToggleButton from './ToggleButton';


type GameStatus = { id: string; game_status: string }

export default function Home() {

    type ActiveGameId = string | null

    const [games, setGames] = useState<GameStatus[]>([])
    const [activeGameId, setActiveGameId] = useState<ActiveGameId>(null)
    const [showCompleted, setShowCompleted] = useState(false)

    // initiate fetch games on page load
    useEffect(() => {
        fetchGames()
        // console.log(games)
        }, []
      )

    // fetch the games from the server
    const fetchGames = async () => {
        let response = await fetch('/api/games')
        let games = await response.json()
        console.log("Successful games fetch")
        console.log(games)
        // setGames to the server games
        setGames(games)
    }
    
    // when the create game button is clicked, post request to create game on server
    const createGameClicked = async () => {
        try {
            console.log('Create Button clicked')
            
            let response = await fetch('/api/create', {
                method: "POST", 
                headers: {"Content-Type": "application/json"}
              })
          
              if (!response.ok) {
                throw new Error(`Failed to create game: ${response.status}`)
              }
          
              let result = await response.json()
              if (result.ok) {
                console.log(result)
                setActiveGameId(result.id)
              } else {
                console.error('Create game failed:', result)
              }
        } catch (error) {
            console.error('Error creating game:', error)
            // Could show user feedback here if needed
        }
    }

    // when a user clicks join game, set the activeGameId
    const joinGameClicked = async (id: string) => {
        console.log(`Join Game button clicked. Active Game ID set to: ${id}`)
        setActiveGameId(id)
    }

    const backToLobbyClicked = () => {
        setActiveGameId(null)
        fetchGames()
    }


    const handleToggle = (selectedOption: string) => {
        console.log('Selected  option:', selectedOption);
        setShowCompleted(selectedOption === 'Completed')
      };
     
    const filteredGames = games.filter(game => {
        // if toggle is set to complete, only show isCompleted, else !idCompleted
        const isCompleted = ['X', 'O', 'tie'].includes(game.game_status)
        return showCompleted? isCompleted : !isCompleted
     })

    // if no activeGame ID, render the lobby
    if (!activeGameId) {

        return (
            <>
                <div className="flex flex-col gap-4 min-h-screen justify-center items-center text-center">
                <h1 className="text-4xl text-yellow-300">Tic Tac Toe Lobby</h1>
                <button 
                    onClick={createGameClicked} 
                    className="p-2 px-4 border rounded-lg bg-blue-300 hover:bg-blue-400 mb-10">
                    Create Game
                </button>
                <h1 className="text-yellow-300">This is the Games List:</h1>
                <ToggleButton
                    option1Label="In Progress"
                    option2Label="Completed"
                    onToggleChange={handleToggle}
                />
                <ul className="flex flex-col gap-4">
                {filteredGames.map((game) => (
                    <li key={game.id}>
                        <button onClick={() => joinGameClicked(game.id)} className="p-2 px-4 border rounded-lg bg-gray-300 hover:bg-gray-400 ">Join Game: {game.id}</button>
                    </li>
                ))}
                </ul>
            </div>
            </>
        )

    // if there is an activeGameID, render the Gameboard component
    } else {
        return (
            <>
            <GameBoard id={activeGameId} backToLobbyClicked={backToLobbyClicked} />
            </>
        )
    }

}


