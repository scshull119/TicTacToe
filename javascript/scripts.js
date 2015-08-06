function init() {
  console.log("Set to go dude.")
  var player1 = new Player();
  player1.init();
  var player2 = new Player();
  player2.init();
  var myBoard = new Board(3);
  myBoard.init();
  console.log(myBoard);
}



// Player object constructor function and prototype

function Player() {
  this.myName = "";
  this.myType = "";
  this.mySymbol = "";
  this.wins = 0;
}





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

function TicTacToeGame(board, player1, player2, goal) {
  this.board = board;
  this.player1 = player1;
  this.player2 = player2;
  this.goal = goal;
  this.whosTurn = 1;

}




$(document).ready(function() {
  init();
});
