/*-------------------------------- Constants --------------------------------*/

const columns = 15;
const rows = 15;

/*---------------------------- Variables (state) ----------------------------*/

let snake, direction, snakeStart, winner, food, score, newCell;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');
const playButton = document.querySelector('#play');
const message = document.querySelector('#message');
const restartButton = document.querySelector('#restart');

/*----------------------------- Event Listeners -----------------------------*/

document.querySelector('#snake-control').addEventListener('click', handleTurnButtons);
document.addEventListener('keydown', handleTurnKeys);
playButton.addEventListener('click', gameStart);
restartButton.addEventListener('click', () => {
  clearInterval(snakeStart);
  snakeStart = false;
  init();
});



/*-------------------------------- Functions --------------------------------*/

let boardCells = boardGenerator(columns, rows);

init();


function init() {
  snake = [76, 77, 78];
  direction = 'right';
  foodGenerator();
  score = 0;
  winner = 1;
  restartButton.setAttribute('hidden', true);
  playButton.textContent = 'PLAY';
  render();
}


function render() {
  if (winner) {
    boardCells.forEach(cell => {
      if (cell.classList.contains('snake-body')) {
      cell.classList.remove('snake-body');
    }
      if (cell.classList.contains('food-cell')) {
      cell.classList.remove('food-cell');
    }
  })

  snake.forEach(part => {
    if (boardCells[part].classList.contains('food-cell')) {
      boardCells[part].classList.remove('food-cell');
    }
    boardCells[part].classList.add('snake-body');
  })

  boardCells[food].classList.add('food-cell');
  document.querySelector('#score').textContent = `Score: ${score}`;
  (winner === 2) ? message.textContent = 'Good Job!' : message.textContent = 'Snake!';
} else {
  clearInterval(snakeStart);
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


function gameStart(evt) {
  if (!winner) {
    return;
  }
  restartButton.removeAttribute('hidden');
  if (evt.target.textContent === 'PLAY') {
    snakeStart = setInterval(move, 200);
    playButton.textContent = 'PAUSE';
  } else {
    clearInterval(snakeStart);
    snakeStart = false;
    playButton.textContent = 'PLAY';
  }
}

function move() {
  winner = 1;
  switch (direction) {
    case 'right':   
        newCell = snake[snake.length-1] + 1;
        break;
    case 'left':
        newCell = snake[snake.length-1] - 1;
        break;
    case 'up':
        newCell = snake[snake.length-1] - columns;
        break;
    case 'down':
        newCell = snake[snake.length-1] + columns;
        break;
  }
  if (checkMove(newCell)) {
  addMove(newCell);
  }
  render();
}

function checkMove(newCell) {
  switch (direction) {
    case 'right':   
      if (snake[snake.length-1]%columns === 14) {
          winner = 0;
        }
        break;
    case 'left':
      if (snake[snake.length-1]%columns === 0) {
          winner = 0;
        }
        break;
    case 'up':
      if (snake[snake.length-1] < columns) {
          winner = 0;
        }
        break;
    case 'down':
      if (snake[snake.length-1] >= columns*(rows-1)) {
          winner = 0;
        }
        break;
    }
    if (snake.includes(newCell)) {
      winner = 0;
    } else if (newCell === food) {
      winner = 2;
    }
    return winner;
}

function addMove(newCell) {
  snake.push(newCell);
  if (winner === 2) {
    foodGenerator();
    score += 10;
  } else {
    snake.shift();
  }
}

function handleTurnButtons(evt) {
  if (!snakeStart || !winner) {
    return;
  }
  if ((evt.target.id === 'left' && direction !== 'right') || (evt.target.id === 'up' && direction !== 'down') || (evt.target.id === 'down' && direction !== 'up') || (evt.target.id === 'right' && direction !== 'left')) {
    direction = evt.target.id;
    move();
  }
}

function handleTurnKeys(evt) {
  if (!snakeStart || !winner) {
    return;
  }
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
  do {
    food = Math.floor(Math.random() * 225);
  }
  while (snake.includes(food));
}