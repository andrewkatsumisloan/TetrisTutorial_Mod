document.addEventListener('DOMContentLoaded', ()=> {
    // querySelector to look through .HTML document and find the element with the class name of grid
    // So now when we refer to grid, it knows that we are referring the class .grid in the HTML file.
    const grid = document.querySelector('.grid');

    // We also want our Javascript to talk to all of the squares in the grid, (use all because we want it to refer to all squares in the grid)
    // Then we convert this into an array using Array.from()
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const width = 10;
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');
    let nextRandom = 0;

    // Use forEach method to draw a Tetrominos on the grid.

    // The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1,  width*2+2]
    ];

    const zTetromino = [
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1]
    ];

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random()*theTetrominoes.length);


    // Randomly select one of the five tetromino types, assign it to its default rotation value [0]
    let current = theTetrominoes[random][currentRotation];

    console.log(current)

    // Function to draw the tetromino... .classList.add allows you to access the .css stylesheet for 'tetromino' in order to modify the tiles
    // forEach element of the array in current, we are going to color the squares that it occupies.  Current position is the lateral position on the board, initialized to 4 (the center)
    // index is just the elements of current (i.e for an lshape tetromino, it is [1, 11, 21, 2]
    function draw() {
        current.forEach(index=> {
            squares[currentPosition+index].classList.add('tetromino')
        })
    }

    draw()

    // Undraws the shape from its current position
    function undraw() {
        current.forEach(index => {
            squares[currentPosition+index].classList.remove('tetromino')
        })
    }

    //make the tetromino move down every second
    timerid = setInterval(moveDown, 1000)

    //assign functions to keyCodes
    function control(e){
        if(e.keyCode === 37){
            moveleft();
        }
        else if(e.keyCode === 38) {
            rotate();
        }
        else if(e.keyCode === 39) {
            moveRight();
        }
        else if(e.keyCode === 40){
            moveDown();
        }
    }
    // Listens for keyup, if key is pressed, invoke control function...
    document.addEventListener('keyup', control)


    function moveDown(){
        undraw()
        currentPosition+=width;
        draw();
        freeze()
    }

    // .some() making sure that logic is true for SOME objects in the array, if get one true back — you are good to go.
    function freeze(){
        // If any of the parts of the tetromino overlap with a square that has the label taken, then assign the value taken to each block in the tetromino.
        if (current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition+index].classList.add('taken'));
            // start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
        }
    }

    // move the tetromino left, unless is at the edge or there is a blockage, start by undrawing
    function moveleft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        // Allow block to move left only if isAtLeftEdge is NOT true
        if(!isAtLeftEdge) currentPosition -= 1;

        // Stop if there is another tetromino at this location, labels square as taken
        if(current.some(index => squares[currentPosition+index].classList.contains('taken')))
            currentPosition += 1;
        draw()

    }

    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition +index) % width === width -1)

        if(!isAtRightEdge) currentPosition += 1;

        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition -= 1;
        draw();
    }


// rotate the tetromino
    function rotate(){
        undraw();
        currentRotation++;
        if(currentRotation === current.length){
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }
})

// Show the tetromino that is up next, this selects all of the
const displaySquares = document.querySelectorAll('.minigrid div');
const displayWidth = 4;
let displayIndex = 0;

//The tetrominos without rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0, displayWidth, displayWidth+1, displayWidth*2+1],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [0, 1, displayWidth, displayWidth+1],
    [1, displayWidth+1, displayWidth*2+1,displayWidth*3+1]
]

function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
    })
    // For each square that makes up the now randomly selected up-next tetromino, we want to add the class tetromino to it.
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
    })
}

//asdfasdfas

// squares holds all of the squares that are contained in the grid [0-199] in row major order.
// current holds an array that contains the information that says the block type and the rotation position. (based on an index into a 2d array)  (let current = theTetrominoes[random][currentRotation])
//      - you pass in the random # (which specifies the block) and the rotation #, and it returns a 1x4 array
// index is used as the iterator for the current array...
// currentPosition denotes the position on the board, from 0 to 199 (row major order)
