//---------------------------------------------------------------------
// Project: PONG
// Coder: Geert Dijkstra
// Last update: 02 March 2019
// Description: Little pong game using Javascript & HTML5 Canvas
//---------------------------------------------------------------------


const WINNING_SCORE = 10;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 60;
const BALL_WIDTH = 12;
const BSF = 1.5;

var canvas;
var context;

var ballX = 194;
var ballY = 194;
var ballSpeedX = -4;
var ballSpeedY = 0;

var playerY = 170;
var playerMaxSpeed = 12;
var playerVelocity = 0;
var playerFriction = 0.8;
var playerScore = 0;

var computerY = 170;
var computerMaxSpeed = 12;
var computerVelocity = 0;
var computerFriction = 0.7;
var computerScore = 0;
var computerTurn = false;
var computerRandomBehavior = 250;

var gameOver = false;
var keys = [];


// Init
window.addEventListener('load', init, false);

function init() {

    canvas = document.getElementById('pong');
    context = canvas.getContext('2d');

    // userinput
    canvas.addEventListener('mousedown', restart);

    document.body.addEventListener("keydown", function (e) {
      event.preventDefault();
      keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function (e) {
      event.preventDefault();
      keys[e.keyCode] = false;
    });

    // update game
    requestAnimationFrame(update);
}

// Animation loop
function update() {

    drawField();
    drawBall();
    drawPlayer();
    drawComputer();
    drawText();

    requestAnimationFrame(update);
}

// draw Field
function drawField() {

    createRect(0, 0, canvas.width, canvas.height, 'black');

    for (var i = 0; i < canvas.height; i += (PADDLE_WIDTH * 2)) {

        createRect(canvas.width / 2, i, 1, PADDLE_WIDTH, 'grey');
    }
}

// draw Player
function drawPlayer() {

    createRect(PADDLE_WIDTH, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    if (keys[38]) {
        if (playerVelocity > -playerMaxSpeed) {
            playerVelocity--;
        }
    }
    if (keys[40]) {
        if (playerVelocity < playerMaxSpeed) {
            playerVelocity++;
        }
    }

    playerVelocity *= playerFriction;
    playerY += playerVelocity;

    if (playerY >= 328) {
        playerY = 328;
    }
    else if (playerY <= 12) {
        playerY = 12;
    }
}

// draw Computer
function drawComputer() {

  createRect(canvas.width - (PADDLE_WIDTH * 2), computerY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

  if(!gameOver){
    computerAI();
  }
}

function computerAI(){

  console.log(computerRandomBehavior)

  var computerCenter = computerY + (PADDLE_HEIGHT / 2);

  // computer's Turn
  if (computerTurn){

    // update velocity till maximum speed is reached
    if (computerVelocity < computerMaxSpeed){

      if (ballX > computerRandomBehavior){

        computerFriction = 0.99;
      }
      else{

        computerFriction = 0.7;
      }
    }
  }

  //player's Turn
  else{

    computerFriction = 0.7;
  }

  // follow ball
  if (computerCenter + 20 < ballY){

    computerVelocity++;
  }
  else if (computerCenter - 20 > ballY){

    computerVelocity--;
  }

  // keep computer in the field
  if (computerY >= 328) {
    computerY = 328;
  }
  else if (computerY <= 12) {
    computerY = 12;
  }

  computerVelocity *= computerFriction;
  computerY += computerVelocity;
}

// draw Text
function drawText() {

    context.font = "12px Courier";
    context.fillStyle = 'grey';
    context.textAlign ='center';
    context.fillText(playerScore, 150, 200);
    context.fillText(computerScore, canvas.width - 150, 200);

    if (gameOver) {

        context.fillStyle = 'grey';

        if (playerScore >= WINNING_SCORE) {
            context.fillText("Awesome, you beat the computer!!!", 150, 215);
            context.fillText("New game? Click in the field.", 150, 230);
            //context.fillText("You won!!!", 85, canvas.height / 2);

        } else if (computerScore >= WINNING_SCORE) {
            context.fillText("Oops, the computer won... ", canvas.width - 150, 215);
            context.fillText("Revenge? Click the field.", canvas.width - 150, 230);
        }
    }
}

// draw Ball
function drawBall() {

  if (!gameOver) {

    createRect(ballX, ballY, BALL_WIDTH, BALL_WIDTH, 'white');

    ballX += ballSpeedX * BSF;
    ballY += ballSpeedY * BSF;

    // ball hitting top of the field
    if (ballY < 0) {
      ballSpeedY = -ballSpeedY;
    }
    // ball hitting bottom of the field
    if (ballY > canvas.height - PADDLE_WIDTH) {
        ballSpeedY = -ballSpeedY;
    }

    // ball on player side
    if (ballX <= (PADDLE_WIDTH * 2)) {
      checkPlayerside();
    }

    // ball on computer side
    if (ballX >= canvas.width - (PADDLE_WIDTH * 3)){
      checkComputerSide();
    }
  }
}

function checkPlayerside(){

  var ballCenter = ballY + (BALL_WIDTH/2);

  // if bottom of the ball hits top of the player
  if (ballCenter + (BALL_WIDTH ) > playerY  && ballCenter <= playerY + 2){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = -6;
    computerTurn = true;
  }

  // if the ball hits player playerY: 1 - 12
  else if (ballCenter > playerY + 2 && ballCenter <= playerY + 12){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = -3;
    computerTurn = true;
  }

  // if Ball hits playerY: 13 - 24
  else if (ballCenter > playerY + 12 && ballCenter <= playerY + 24){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = -1;
    computerTurn = true;
  }

  // if Ball hits playerY: 25 - 36 (center)
  else if (ballCenter > playerY + 24 && ballCenter <= playerY + 36){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 0;
    computerTurn = true;
  }

  // if Ball hits playerY: 36 - 48
  else if (ballCenter > playerY + 36 && ballCenter <= playerY + 48) {

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 1;
    computerTurn = true;
  }

  // if Ball hits playerY: 48 - 58
  else if (ballCenter > playerY + 48 && ballCenter <= playerY + 58) {

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3;
    computerTurn = true;
  }

  // if Ball hits playerY: 60
  else if (ballCenter > playerY + 58 && ballCenter - (BALL_WIDTH) <= playerY + 60) {

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 6;
    computerTurn = true;
  }

  // Player missing the ball
  if (ballX + PADDLE_WIDTH < 0) {
    computerScore++;
    ballReset();
  }
}

function checkComputerSide(){

  var ballCenter = ballY + (BALL_WIDTH/2);

  // if bottom of the ball hits top of the computer
  if (ballCenter + (BALL_WIDTH ) > computerY  && ballCenter <= computerY + 2){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = -6;
    computerTurn = false;
  }
  // if the ball hits computerY: 1 - 12
  else if (ballCenter > computerY + 2 && ballCenter <= computerY + 12){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = -3;
    computerTurn = false;
  }

  // if Ball hits computerY: 13 - 24
  else if (ballCenter > computerY + 12 && ballCenter <= computerY + 24){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = -1;
    computerTurn = false;
  }

  // if Ball hits computerY: 25 - 36 (center)
  else if (ballCenter > computerY + 24 && ballCenter <= computerY + 36){

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 0;
    computerTurn = false;
  }

  // if Ball hits computerY: 36 - 48
  else if (ballCenter > computerY + 36 && ballCenter <= computerY + 48) {

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 1;
    computerTurn = false;
  }

  // if Ball hits computerY: 48 - 58
  else if (ballCenter > computerY + 48 && ballCenter <= computerY + 58) {

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3;
    computerTurn = false;
  }

  // if Ball hits computerY: 60
  else if (ballCenter > computerY + 58 && ballCenter - (BALL_WIDTH) <= computerY + 60) {

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 6;
    computerTurn = false;
  }





  // computer missing the ball
 if (ballX > canvas.width) {
   playerScore++;
   ballReset();
  }
}

// restart game
function restart(e) {

    if (gameOver) {

        var ballSpeedX = 4;
        var ballSpeedY = 0;

        playerScore = 0;
        computerScore = 0;
        gameOver = false;

    }
}

// reset ball
function ballReset() {

    if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {

        gameOver = true;
    }

    if (computerTurn === true){
      ballSpeedX = 4;
      ballSpeedY = 0;
      ballSpeedX = -ballSpeedX;
      computerTurn = false;
    }
    else{
      ballSpeedX = -4;
      ballSpeedY = 0;
      ballSpeedX = -ballSpeedX;
      computerTurn = true;
    }

    // a littlebit of random behavior of the computer's speed
    var ran1 = Math.floor(Math.random() * 25);
    var ran2 = Math.floor(Math.random() * 75);
    computerRandomBehavior = ran1 + ran2;

    ballX = canvas.width / 2;
    ballY = Math.floor(Math.random() * (canvas.height/4) + 150);

}

// Helper function to create a rect quickly
function createRect(posX, posY, width, height, color){
    context.fillStyle = color;
    context.fillRect(posX, posY, width, height);
}
