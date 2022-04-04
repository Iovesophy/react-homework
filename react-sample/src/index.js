import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.on}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  boardRow(cmin,cmax){
    let pmin = cmin
    let pmax = cmax
    let array = []; let c = 0;
    for (let i = pmin; i < pmax; i++) {
      array[c] = <div className="board-row" key={i}>{this.renderSquare(cmin,cmax)}</div>; c++
      cmin += pmax; cmax += pmax
    }
    return array;
  }
  renderSquare(min,max) {
    let array = []; let c = 0
    for (let i = min; i < max; i++) {
      array[c] = <Square value={this.props.squares[i]} on={() => this.props.on(i)} key={i} />; c++
    }
    return array;
  }
  render() {
    return (
      <div>
        {this.boardRow(0,3)}
      </div>
    );
  }
}

function Matrix(props) {
  return <p>{props.value}</p>
}

function Jump(props) {
  return <button className={props.step === props.move ? 'bold' : '' } onClick={props.on}>{props.desc}</button>
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        matrix: Array(1).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handle(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]
    const squares = current.squares.slice(); 
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const matrix = ['0,0','1,0','2,0','0,1','1,1','2,1','0,2','1,2','2,2']
    this.setState({
      history: history.concat([{
        squares: squares,
        matrix: matrix[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((_ , move) => {

      const desc = move ? 'Go to move #' + move : 'Go to game start';
      const matrix = move ? 'Row, Col = ' + this.state.history[move].matrix : 'None';

        return (
          <li key={move}>
            <Jump on={() => this.jumpTo(move)} desc={desc} move={move} step={this.state.stepNumber} />
            <Matrix value={matrix} />
          </li>
        );

    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} on={(i) => this.handle(i)}/>
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

