import { useState, useEffect } from 'react'
import GameBoard from './GameBoard'

export default function Home() {

    const [games, setGames] = useState<String[]>([])
    const [activeGameId, setActiveGameID] = useState<String>(null)

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
          }
    }

    // when a user clicks the game, 
    const joinGame = async (id: String) => {
        console.log('Join Game button clicked')

        let response = await fetch(`/api/game/${id}`)
        let gameState = await response.json()

        // set the active gameId
        setActiveGameID(id)
        console.log(gameState)
        console.log(id)
    }

    // TODO: Create Game Button should render new board with ID
    // TODO: Clicking Games should be able to render the specific Game ID's game state

    // function Greeting({ isLoggedIn }) {
    //     if (isLoggedIn) {
    //       return <h1>Welcome back!</h1>;
    //     } else {
    //       return <h1>Please log in.</h1>;
    //     }
    //   }

    // lobby
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
                        <button onClick={() => joinGame(id)} className="p-2 px-4 border rounded-lg bg-gray-300 ">Join Game: {id}</button>
                    </li>
                ))}
                </ul>
            </div>
            </>
        )
    } else {
        return (
            <>
            <GameBoard id={activeGameId} />
            </>
        )
    }

}


