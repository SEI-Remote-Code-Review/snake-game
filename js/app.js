/*-------------------------------- Constants --------------------------------*/

const snake = [{x:5, y:5}, {x:5, y:6}, {x:5, y:7}];

/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');

/*----------------------------- Event Listeners -----------------------------*/





/*-------------------------------- Functions --------------------------------*/

let boardCells = boardGenerator(15, 15);

init();


function init() {
  render();
}


function render() {
  boardCells.forEach(cell => {
    while (cell.classList.contains('snake-body')) {
    cell.classList.remove('snake-body');
    }
  })

  snake.forEach(part => {
    boardCells[part.x * 15 + part.y].classList.add('snake-body');
  })
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

