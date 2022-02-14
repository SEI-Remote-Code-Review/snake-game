/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/

let snake, direction, snakeStart, winner;
const food = {};

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');
const startButton = document.querySelector('#start');
const message = document.querySelector('#message');

/*----------------------------- Event Listeners -----------------------------*/

document.querySelector('#snake-control').addEventListener('click', handleTurnButtons);
document.addEventListener('keydown', handleTurnKeys);
startButton.addEventListener('click', gameStart);



/*-------------------------------- Functions --------------------------------*/

let boardCells = boardGenerator(15, 15);

init();


function init() {
  snake = [{x:5, y:2}, {x:5, y:3}, {x:5, y:4}];
  direction = 'right';
  foodGenerator();
  console.log(food);
  winner = 1;
  render();
}


function render() {
  if (winner) {
    boardCells.forEach(cell => {
    if (cell.classList.contains('snake-body')) {
      cell.classList.remove('snake-body');
    }
  })

  snake.forEach(part => {
    boardCells[part.x * 15 + part.y].classList.add('snake-body');
  })

  boardCells[food.x * 15 + food.y].classList.add('food-cell');
} else {
  message.textContent = 'You lost!'
}
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

function gameStart() {
  snakeStart = setInterval(move, 1000);
}

function move() {
  let newCoordinate = {};
  switch (direction) {
    case 'right':
      moveRight(newCoordinate);
      break;
    case 'left':
      moveLeft(newCoordinate);
      break;
    case 'up':
      moveUp(newCoordinate);
      break;
    case 'down':
      moveDown(newCoordinate);
      break;
  }
  snake.push(newCoordinate);
  snake.shift();
  if (Object.values(newCoordinate).some(coordinate => coordinate > 14) || Object.values(newCoordinate).some(coordinate => coordinate < 0)) {
    winner = 0;
    clearInterval(snakeStart);
  }
  render();
}

function moveRight(newCoordinate) {
  newCoordinate.x = snake[snake.length-1].x;
  newCoordinate.y = snake[snake.length-1].y+1;
}

function moveLeft (newCoordinate) {
  newCoordinate.x = snake[snake.length-1].x;
  newCoordinate.y = snake[snake.length-1].y-1;
}

function moveUp(newCoordinate) {
  newCoordinate.x = snake[snake.length-1].x-1;
  newCoordinate.y = snake[snake.length-1].y;
}

function moveDown(newCoordinate) {
  newCoordinate.x = snake[snake.length-1].x+1;
  newCoordinate.y = snake[snake.length-1].y;
}

function handleTurnButtons(evt) {
  if ((evt.target.id === 'left' && direction !== 'right') || (evt.target.id === 'up' && direction !== 'down') || (evt.target.id === 'down' && direction !== 'up') || (evt.target.id === 'right' && direction !== 'left')) {
    direction = evt.target.id;
    move();
  }
}

function handleTurnKeys(evt) {
  if (evt.code.toLowerCase() === 'arrowleft' && direction !== 'right') {
  direction = 'left';
  move();
  } else if (evt.code.toLowerCase() === 'arrowup' && direction !== 'down') {
  direction = 'up';
  move();
  } else if(evt.code.toLowerCase() === 'arrowdown' && direction !== 'up') {
  direction = 'down';
  move();
  } else if (evt.code.toLowerCase() === 'arrowright' && direction !== 'left') {
  direction = 'right';
  move();
  }
}


function foodGenerator() {
  let snakeCells = snake.map(coordinate => coordinate.x * 15 + coordinate.y);
  do {
    food.x = Math.floor(Math.random() * 15);
    food.y = Math.floor(Math.random() * 15);
  }
  while (snakeCells.includes(food.x * 15 + food.y));
}