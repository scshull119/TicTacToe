function init() {
  console.log("Set to go dude.")

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

function Board(squareDepth) {
  this.squareDepth = squareDepth;
}
      // Based on the desired number of squares on a side, creates properties
      // on the Board object to hold the values of each square.
      Board.prototype.init = function init() {
        for(var i = 1; i <= this.squareDepth; i++) {
          for(var j = 1; j <= this.squareDepth; j++) {
            var varName = "row" + i + "col" + j;
            this[varName] = "";
          }
        }
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



*/





$(document).ready(function() {
  init();
});
