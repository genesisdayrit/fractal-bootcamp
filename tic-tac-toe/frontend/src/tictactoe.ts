
type Player = 'X' | 'O'
type Cell = Player | ''

type GameState = {
    currentPlayer: 'X' | 'O'
    board: Cell[]
    currentGameState: 'X' | 'O' | 'tie' | 'in progress' | undefined
}

export type { Player, Cell, GameState }