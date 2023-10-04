import { useState } from 'react'; //import Hook
import './styles.css'; //import css

//kompontent po naciśnięciu
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
//komponent od planszy
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  const statusColor = winner ? 'redTxt' : '';

  //Tworzy pętle do tworzenia planszy i elementów planszy
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      rowSquares.push(
        <Square key={squareIndex} value={squares[squareIndex]} onSquareClick={() => handleClick(squareIndex)} />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className={`status ${statusColor}`}>{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  //zapamiętuje, kliknięcie, który z kolei został nakliknięty
  const moves = history.map((step, move) => {
    const squares = step.squares;
    const prevSquares = move > 0 ? history[move - 1].squares : Array(9).fill(null);
    let description;

    // Szuka położenia elementu
    const [row, col] = findLocation(squares, prevSquares);

    if (move > 0) {
      description = `Move #${move} (${row}, ${col})`;
    } else {
      description = 'Moves Count:';
    }

    const moveContent = move === currentMove ? <strong>{description}</strong> : description;

    return (
      <li key={move}>
        <span onClick={() => jumpTo(move)}>{moveContent}</span>
      </li>
    );
  });

  // Szukanie położenia klikniętego elementu
  function findLocation(newSquares, oldSquares) {
    for (let i = 0; i < newSquares.length; i++) {
      if (newSquares[i] !== oldSquares[i]) {
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        return [row, col];
      }
    }
    return [-1, -1]; // Jeśli nie może znaleźć wyświetla nieistniejące pole
  }
  //wyświetla listę z ruchami
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
//sprawdza czy jest wygrana
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
      return squares[a];
    }
  }
  return null;
}