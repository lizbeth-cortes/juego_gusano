// Elementos del HTML
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const cardStart = document.getElementById('cardStart');
const scoreSign = document.getElementById('scoreSign');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const gameContent = document.getElementById('containerGame');

// Configuraciones del juego
const boardSize = 10;
const gameSpeed = 100; // en milisegundos

const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

// Variables del juego
let snake;
let score;
let direction;
let boardSquare;
let emptySquare;
let moveInterval; // función que se ejecutará cada determinado tiempo

function leave(){
    hideGameOver();
    gameContent.style.display = 'none';
    cardStart.style.display = 'block';
}

function showGameOver() {
    gameOverOverlay.style.display = 'flex';
    clearInterval(moveInterval);
}

function hideGameOver() {
    gameOverOverlay.style.display = 'none';
}

function restartGame() {
    hideGameOver(); 
    startGame();
}

/**
 * Mueve la serpiente en la dirección actual.
 * Calcula la nueva posición de la serpiente, verifica colisiones y actualiza el tablero.
 */
const moveSnake = () => {
    // Calcula la nueva posición de la cabeza de la serpiente
    const newSquare = String(Number(snake[snake.length - 1]) + directions[direction]).padStart(2, '0');
    const [row, column] = newSquare.split(''); // Obtiene la fila y la columna de la nueva posición

    // Verifica si la serpiente ha chocado con los bordes del tablero o con ella misma
    if (newSquare < 0 || newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column === '0') ||
        (direction === 'ArrowLeft' && column === '9') ||
        boardSquare[row][column] === squareTypes.snakeSquare) {
        // gameOver(); 
        showGameOver();
    } else {
        snake.push(newSquare); // Agrega la nueva posición de la cabeza de la serpiente al arreglo
        if (boardSquare[row][column] === squareTypes.foodSquare) {
            addFood(); // Agrega comida si la serpiente ha comido un cuadrado de comida
        } else {
            const emptySquare = snake.shift(); // Elimina la cola de la serpiente si no ha comido comida
            drawSquare(emptySquare, 'emptySquare'); // Dibuja el cuadrado vacío en la posición eliminada
        }
        drawSnake(); // Dibuja la serpiente en su nueva posición
    }
};


const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction !== 'ArrowDown' && setDirection(key.code);
            break;
        case 'ArrowDown':
            direction !== 'ArrowUp' && setDirection(key.code);
            break;
        case 'ArrowLeft':
            direction !== 'ArrowRight' && setDirection(key.code);
            break;
        case 'ArrowRight':
            direction !== 'ArrowLeft' && setDirection(key.code);
            break;
    }
}


const createRandomFood = () => {
    const randomEmptySquare = emptySquare[Math.floor(Math.random() * emptySquare.length)];
    drawSquare(randomEmptySquare,'foodSquare');
}

const updateScore=()=>{
    scoreBoard.innerText=score;
}

/**
 * Dibuja la serpiente en el tablero.
 * Recorre cada posición de la serpiente y llama a `drawSquare` para actualizar el tablero.
 */
const drawSnake = () => {
    // `snake` es una lista de posiciones (ejemplo: ['00', '01', '02'])
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
};

/**
 ** Rellena cada cuadrado del tablero.
 ** @param {string} square - La posición del cuadrado en formato 'xy'.
 **@param {string} type - Tipo de cuadrado ('emptySquare', 'snakeSquare', 'foodSquare').
 */
const drawSquare = (square, type) => {
    const [row, column] = square.split(''); // Descompone la posición en fila y columna
    boardSquare[row][column] = squareTypes[type]; // Actualiza el tipo de casilla en la matriz `boardSquare` añadiendo el valor del tipo
    const squareElement = document.getElementById(square); // Obtiene el elemento del DOM correspondiente a la posición
    squareElement.setAttribute('class', `square ${type}`); // Asigna la clase CSS correspondiente

    if (type === 'emptySquare') {
        emptySquare.push(square); // Añade la posición a `emptySquare` si es una casilla vacía
    } else {
        const index = emptySquare.indexOf(square);
        if (index !== -1) {
            emptySquare.splice(index, 1); // Elimina la posición de `emptySquare` si no está vacía y está en el arreglo
        }
    }
};

/**
 * Crea y renderiza el tablero de juego en el DOM.
 * Recorre la matriz `boardSquare`, crea elementos div para cada celda y los agrega al contenedor del tablero.
 */
const createBoard = () => {
    boardSquare.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`; // Genera un identificador único para la celda
            const squareElement = document.createElement('div'); // Crea un nuevo elemento div para la celda
            squareElement.setAttribute('class', 'square emptySquare'); // Asigna clases al elemento div
            squareElement.setAttribute('id', squareValue); // Establece un id único para el elemento div
            board.appendChild(squareElement); // Añade el elemento div al contenedor del tablero
            emptySquare.push(squareValue); // Añade la posición a `emptySquare`
        });
    });
};

/**
 * Inicializa el estado del juego, la serpiente, y crea el tablero.
 */
const setGame = () => {
    snake = ['00', '01', '02', '03']; 
    score = snake.length; 
    direction = 'ArrowRight'; 
    boardSquare = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare)); // Inicializa la matriz del tablero
    board.innerHTML = ''; 
    emptySquare = []; 
    createBoard(); 
    drawSnake(); 
    updateScore();
    createRandomFood();
    document.addEventListener('keydown',directionEvent);
    moveInterval = setInterval(moveSnake, gameSpeed);
};

/**
 * Comienza el juego inicializando el estado del juego.
 */
const startGame = () => {
    setGame();
    cardStart.style.display = 'none'; 
    gameContent.style.display = 'flex';
    scoreSign.style.display = 'block';
};

startButton.addEventListener('click', startGame); 





