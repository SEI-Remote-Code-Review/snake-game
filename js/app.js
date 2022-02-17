/*-------------------------------- Constants --------------------------------*/

const columns = 15;
const rows = 15;
const snakeMoves = new Audio("./assets/move.wav");
const snakeEats = new Audio("./assets/eat.wav");
const lossSound = new Audio("./assets/lost.wav");

/*---------------------------- Variables (state) ----------------------------*/

let snake, direction, snakeStart, winner, food, score, speed;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');
const playButton = document.querySelector('#play');
const restartButton = document.querySelector('#restart');
const scoreMessage = document.querySelector('#score p');

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
  speed = 800;
  restartButton.setAttribute('hidden', true);
  playButton.textContent = 'PLAY';
  board.classList.remove('animate__shakeY');
  render();
}


function render() {
  if (winner) {
    boardCells.forEach(cell => {
      cell.classList.remove('snake-head', 'snake-body','food-cell' )
    })

    snake.forEach((part, idx) => {
      if (idx === snake.length-1) {
        boardCells[part].classList.add('snake-head');
      } else {
       boardCells[part].classList.add('snake-body');
      }
    })

    boardCells[food].classList.add('food-cell');
    (score === 0) ? scoreMessage.textContent = `Score: ${score}` : scoreMessage.innerHTML = `Score: ${score} <br> Keep it up!`;
    if (winner === 2) {
      
      clearInterval(snakeStart);
      snakeStart = setInterval(move, speed);
    }
  } else {
    board.classList.add('animate__shakeY');
    clearInterval(snakeStart);
    lossSound.volume = .10;
    lossSound.play();
    scoreMessage.innerHTML = `Score: ${score} <br> Game over <br> Press Restart to play again`;
  }
}

function boardGenerator(columns, rows) {
  board.style.gridTemplateRows = `repeat(${rows},4vmin)`;
  board.style.gridTemplateColumns = `repeat(${columns},4vmin)`;
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
    snakeStart = setInterval(move, speed);
    playButton.textContent = 'PAUSE';
  } else {
    clearInterval(snakeStart);
    snakeStart = false;
    playButton.textContent = 'PLAY';
  }
}

function move() {
  winner = 1;
  let newCell;
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
      if (snake[snake.length-1]%columns === (columns-1)) {
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
  snakeMoves.volume = .10;
  snakeMoves.play();
  snake.push(newCell);
  if (winner === 2) {
    snakeEats.volume = .10;
    snakeEats.play();
    foodGenerator();
    score += 10;
    speed -= 20;
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
  if (evt.code.toLowerCase() === 'arrowleft' && direction !== 'right' || evt.code.toLowerCase() === 'arrowup' && direction !== 'down' || evt.code.toLowerCase() === 'arrowdown' && direction !== 'up' || evt.code.toLowerCase() === 'arrowright' && direction !== 'left') {
  direction = evt.code.toLowerCase().split('arrow')[1];
  move();
  }
}

function foodGenerator() {
  do {
    food = Math.floor(Math.random() * columns * rows);
  }
  while (snake.includes(food));
}