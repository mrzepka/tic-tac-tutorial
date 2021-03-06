import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  console.log(props);
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      key={i}
    />;
  }

  createSquares() {
    let rows = [];
    for(var i = 0; i < 3; i++){
      let squares = [];
      for(var j = 0; j < 3; j++){
        squares.push(this.renderSquare(3*i+j));
      }
      let rowID = i+10;
      console.log("rowID: " + rowID);
      rows.push(<div className="board-row" key={rowID.toString()}>{squares}</div>);
    }
    return rows;
  }

  render() {
    return (
      <div>
        {this.createSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        x: 0,
        y: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    console.log(this);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); //shallow copy of state squares
    const x = (i % 3) + 1;
    const y = Math.floor((i / 3) + 1);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; //puts an x in the i'th square
    this.setState({
      history: history.concat([{
        squares: squares,
        x: x,
        y: y,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    console.log(this.state.history);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move {' + step.x + ',' + step.y + '}' :
        'Game Start!';
        //Bolds the currently selected move in the move list...
        //I think there's a better way to do this.
      if(this.state.stepNumber === move){
        return (
          <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}><b>{desc}</b></a>
        </li>
        )
      }
      //If it's not the current list
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next ' + (this.state.xIsNext ? 'X' : 'O');
    }
    console.log(current.squares);
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// Helpers

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