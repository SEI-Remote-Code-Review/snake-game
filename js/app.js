/*-------------------------------- Constants --------------------------------*/

const columns = 15;
const rows = 15;
const snakeMoves = new Audio("./assets/move.wav");
const snakeEats = new Audio("./assets/eat.wav");
const lossSound = new Audio("./assets/lost.wav");
snakeMoves.volume = .05;
snakeEats.volume = .01;
lossSound.volume = .03;
/*---------------------------- Variables (state) ----------------------------*/

let snake, direction, snakeStart, winner, food, score, speed;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');
const playButton = document.querySelector('#play');
const restartButton = document.querySelector('#restart');
const scoreMessage = document.querySelector('#score p');
const boardCells = boardGenerator(columns, rows);

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

init();


function init() {
  snake = [76, 77, 78];
  direction = 'right';
  score = 0;
  winner = 1;
  speed = 800;
  restartButton.setAttribute('hidden', true);
  playButton.textContent = 'PLAY';
  board.classList.remove('animate__shakeY');
  scoreMessage.classList.remove('animate__shakeY');
  foodGenerator();
  render();
}


function render() {
  if (winner) {
    boardCells.forEach(cell => {
      cell.classList.remove('snake-head', 'snake-body','food-cell');
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
    clearInterval(snakeStart);
    lossSound.play();
    scoreMessage.innerHTML = `Score: ${score} <br> Game over <br> Press Restart to play again`;
    board.classList.add('animate__shakeY');
    scoreMessage.classList.add('animate__shakeY');
  }
}

function gameStart(evt) {
  if (!winner) {
    return;
  }
  restartButton.removeAttribute('hidden');
  if (evt.target.textContent.toLowerCase() === 'play') {
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
  let firstCell = snake[snake.length-1], newCell;
  switch (direction) {
    case 'right':   
        newCell = firstCell + 1;
        break;
    case 'left':
        newCell = firstCell - 1;
        break;
    case 'up':
        newCell = firstCell - columns;
        break;
    case 'down':
        newCell = firstCell + columns;
        break;
  }
  if (checkMove(firstCell, newCell)) {
    addMove(newCell);
  }
  render();
}

function checkMove(firstCell, newCell) {
  if (snake.includes(newCell)) {
    return winner = 0;
  } else if (newCell === food) {
    return winner = 2;
  } else { 
    switch (direction) {
      case 'right':   
        if (firstCell%columns === (columns-1)) {
          winner = 0;
        }
        break;
      case 'left':
        if (firstCell%columns === 0) {
          winner = 0;
        }
        break;
      case 'up':
        if (newCell < 0) {
          winner = 0;
        }
        break;
      case 'down':
        if (newCell >= columns*rows) {
        winner = 0;
        }
        break;
    }
    return winner;
  }
}

function addMove(newCell) {
  snake.push(newCell);
  if (winner === 2) {
    snakeEats.play();
    foodGenerator();
    score += 10;
    speed -= 5;
  } else {
    snakeMoves.play();
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

function foodGenerator() {
  do {
    food = Math.floor(Math.random() * columns * rows);
  }
  while (snake.includes(food));
}