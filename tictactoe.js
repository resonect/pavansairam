var gameType = '';
var gameNumber = 0;
var playerChars = ['X', 'O'];
var playerNames = ['Player 1', 'Player 2']
var turn = 0;
var board = ['','','','','','','','',''];
var currentSquare = 0;
var isGameOver = false;
var isGameDraw = false;
var isKeyBoardGame = false;
var isComputerGame = false;

// Define winning patterns assuming the board as:
// 0|1|2
// 3|4|5
// 6|7|8

var patterns = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
var numPattern = 0;
var winPattern;

// Define neighbours keeping in mind the ASCII codes - left: 37, up: 38, right: 39, down: 40
var neighbours = [
  {37: 0, 38: 0, 39: 1, 40: 3},
  {37: 0, 38: 1, 39: 2, 40: 4},
  {37: 1, 38: 2, 39: 2, 40: 5},
  {37: 3, 38: 0, 39: 4, 40: 6},
  {37: 3, 38: 1, 39: 5, 40: 7},
  {37: 4, 38: 2, 39: 5, 40: 8},
  {37: 6, 38: 3, 39: 7, 40: 6},
  {37: 6, 38: 4, 39: 8, 40: 7},
  {37: 7, 38: 5, 39: 8, 40: 8}
];

// selectors
var tdjq = $("td");
var tdjs = document.querySelectorAll("td");
var h1 = $("h1");
var buttons = document.querySelectorAll("button");
var modal = document.getElementById("myModal");
var modalcontent = document.getElementsByClassName("modal-content")[0];
var modalheader = document.getElementsByClassName("modal-header")[0];
var modalbody = document.getElementsByClassName("modal-body")[0];
var modalfooter = document.getElementsByClassName("modal-footer")[0];

$(".top button").click(function() {
  gameType = $(this).attr("class");
  game();
});


function showModal() {
  modal.style.display = "block";
  modalcontent.style.display = "block";
  modalheader.style.display = "block";
  modalbody.style.display = "block";
  modalfooter.style.display = "block";
}

function game() { // first keypress listener to decide type of game
  isGameDraw = false;
  gameNumber++;
  if((gameType !== "computer") && (gameNumber === 1)) {
    assignNamesAndChars();
  };

  if(gameType === "keyboard") { // start keyboard game
    hideDivShowTable();
    isKeyBoardGame = true;
    keyGame();
    return;
  } else if(gameType === "computer") { // start game with computer
    isComputerGame = true;
    playerNames = ["You", "Computer"];
    var isFirst;
    while(true) {
      isFirst = prompt("Do you want to play first?");
      if(!isFirst) {
        alert("No value entered, computer plays first.")
        isFirst = "No";
        break;
      } else if(!(isFirst.toUpperCase() === "YES" || isFirst.toUpperCase() === "NO")) {
        alert("Invalid value entered.");
      } else {
        break;
      }
    };
    hideDivShowTable();
    if(isFirst.toUpperCase() === "NO") {
      turn = 1;
      setTimeout(function() {
        computerGame();
      }, 1000);
    };
    // return;
  };
  hideDivShowTable();
  tdjq.mouseover(function() { // change css of square on mouseOver
    if(!isGameOver) {
      $(this).addClass("cursor currentSquare"); // bkg of square
      if(!board[$(this).attr("class")[0]]) {
        if((isComputerGame && turn === 0) || (!isComputerGame)) {
        $(this).html(playerChars[turn]);
        $(this).addClass("player" + (turn + 1) + "Mouse");
      }
    }
  }
}).mouseleave(function() { // change css of square on mouseLeave
    $(this).removeClass("currentSquare");
    $(this).removeClass("cursor");
    if(!board[$(this).attr("class")[0]]) {
      $(this).html('');
      $(this).removeClass("player" + (turn + 1) + "Mouse");
    }
  });
  tdjq.one("click", function() { // first click Listener on all squares to ensure move is made
    $(this).removeClass("currentSquare");
    // $(this).addClass("cursorNotAllowed");
    var boxClicked = $(this).attr("class")[0];
    if(!board[boxClicked]) { // call endOfTurn only when an empty square is clicked
      currentSquare = boxClicked;
      endOfTurn(currentSquare);
    }
  });
};

function assignNamesAndChars() { // store player names
  var player1Name;
  var player2Name;
  while(player1Name === player2Name) {
    var player1 = window.prompt("Enter player1's name: ");
    var player2 = window.prompt("Enter player2's name: ");
    player1Name = (player1) ? player1 : playerNames[0];
    player2Name = (player2) ? player2 : playerNames[1];
    if(!player1 || !player2) {
      alert("Name(s) not entered. Using default names.");
    } else if(player1 === player2) {
      alert("Enter different names for player1 and player2");
    };
    playerNames = [player1Name, player2Name];
  };
};

function hideDivShowTable() { // fadeOut instructions and fadeIn tictactoe board
  h1.fadeOut(100, function() {
    if(isComputerGame) {
      if(turn === 0) {
          $(this).html("Your Turn").fadeIn(1900);
          $(this).addClass("player1");
      } else {
          $(this).html("Computer Thinking...").fadeIn(1900);
          $(this).addClass("player2");
      };
    } else {
      $(this).html(playerNames[turn] +"'s Turn").fadeIn(1900);
      $(this).addClass("player" + (turn + 1));
    };
  });
  $("div").fadeOut(1000);
  $("img").fadeOut(1000);
  $("table").fadeIn(2000);
};

function endOfTurn(currentSquare) { // update css, h1, turn, board on turn end
  if(!isGameOver) {
    board[currentSquare] = playerChars[turn];
    tdjq.eq(currentSquare).addClass("cursorNotAllowed");
    checkPattern(turn);
    if(!isGameOver) {
      turn = 1 - turn;
      if(isComputerGame) {
        if(turn === 0) {
            h1.html("Your Turn");
        } else {
          h1.html("Computer thinking...");
        };
      } else {
          h1.html(playerNames[turn] + "'s Turn");
      };
      h1.toggleClass("player2");
      h1.toggleClass("player1")
      if(isKeyBoardGame) {
          keyGame();
      } else if(isComputerGame && turn === 1) {
        setTimeout(function() {
          computerGame();
        }, 1000);
      }
    }
  }
  return;
};

function checkPattern(turn) { // checks if any player won
  for(var i = 0; i < patterns.length; i++) {
    for(var j = 0; j < patterns[i].length; j++){
      if(board[patterns[i][j]] === playerChars[turn]) {
        numPattern++;
      }
    };
    if(numPattern === 3) {
      winPattern = patterns[i];
      gameOver(playerNames[turn], winPattern, isGameDraw);
      return;
    };
    numPattern = 0;
  };
  checkDraw();
};

function checkDraw() { // checks if game is draw
  var squaresFilled = 0;
  board.forEach(function(square) {
    if(square === playerChars[0] || square === playerChars[1]) {
      squaresFilled += 1;
    };
  });
  if(squaresFilled === 9) {
    isGameDraw = true;
    gameOver('', '', isGameDraw);
  };
};

function gameOver(playerWon, winPattern, isGameDraw) { // marks the end of the game // set final h1, win-pattern animation and css
  isGameOver = true;
  if(isGameDraw) {
    h1.html("Game Drawn");
    h1.addClass("red");
    showModal();
  } else {
    h1.html(playerWon + " wins");
    for(var i = 0; i < winPattern.length; i++) {
      $("." + winPattern[i]).addClass("blink-bg");
      $("." + winPattern[i]).removeClass("player" + (turn + 1) + "Mouse");
      setTimeout(function(winPattern, i) {
        $("." + winPattern[i]).removeClass("blink-bg");
        $("." + winPattern[i]).addClass("win-bg");
      }, 1700, winPattern, i);
    };
  };
  $("div.hide").fadeIn(3000);
  $(".hide button").one("click", function() {// turn = 0;
    board = ['','','','','','','','',''];
    currentSquare = 0;
    isGameOver = false;
    numPattern = 0;
    winPattern = [];
    var nextGame = $(this).attr("class");
    if(nextGame === "newGame") {
      setTimeout(function() {
        tdjq.removeClass("player1Mouse");
        tdjq.removeClass("cursorNotAllowed");
        tdjq.removeClass("player2Mouse");
        tdjq.removeClass("win-bg");
        tdjq.html("");
        tdjq.unbind();
        h1.removeClass("player" + (turn + 1));
        h1.removeClass("red");
        turn = 0;
        game();
      }, 1000);
      return;
    } else {
      isKeyBoardGame = false;
      isComputerGame = false;
      window.location.reload();
    };
  });
};

// --------------------------------------------- EXCLUSIVE TO KEYBOARD GAME ---------------------------------------------
function nextEmptySquare() { // set the sqaure at the start of the turn
  for(var i = 0; i < board.length; i++) {
    if(board[i] === '') {
      tdjs[currentSquare].classList.remove("currentSquare");
      currentSquare = i;
      tdjs[currentSquare].classList.add("currentSquare");
      return i;
    }
  };
};

function startTurn() { // start of turn
  var nextSquare = tdjs[nextEmptySquare()];
  nextSquare.classList.add("player" + (turn + 1) + "Mouse");
  nextSquare.innerHTML = playerChars[turn];
};

function keyGame() { // the keyboard game
  if(gameNumber === 1 && board.toString() === ",,,,,,,,") {
    alert($("ul").text()); // instructions
  };
  startTurn();
  $(document).unbind(); // avoid re-defining listeners
  $(document).keydown(function(event) {
    if(event.which >= 37 && event.which <=40 && !isGameOver) { // change css of current square and the next square when any of the arrow key is pressed
      var keyPressed = event.which;
      tdjs[currentSquare].classList.remove("currentSquare");
      if(!board[currentSquare]) {
        tdjs[currentSquare].classList.remove("player" + (turn + 1) + "Mouse");
      };
      if(!board[currentSquare]) {
        tdjs[currentSquare].innerHTML = '';
      }
        currentSquare = neighbours[currentSquare][keyPressed];
        tdjs[currentSquare].classList.add("currentSquare");
        if(!board[currentSquare]) {
          tdjs[currentSquare].classList.add("player" + (turn + 1) + "Mouse");
          tdjs[currentSquare].innerHTML = playerChars[turn];
        }
    } else if(event.key === "Enter" && !board[currentSquare]) { // record the move on pressing enter
      tdjs[currentSquare].classList.remove("currentSquare");
      setTimeout( function(currentSquare, tdjq) {
        endOfTurn(currentSquare);
      }, 100, currentSquare, tdjq);
    };
  });
};

// ----------------------------------------------------------------------------------------------------------------------

// --------------------------------------------- EXCLUSIVE TO COMPUTER GAME ---------------------------------------------
function selectSquare() { // select the square where computer has to play
  while(true) {
    if(!board[4]) { // select center if it is not already played
      return 4;
    };
    var isTwoO = checkTwo(turn); // select a square to win, if possible
    if(isTwoO[0]) {
      return isTwoO[1];
    };
    var isTwoX = checkTwo(1-turn); // select a square to block opponent from winning
    if(isTwoX[0]) {
      return isTwoX[1];
    };

    if(predictDoubleTrap()) { // avoid possible double trap
      return 7;
    };

    var isCorner = pickCorner(); // pick a corner
    if(isCorner[0]) {
      return isCorner[1];
    };

    var rand = Math.floor(Math.random() * 9); // select a random square
    if(!board[rand]) {
      currentSquare = rand;
      return rand;
    }
  }
}

function checkTwo(turn) { // checks if 2 sqaures in a pattern are filled by the same player and the 3rd sqaure is empty
  var numXO = 0;
  var leftOut;
  var returnArray = [];
  for(var i = 0; i < patterns.length; i++) {
    for(var j = 0; j < patterns[i].length; j++) {
      if(board[patterns[i][j]] === playerChars[turn]) {
        numXO++;
      } else {
        leftOut = patterns[i][j];
      }
    }
    if(numXO === 2 && !board[leftOut]) {
      returnArray = [true, leftOut];
      return returnArray;
    }
    numXO = 0;
  }
  return [false];
}

function predictDoubleTrap() { // avoids double trap
  possibleTraps = [[0,8],[2,6]];
  for(var i = 0; i < 2; i++) {
      if(board[4] === playerChars[turn] && board[possibleTraps[i][0]] === playerChars[1-turn] && board[possibleTraps[i][1]] === playerChars[1-turn]) {
        return 7;
      }
  }
}

function pickCorner() { // picks a random corner
  var corners = [0, 2, 6, 8];
  var returnArray;
  for(var i = 0; i < 4; i++) {
    if(!board[corners[i]]) {
      returnArray = [true, corners[i]];
      return returnArray;
    }
  }
  return [false];
}

function computerGame() { // end computer's turn
  var square = selectSquare();
  tdjs[square].innerHTML = playerChars[turn];
  tdjs[square].classList.add("player" + (turn + 1) + "Mouse");
  endOfTurn(square);
};



// ----------------------------------------------------------------------------------------------------------------------