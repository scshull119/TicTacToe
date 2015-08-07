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

function Player() {
  this.myName = "";
  this.myType = "";
  this.mySymbol = "";
  this.wins = 0;
}

      Player.prototype.init = function init(playerId) {
        this.myName = $(playerId + ' input').val();
        this.myType = $(playerId + ' .player-type').val();
        this.mySymbol = $(playerId + ' .player-symbol').val();
      };


// Board object constructor function and prototype

function Board() {
  this.squareDepth = 3;
}
      // Based on the desired number of squares on a side, creates properties
      // on the Board object to hold the values of each square.
      Board.prototype.init = function init() {
        this.getSquareDepth();
        for(var i = 1; i <= this.squareDepth; i++) {
          for(var j = 1; j <= this.squareDepth; j++) {
            var varName = "row" + i + "col" + j;
            this[varName] = "";
          }
        }
      };

      // Function reads the user's selection of a board size, allowing 4x4 and 5x5 boards in addition to default 3x3.
      Board.prototype.getSquareDepth = function getSquareDepth() {
        var stringDepth = $("#board-size").val();
        this.squareDepth = parseInt(stringDepth);
      };


// Game object constructor function and prototype

function TicTacToeGame() {
  this.board = {};
  this.player1 = {};
  this.player2 = {};
  this.goal = 1;
  this.gameCount = 0;
  this.whosTurn = 1;
}

TicTacToeGame.prototype.init = function init() {  // Creates and initializes all necessary child objects
  this.board = new Board(3);
  this.board.init();
  this.player1 = new Player();
  this.player1.init('#first-player');
  this.player2 = new Player();
  this.player2.init('#second-player');
  var stringGoal = $('#num-times').val();
  this.goal = parseInt(stringGoal);

  this.drawGameBoard();
  this.drawScoreBoard();
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

TicTacToeGame.prototype.drawGameBoard = function drawGameBoard() {

  var gameSquare = $("<div>").attr("id", "game-square");  // Square div holding square TicTacToe table
  var gameTable = $("<table>").attr("id", "game-table");   // Table object to function as gameboard outline
  $(gameTable).append($("<tbody>"));    // tbody to hold generated rows/columns

  // Determine width and height of each cell...
  var cellSize = 450 / this.board.squareDepth;

  // loop to generate row/column framework for table

  for(var i = 1; i <= this.board.squareDepth; i++) {
    var tRow = $("<tr>");
    for(var j = 1; j <= this.board.squareDepth; j++) {
      var tCell = $("<td>").attr("id", i + "-" + j).css({width: cellSize, height: cellSize});
      $(tRow).append($(tCell));
    }
    $(gameTable).append($(tRow));
  }

  // Appending created table elements to the game square and, finally, to the chalk board
  $(gameSquare).append($(gameTable));
  $('#chalk-board').append($(gameSquare));
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
  var playerName = $("<h3>").text(nameString);

  $(playerScore).append($(playerName));
  $("#score-area").append($(playerScore));
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
