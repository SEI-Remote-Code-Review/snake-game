/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/

let snake, direction;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');

/*----------------------------- Event Listeners -----------------------------*/

document.querySelector('#snake-control').addEventListener('click', handleSnakeTurns);



/*-------------------------------- Functions --------------------------------*/

let boardCells = boardGenerator(15, 15);

init();


function init() {
  snake = [{x:5, y:5}, {x:5, y:6}, {x:5, y:7}];
  direction = 'right';
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


function move() {
  let newCoordinate = {};
  switch (direction) {
    case 'right':
      newCoordinate.x = snake[snake.length-1].x;
      newCoordinate.y = snake[snake.length-1].y+1;
      break;
    case 'left':
      newCoordinate.x = snake[snake.length-1].x;
      newCoordinate.y = snake[snake.length-1].y-1;
      break;
    case 'up':
      newCoordinate.x = snake[snake.length-1].x-1;
      newCoordinate.y = snake[snake.length-1].y;
      break;
    case 'down':
      newCoordinate.x = snake[snake.length-1].x+1;
      newCoordinate.y = snake[snake.length-1].y;
      break;
  }
  snake.push(newCoordinate);
  snake.shift();
  render();
}

function handleSnakeTurns(evt) {
  if ((evt.target.id === 'left' && direction !== 'right') || (evt.target.id === 'up' && direction !== 'down') || (evt.target.id === 'down' && direction !== 'up') || (evt.target.id === 'right' && direction !== 'left')) {
    direction = evt.target.id;
    move();
  }
}