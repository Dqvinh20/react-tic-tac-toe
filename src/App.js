import { useState } from "react";

function Square({ value, onSquareClick, ...rest }) {
  return (
    <button className="square" onClick={onSquareClick} {...rest}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const [winner, winSquares] = calculateWinner(squares) || [];
  let status;
  if (winner) {
    status = "Winner: " + winner;
  }
  if (currentMove === 9) {
    status = "Draw: No one wins";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => {
        const cols = [0, 1, 2].map((col) => row * 3 + col);
        return (
          <div className="board-row">
            {cols.map((col) => {
              console.log(col);

              return (
                <Square
                  style={{
                    ...(winSquares && winSquares.includes(col)
                      ? { backgroundColor: "yellow" }
                      : {}),
                  }}
                  value={squares[col]}
                  onSquareClick={() => handleClick(col)}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [historyRowCol, setHistoryRowCol] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setHistoryRowCol([
      ...historyRowCol.slice(0, currentMove + 1),
      [Math.floor(i / 3) + 1, (i % 3) + 1],
    ]);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move !== currentMove && move > 0) {
      description = `Go to move (${historyRowCol[move][0]}, ${historyRowCol[move][1]})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{currentMove}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <button onClick={toggleSort}>
          {isAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
