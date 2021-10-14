/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  let row = 0;
  while (row < HEIGHT) {
    board.push([]);
    let column = 0;
    while (column < WIDTH) {
      board[row].push(null);
      column++;
    }
    row++;
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");
  
  // Create top row: This is where players may drop a piece from 
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create the individual cells in top row and append
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  
  // Append top row to HTML Board 
  htmlBoard.append(top);

  // Create the game board 
  // For each row, create the correct number of cells 
  // Each cell will have a unique id that matches its row#-column#
  // Append the newly created rows to the html page
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  let currY = board.length - 1;
  
  // Find the first spot in the specified column that is open 
  while (currY >= 0) {
    if (board[currY][x] == null) {
      return currY;
    }
    currY--;
  }
  
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // Create New div element to insert into DOM
  let newPiece = document.createElement("div");
  newPiece.classList.add("piece");
  
  // Give new div element the correct class 
  if (currPlayer == 1) {
    newPiece.classList.add("player1");
  } else {
    newPiece.classList.add("player2");
  }
  
  // Insert the div into the correct spot in DOM 
  let correctSlot = document.getElementById(`${y}-${x}`);
  correctSlot.appendChild(newPiece);
  
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
  return;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  
  // update in-memory board 
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  let gameOver = 0;
  for (let row of board) {
    if (row.some(value => value == null)) {
      gameOver = 0;
      break;
    } else {
      gameOver = 1;
    }
  }
  
  if (gameOver == 1) {
    return endGame("Board filled. Game is a tie.");
  };
  
  // switch currPlayer 1 <-> 2
  currPlayer = (currPlayer === 1) ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Checks all possible winning scenarios at each position on the board 
  // For each position, check:
  // horiz: If four in a row match from right to left 
  // vert: If four in a row match from bottom to top 
  // diagDR: If four in a row match in the right diagonal 
  // diagDL: If four in a row match in the left diagonal 
  // If any of the four possible scenarios return a winner, return true 
  // Else return null 
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// Set background video playback rate 
// let backgroundVideo = document.getElementById("background-video");
// backgroundVideo.playbackRate = 0.8;

makeBoard();
makeHtmlBoard();
