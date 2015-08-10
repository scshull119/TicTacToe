function init() {
  console.log("Set to go dude.")

  populatePlayerWindow("player1");
  populateTitleArea();
  populatePlayerWindow("player2");

  $('#start-game').on('click', function() {
    var myGame = new TicTacToeGame();
    myGame.init();
    console.log(myGame);
  });

}

// Player object constructor function and prototype

function Player(parentScope) {
  this.that = parentScope;
  this.playerId = "";
  this.myName = "";
  this.myType = "";
  this.mySymbol = "";
  this.mySquares = [];
  this.wins = 0;
}

      Player.prototype.init = function init(playerId, shortId) {
        this.playerId = shortId;
        this.myName = $(playerId + ' input').val();
        this.myType = $(playerId + ' .player-type').val();
        this.mySymbol = $(playerId + ' .player-symbol').val();
      };

      Player.prototype.didIWin = function didIWin() {
        var sortedSquares = this.mySquares.sort(function(a, b){return a-b});
        var boardSize = this.that.board.squareDepth;
        var minCondition = 2;
        var maxCondition = boardSize - 1;

        numSquares = sortedSquares.length
        if(numSquares >= boardSize) {

          for(var i = numSquares - 1; i > 0; i--) {
            var diffsArray = [];
            var worksForConditions = [];
            for(var j = i - 1 ; j >= 0; j--) {
              diffsArray.push(sortedSquares[i] - sortedSquares[j]);
            }

            diffsArray = diffsArray.sort(function(a, b){return a-b});


              // Section for evaluating the array of differences.

              var diffsLength = diffsArray.length;



              for(var z = minCondition; z <= maxCondition; z++) {

                var worksForThisCondition = [];

                for(var k = diffsLength - 1; k > 0; k--) {
                  for(var l = k - 1; l >= 0; l--) {
                    if(diffsArray[k] / diffsArray[l] == z) {
                      worksForThisCondition.push(diffsArray[k]);
                    }
                  }
                }
                if(worksForThisCondition.length > 0) {
                  worksForConditions.push(worksForThisCondition);
                }

              }

              console.log(worksForConditions);

              if(worksForConditions.length >= boardSize - 2) {
                this.wins++;
                this.drawTally();
                return true;
              }

          }

          return false;

        } else {
          return false;   //  Returns false value (no win) if the player has not yet selected enough squares for a win.
        }
      };


// Board object constructor function and prototype

function Board() {
  this.squareDepth = 3;
  this.availableSquares = [];
}
      // Based on the desired number of squares on a side, creates properties
      // on the Board object to hold the values of each square.
      Board.prototype.init = function init() {
        this.getSquareDepth();
        for(var i = 1; i <= this.squareDepth; i++) {
          for(var j = 1; j <= this.squareDepth; j++) {
            var varName = i.toString() + j.toString();
            varName = parseInt(varName);
            this.availableSquares.push(varName);
          }
        }
      };

      // Function reads the user's selection of a board size, allowing 4x4 and 5x5 boards in addition to default 3x3.
      // Winner logic should work for board sizes up to 9x9, and should be easily adaptable to 99x99, 999x999, etc,
      // by multipying base square ids by a factor of 10.  (eg 1001, 1002, 1003... instead of 11, 12, 13...)
      // User interface only gives options for 3x3, 4x4, and 5x5 however.
      Board.prototype.getSquareDepth = function getSquareDepth() {
        var stringDepth = $("#board-size").val();
        this.squareDepth = parseInt(stringDepth);
      };


// Game object constructor function and prototype

function TicTacToeGame() {
  this.that = this;

  this.board = {};
  this.clickedSquare = 0;
  this.player1 = {};
  this.player2 = {};
  this.goal = 1;
  this.gameCount = 0;
  this.whosTurn = 1;
}

TicTacToeGame.prototype.init = function init() {  // Creates and initializes all necessary child objects
  this.board = new Board();
  this.board.init();
  this.player1 = new Player(this.that);
  this.player1.init('#first-player', 'player1');   // Argurment corresponds to div id of that player's control input area on page
  this.player2 = new Player(this.that);
  this.player2.init('#second-player', 'player2');    // See above comment ---^
  var stringGoal = $('#num-times').val();
  this.goal = parseInt(stringGoal);

  this.whosTurn = 1;

  this.drawGameBoard();
  this.drawScoreBoard();
  this.drawPlayerTurn();

  this.letComputerStart();
};

// Human players take their turns using this function, activated by a click in on of the game squares.
TicTacToeGame.prototype.squareClicked = function squareClicked() {
  playerName = "player" + this.whosTurn;
  if(this[playerName].myType === "human") {     // Clicks will be disregarded if current player in NOT human.

    for(var i = 0; i < this.board.availableSquares.length; i++) {
      if(this.board.availableSquares[i] === this.clickedSquare) {
        var noLongerAvailable = this.board.availableSquares.splice(i, 1);
        this[playerName].mySquares.push(noLongerAvailable[0]);
        console.log(playerName + "'s squares: " + this[playerName].mySquares);

        this.drawSymbol(this[playerName].mySymbol, this.clickedSquare);

        var win = this[playerName].didIWin();
        var draw = this.isDrawGame();
        if(win === true) {
          console.log("This round won by " + this[playerName].myName + "!");
          this.announce("This round won by" + this[playerName].myName + "!");
          this.nextRound();
          return true;
        } else if(draw === true) {
          console.log("Draw game. No winner.");
          this.announce("Draw game. No winner.");
          this.nextRound();
          return false;
        } else {
          this.nextTurn();
        }
      }
    }
  }
};

TicTacToeGame.prototype.nextTurn = function nextTurn() {
  if(this.whosTurn === 1) {
    this.whosTurn = 2;
  } else {
    this.whosTurn = 1;
  }

  this.drawPlayerTurn();
  playerName = "player" + this.whosTurn;

  if(this[playerName].myType === "computer") {
    console.log("Now the computer goes...");
    this.computerTurn();
  }
};

TicTacToeGame.prototype.letComputerStart = function letComputerStart() {
  var playerName = "player" + this.whosTurn;

  if(this[playerName].myType === "computer") {
    this.computerTurn();
  }
}

TicTacToeGame.prototype.computerTurn = function computerTurn() {
  playerName = "player" + this.whosTurn;



  var numOptions = this.board.availableSquares.length;
  var randomIndex = Math.floor(Math.random() * numOptions);
  var noLongerAvailable = this.board.availableSquares.splice(randomIndex, 1);
  this[playerName].mySquares.push(noLongerAvailable[0]);

  console.log(playerName + "'s squares: " + this[playerName].mySquares);

  var element = this;

  setTimeout(function() {
    element.drawComputerSymbol(element[playerName].mySymbol, noLongerAvailable[0]);
  }, 2000);

  setTimeout(function() {
    var win = element[playerName].didIWin();
    var draw = element.isDrawGame();
    if(win === true) {
      console.log("This round won by " + element[playerName].myName + "!");
      element.announce("This round won by " + element[playerName].myName + "!");
      element.nextRound();
      return true;
    } else if(draw === true) {
      console.log("Draw game. No winner.");
      element.announce("Draw game. No winner.");
      element.nextRound();
      return false;
    }

    setTimeout(function() {
      element.nextTurn();
    }, 3000);

  }, 3500);



};

TicTacToeGame.prototype.isDrawGame = function isDrawGame() {
  if(this.board.availableSquares.length === 0) {
    return true;
  } else {
    return false;
  }
};

TicTacToeGame.prototype.nextRound = function nextRound() {
  console.log("Time for the next round!");
  this.board.availableSquares = [];
  this.refreshGameBoard();
  this.board.init();
  this.player1.mySquares = [];
  this.player2.mySquares = [];
  this.nextTurn();
};

// Displays an overlay "curtain" screen with animated passed-in message.  Resets Game.  Button click clears overlay.
TicTacToeGame.prototype.gameOver = function gameOver(message) {

  var gameOverCurtain = $("<div>").attr("class", "curtain")
  var curtainContent = $("<div>").attr("class", "curtain-content").append($("<h1>").attr("id", "curtain-message").text(message));
  var restartButton = $("<button>").attr("id", "restart-button").attr("type", "button").attr("name", "restart-button").text("Play Again");
  $(curtainContent).append($(restartButton));
  $(gameOverCurtain).append($(curtainContent));
  $("main").append($(gameOverCurtain));
  $(".curtain-content").animate({"margin-top": "350px"}, 300, function() {
    $(restartButton).fadeIn(400, function() {
      $(restartButton).on("click", function() {
        $(gameOverCurtain).remove();
      })
    })
  });

  var element = $(this);

  $("#controls-container").empty();
  $("#chalk-board").empty();

  populatePlayerWindow("player1");
  populateTitleArea();
  populatePlayerWindow("player2");

  $('#start-game').on('click', function() {
    $(element)[0].init();
  });
};


// ------------------------------------- View Controller Section -----------------------------------

// Draws a player control menu.  For use when page is first loaded, and on each game restart.
function populatePlayerWindow(playerId) {
  if(playerId == "player1") {
    var divId = "first-player";
    var titleString = "Player 1 (First Move)";
    var nameString = "Player 1";
    var defaultSymbol = "X";
    var altSymbol = "O";
  } else if(playerId == "player2") {
    var divId = "second-player";
    var titleString = "Player 2 (Second Move)";
    var nameString = "Player 2";
    var defaultSymbol = "O";
    var altSymbol = "X";
  }

  var playerWindowDiv = $("<div>").attr("id", divId).attr("class", "player-window");
  $(playerWindowDiv).append($("<h2>").text(titleString));

  var inputsList = $("<ul>");

  var nameInput = $("<li>").text("Name: ").append($("<input>").attr("type", "text").attr("name", "player-name").attr("value", nameString));
  var typeInput = $("<li>").text("Player/Computer: ").append($("<select>").attr("class", "player-type").attr("name", "player-type").append(
    $("<option>").attr("value", "human").text("Human Player"), $("<option>").attr("value", "computer").text("Computer Player")
  )  );
  var symbolInput = $("<li>").text("Symbol: ").append($("<select>").attr("class", "player-symbol").attr("name", "symbol").append(
    $("<option>").attr("value", defaultSymbol).text(defaultSymbol), $("<option>").attr("value", altSymbol).text(altSymbol)
  )  );


  $(inputsList).append($(nameInput), $(typeInput), $(symbolInput));

  $(playerWindowDiv).append($(inputsList));

  $("#controls-container").append($(playerWindowDiv));

}

//    Draws the title area, with board size and play count options.  Used on page load and each game restart.
function populateTitleArea() {
  var titleArea = $("<div>").attr("id", "title-area").append($("<h1>").text("TicTacToe"));

  var timesSelect = $("<select>").attr("id", "num-times").attr("name", "num-times");
  for(var i = 1; i <= 10; i++) {
    var numOption = $("<option>").attr("value", i).text(i);
    $(timesSelect).append($(numOption));
  }

  var boardSelect = $("<select>").attr("id", "board-size").attr("name", "board-size");
  for(var j = 3; j <= 5; j++) {
    var sizeOption = $("<option>").attr("value", j).text(j);
    $(boardSelect).append($(sizeOption));
  }

  var playCount = $("<div>").attr("id", "play-count").append(
    $("<h3>").text("Play to: "),
    $(timesSelect),
    $("<h3>").text("Board Size: "),
    $(boardSelect)
  );

  var startButton = $("<button>").attr("id", "start-game").attr("type", "button").attr("name", "start-game").text("Start");

  $(titleArea).append($(playCount), $(startButton));
  $("#controls-container").append($(titleArea));

}

// Draws the TicTacToe game board and binds an event listener to listen for clicks on the squares.
TicTacToeGame.prototype.drawGameBoard = function drawGameBoard() {

  var element = $(this);

  var gameSquare = $("<div>").attr("id", "game-square");  // Square div holding square TicTacToe table
  var gameTable = $("<table>").attr("id", "game-table");   // Table object to function as gameboard outline
  $(gameTable).append($("<tbody>"));    // tbody to hold generated rows/columns

  // Determine width and height of each cell... And the font size of the symbols to be drawn in each cell.
  var cellSize = 450 / this.board.squareDepth;
  var fontSize = Math.floor(cellSize * .6666);

  // loop to generate row/column framework for table

  for(var i = 1; i <= this.board.squareDepth; i++) {
    var tRow = $("<tr>");
    for(var j = 1; j <= this.board.squareDepth; j++) {
      var tCell = $("<td>").attr("id", i.toString() + j.toString()).css({width: cellSize, height: cellSize, fontSize: fontSize});
      $(tRow).append($(tCell));
    }
    $(gameTable).append($(tRow));
  }

  // Appending created table elements to the game square and, finally, to the chalk board
  $(gameSquare).append($(gameTable));
  $('#chalk-board').append($(gameSquare));

  $("#game-table").on("click", function(e) {
    var clickedSquare = parseInt(e.target.id);
    $(element)[0].clickedSquare = clickedSquare;
    $(element)[0].squareClicked();
  });

};

TicTacToeGame.prototype.refreshGameBoard = function refreshGameBoard() {
  var element = $(this);

  $("#game-table").remove();

  var gameTable = $("<table>").attr("id", "game-table");   // Table object to function as gameboard outline
  $(gameTable).append($("<tbody>"));    // tbody to hold generated rows/columns

  // Determine width and height of each cell... And the font size of the symbols to be drawn in each cell.
  var cellSize = 450 / this.board.squareDepth;
  var fontSize = Math.floor(cellSize * .6666);

  // loop to generate row/column framework for table

  for(var i = 1; i <= this.board.squareDepth; i++) {
    var tRow = $("<tr>");
    for(var j = 1; j <= this.board.squareDepth; j++) {
      var tCell = $("<td>").attr("id", i.toString() + j.toString()).css({width: cellSize, height: cellSize, fontSize: fontSize});
      $(tRow).append($(tCell));
    }
    $(gameTable).append($(tRow));
  }

  // Appending created table elements to the game square and, finally, to the chalk board
  $("#game-square").append($(gameTable));

  $("#game-table").on("click", function(e) {
    var clickedSquare = parseInt(e.target.id);
    $(element)[0].clickedSquare = clickedSquare;
    $(element)[0].squareClicked();
  });
};

// Sets up the scoreboard area
TicTacToeGame.prototype.drawScoreBoard = function drawScoreBoard() {
  var scoreArea = $("<div>").attr("id", "score-area");
  $("#chalk-board").append($(scoreArea));
  this.drawPlayerName("player1");
  this.drawPlayerName("player2");
};

// Function for writing the names of each player in the scoreboard area.
TicTacToeGame.prototype.drawPlayerName = function drawPlayerName(playerId) {
  var playerScore = $("<div>").attr("id", playerId).attr("class", "player-score");
  var nameString = this[playerId].myName;
  var upperBox = $("<div>").attr("class", "tally upper").append("<span>");
  var lowerBox = $("<div>").attr("class", "tally lower").append("<span>");
  var playerName = $("<h3>").text(nameString);

  $(playerScore).append($(playerName)).append($(upperBox)).append($(lowerBox));
  $("#score-area").append($(playerScore));
};

// Handles changes of appearance to the player menu boxes to indicate who's turn it currently is.
TicTacToeGame.prototype.drawPlayerTurn = function drawPlayerTurn() {

  var element  = $(this);

  $("#start-game").text("Stop Game").off();
  $("#start-game").on("click", function() {
    $(element)[0].gameOver("Game Over");
  });

  if(this.whosTurn == 1) {
    var activeDiv = $("#first-player");
    var passiveDiv = $("#second-player");
    var playerId = "player1";
  } else if(this.whosTurn == 2) {
    var activeDiv = $("#second-player");
    var passiveDiv = $("#first-player");
    var playerId = "player2";
  }

  $(activeDiv).empty();
  $(activeDiv).append($("<h2>").text(this[playerId].myName + "'s Turn").css({"font-size": "32px"}));
  $(activeDiv).css({"background-color": "#449944"});

  $(passiveDiv).empty();
  $(passiveDiv).css({"background-color": "#881010"});
}

// Based on passed-in values for symbol and box number, draws a symbol in a box on the game board.
TicTacToeGame.prototype.drawSymbol = function drawSymbol(symbol, square) {
  var idName = "#" + square;
  $(idName).text(symbol);
};

// Based on passed-in values for symbol and box number, draws a symbol with fade-in (for computer player).
TicTacToeGame.prototype.drawComputerSymbol = function drawComputerSymbol(symbol, square) {
  var idName = "#" + square;
  var compSymbol = $("<span>").css({"display": "none"}).text(symbol);
  $(idName).append($(compSymbol));
  $(compSymbol).fadeIn(500);
};

TicTacToeGame.prototype.announce = function announce(phrase) {
  var announcement = $("<div>").attr("class", "announcement").text(phrase);
  $("#game-square").append($(announcement));

  setTimeout(function() {
    $(announcement).fadeOut(1500);
    setTimeout(function() {
      $(announcement).remove();
    }, 2000);
  }, 1500);

};

Player.prototype.drawTally = function drawTally() {
  var upperBoxTicks = 0;
  var lowerBoxTicks = 0;
  var upperBR = false;
  var lowerBR = false;
  var upperBoxString = "";
  var lowerBoxString = "";

  if(this.wins >= 4) {
    upperBoxTicks = 4;
  } else {
    upperBoxTicks = this.wins;
  }

  if(this.wins >= 9) {
    lowerBoxTicks = 4;
  } else {
    lowerBoxTicks = this.wins - 5;
  }

  if(this.wins >= 5) {
    upperBR = true;
  }

  if(this.wins == 10) {
    lowerBR = true;
  }

  for(var i = 0; i < upperBoxTicks; i++) {
    upperBoxString += "1";
  }

  for(var j = 0; j < lowerBoxTicks; j++) {
    lowerBoxString += "1";
  }

  console.log(upperBoxString);
  console.log(lowerBoxString);
  var selector = "#" + this.playerId;
  console.log(selector);



  $(selector).children().eq(1).children().eq(0).text(upperBoxString);
  $(selector).children().eq(2).children().eq(0).text(lowerBoxString);

  if(upperBR === true) {
    $(selector).children().eq(1).css({"background-image": "url('sprite.png')"});
  }

  if(lowerBR === true) {
    $(selector).children().eq(2).css({"background-image": "url('sprite.png')"});
  }

};







/*

<div id="score-area">
  <div id="player1" class="player-score">
    <h3>Lichard DeGray:</h3>
    <div class="tally upper">
      1111
    </div>
    <div class="tally lower">
      1111
    </div>
  </div>
  <div id="player2" class="player-score">
    <h3>Player 2:</h3>
    <div class="tally upper">
      1111
    </div>
    <div class="tally lower">
      1111
    </div>
  </div>
</div>
</div>



*/





$(document).ready(function() {
  init();
});
