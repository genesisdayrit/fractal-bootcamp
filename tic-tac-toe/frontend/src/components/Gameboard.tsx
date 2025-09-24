
import { useState } from 'react'
import type { Player, Cell, GameState } from '../tictactoe'

export default function Gameboard() {

  const [currentGameState, setCurrentGameState] = useState('in progress')
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [cellContent, setCellContent] = useState('')
  const [winnerContent, setWinnerContent] = useState('')
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(''))

  const winningTriples = [
    // horizontal winners
    [0, 1, 2],
    [3, 4, 5],
    [3, 4, 5],

    // vertical winners 
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // diagnol winners
    [0, 4, 8], 
    [2, 4, 6]
  ]
  
  function checkEndState(boardArray) {
    // for each winning triple, check if the board state has matching values and non-empty strings  
    
    if (
      (!boardArray.includes(''))
    ) {
      console.log('Board is filled.')
    }
    for (let i = 0; i < winningTriples.length; i++) {
      if (
        (boardArray[winningTriples[i][0]] === boardArray[winningTriples[i][1]] && boardArray[winningTriples[i][0]] === boardArray[winningTriples[i][2]])
        && (boardArray[winningTriples[i][0]] != '' && boardArray[winningTriples[i][1]] != '' && boardArray[winningTriples[i][2]] != '')
      ) {
        console.log('Winner')
        setWinnerContent(`the winner is ${currentPlayer}`)
      }
    }
  }
    function handleClick(i) {
    const updatedBoard = [...board];

    if (board[i] === '') {
      
      updatedBoard[i] = currentPlayer;
      console.log(`Updated Cell ${i} to ${currentPlayer}`)
      
      setCurrentPlayer((currentPlayer === 'X') ? 'O' : 'X')
      console.log(`Current player is now ${currentPlayer}`)
      
      setBoard(updatedBoard);
      setCurrentGameState('in progress')      
      console.log(`Current game state ${currentGameState}`)

      checkEndState(updatedBoard)

    } else {console.log(`Cell not updated. Cell ${i} is already filled`)}
  }

  function resetBoard() {
    const updatedBoard = [...board]; 
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X')
  }

  return (
      <>
      <h1>Tic-Tac-Toe</h1>
      <h3>{winnerContent}</h3>
      <div className="
        grid grid-cols-3
        gap-[6px]              /* line thickness between squares */
        bg-black               /* the gap color becomes the grid lines */
        p-[6px]                /* outer border thickness */
        w-72 sm:w-80           /* total board width */
        rounded-lg"
      >
        {board.map((cell, i) => (
          <button 
            key={i} 
            className="bg-white aspect-square rounded-[2px]" 
            onClick={() => handleClick(i)}>{cell}
          </button>
        ))}

      <button onClick={resetBoard}>Reset Game</button>
      
      </div>
      
  </>
  )
  
  }