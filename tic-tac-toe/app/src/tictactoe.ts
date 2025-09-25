type Player = 'X' | 'O'
type Cell = Player | ''

// add game id here

type GameState = {
    currentPlayer: Player
    board: Cell[]
    gameStatus: 'new game'| 'X' | 'O' | 'tie' | 'in progress'
    winner: Player | undefined
}

export const initialGameState: GameState = {
        currentPlayer: 'X',
        board: Array(9).fill(''),
        gameStatus: 'new game',
        winner: undefined
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

export function makeMove(gameState: GameState, cellIndex: number):GameState {
    // don't allow moves if game is over or cell is already filled = 
    if (gameState.gameStatus !== 'new game' && gameState.gameStatus !== 'in progress' || gameState.board[cellIndex] !== '' ) {
        return gameState
    }

    // if move is valid, update cell to the player and update game status
    const updatedBoard = [...gameState.board]
    updatedBoard[cellIndex] = gameState.currentPlayer

    const { winner, isDraw } = checkWinner(updatedBoard)

    let updatedGameStatus: GameState['gameStatus']
    if (winner) {
        updatedGameStatus = winner
    } else if (isDraw) {
        updatedGameStatus = 'tie'
    } else {
        updatedGameStatus = 'in progress'
    }

    return {
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
        board: updatedBoard,
        gameStatus: updatedGameStatus,
        winner
    }
}

export function getGameStatusMessage(gameState: GameState): String {    
    if (gameState.gameStatus === 'tie') {
        return "It's a tie!"
    } else if (gameState.winner) {
        return `Player ${gameState.winner} wins!`
    }
    return `Current player: ${gameState.currentPlayer}`
}


export type { Player, Cell, GameState }