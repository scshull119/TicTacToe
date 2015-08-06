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
};




$(document).ready(function() {
  init();
});
