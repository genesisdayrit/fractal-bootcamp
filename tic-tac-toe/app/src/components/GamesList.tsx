import { useState, useEffect } from 'react'

export default function GamesList() {

    // setting 

    const [games, setGames] = useState<string[]>([])
    
    // you want to create a function that fetches the game
    
    useEffect(() => {
        fetchGames()
        // console.log(games)
        }, []
      )

    const fetchGames = async () => {
        let response = await fetch('/api/games')
        let games = await response.json()
        console.log("Successful games fetch")
        console.log(games)
        setGames(games)
    }
    
    return (
        <>
        <h1>This is the Games List</h1>
            {games.map((id) => (
                <li key={id}>
                    {id}
                </li>
            ))}
      </>
    )
}