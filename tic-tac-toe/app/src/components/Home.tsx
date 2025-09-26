import { useState, useEffect } from 'react'
import GameBoard from './Gameboard'

export default function Home() {

    type ActiveGameId = string | null

    const [games, setGames] = useState<string[]>([])
    const [activeGameId, setActiveGameId] = useState<ActiveGameId>(null)

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
        console.log('Create Button clicked')
        
        let response = await fetch('api/create', {
            method: "POST", 
            headers: {"Content-Type": "application/json"}
          })
      
          let result = await response.json()
          if (result.ok) {
            console.log(result)
            setActiveGameId(result.id)
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

    // if no activeGame ID, render the lobby
    if (!activeGameId) {

        return (
            <>
                <div className="flex flex-col gap-4 min-h-screen justify-center items-center text-center">
                <h1 className="text-4xl">Tic Tac Toe Lobby</h1>
                <button 
                    onClick={createGameClicked} 
                    className="p-2 px-4 border rounded-lg bg-blue-300">
                    Create Game
                </button>
                <h1>This is the Games List:</h1>
                <ul className="flex flex-col gap-4">
                {games.map((id) => (
                    <li key={id}>
                        <button onClick={() => joinGameClicked(id)} className="p-2 px-4 border rounded-lg bg-gray-300 ">Join Game: {id}</button>
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


