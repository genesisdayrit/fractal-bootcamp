import GamesList from './GamesList'
import { useState, useEffect } from 'react'

// fetch the games


// function to fetch and display the games
// be able to click into the games

export default function Home() {

    const [games, setGames] = useState<string[]>([])
    
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
    
    return (
        <>
            <h1>Tic Tac Toe Lobby</h1>
            <h1 onClick={createGameClicked}>Create Game</h1>
            <h1>This is the Games List</h1>
            {games.map((id) => (
                <li key={id}>
                    {id}
                </li>
            ))}
        </>
    )
}


