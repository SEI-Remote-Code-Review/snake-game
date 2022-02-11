/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/

let boardCells;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');

/*----------------------------- Event Listeners -----------------------------*/





/*-------------------------------- Functions --------------------------------*/

init();

console.log(boardCells);
boardCells[65].style.backgroundColor = 'blue';

function init() {
  boardCells = boardGenerator(15, 15);
}

function boardGenerator(columns, rows) {
  board.style.gridTemplateRows = `repeat(${rows},5vmin)`;
  board.style.gridTemplateColumns = `repeat(${columns},5vmin)`;
  for (let i = 0; i < (columns*rows); i++) {
    let cell = document.createElement('div');
    cell.setAttribute('class', 'board-cell');
    board.appendChild(cell);
  }
  return document.querySelectorAll('.board-cell');
}
