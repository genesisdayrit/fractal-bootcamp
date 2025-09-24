
import { useState } from 'react'

type Player = 'X' | 'O'
type Cell = Player | ''

type GameState = {
    currentPlayer: Player
    board: Cell[]
    gameStatus: 'X' | 'O' | 'tie' | 'in progress'
    winner: Player | undefined
}

function createInitialGameState(): GameState {
    return {
        currentPlayer: 'X',
        board: Array(9).fill('') as Cell[],
        gameStatus: 'in progress',
        winner: undefined
    }
}

const winningCombinations = [
    // horizontal winners
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // vertical winners 
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // diagonal winners
    [0, 4, 8], 
    [2, 4, 6]
]

function checkWinner(board: Cell[]): { winner?: Player; isDraw: boolean } {
    // check for winning combinations
    for (let i = 0; i < winningCombinations.length; i++) {
        const combination = winningCombinations[i]
        const [a, b, c] = combination
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a] as Player, isDraw: false }
        }
    }
    
    // check for draw (board is full with no winner)
    const isDraw = !board.includes('')
    return { winner: undefined, isDraw }
}

export function useGameState() {
    const [gameState, setGameState] = useState<GameState>(createInitialGameState())

    const makeMove = (cellIndex: number) => {
        // don't allow moves if game is over or cell is already filled
        if (gameState.gameStatus !== 'in progress' || gameState.board[cellIndex] !== '') {
            return
        }

        const newBoard = [...gameState.board]
        newBoard[cellIndex] = gameState.currentPlayer

        const { winner, isDraw } = checkWinner(newBoard)
        
        let newGameStatus: GameState['gameStatus']
        if (winner) {
            newGameStatus = winner
        } else if (isDraw) {
            newGameStatus = 'tie'
        } else {
            newGameStatus = 'in progress'
        }

        setGameState({
            currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
            board: newBoard,
            gameStatus: newGameStatus,
            winner
        })
    }

    const resetGame = () => {
        setGameState(createInitialGameState())
    }

    const getGameStatusMessage = () => {
        if (gameState.gameStatus === 'tie') {
            return "It's a tie!"
        } else if (gameState.winner) {
            return `Player ${gameState.winner} wins!`
        }
        return `Current player: ${gameState.currentPlayer}`
    }

    return {
        gameState,
        makeMove,
        resetGame,
        getGameStatusMessage
    }
}

export type { Player, Cell, GameState }