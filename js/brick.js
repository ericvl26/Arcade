
var ballRadius = 10;
var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
//creates array with BRICK_COUNT number of values
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
// console.log(brickGrid);
var bricksLeft = 0;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;

var canvas, canvasContext;

var brickDisplayType = 'full';  //random or full ~from form input

var mouseX = 0;
var mouseY = 0;

function updateMousePos(evt) {
   var rect = canvas.getBoundingClientRect();
   var root = document.documentElement;

   mouseX = evt.clientX - rect.left - root.scrollLeft;
   mouseY = evt.clientY - rect.top;
   // mouseY = evt.clientY - rect.top - root.scrollTop;

   paddleX = mouseX - PADDLE_WIDTH/2;

   // ** For Testing** test ball in any position
   // ballX = mouseX;
   // ballY = mouseY;
   // ballSpeedX = 5;
   // ballSpeedY = -5;
}

//set all values in brickGrid to true
function brickReset() {
   bricksLeft = 0;
   var i;
   for (i=0; i < 3*BRICK_COLS; i++) {  //creates gutter for first 3 rows
      // brickGrid[i] = false;
      brickGrid[i] = { brickState: false }
   }
   for (; i<BRICK_COLS*BRICK_ROWS; i++) {

      if (brickDisplayType == 'full') {  //*** Turn on all bricks
         // brickGrid[i] = true;
         brickGrid[i] = {
                        brickState: true,
                        brickLife: 3,
                        brickColor: [ null, '#fa694c', '#c4d559', '#44c676']
                     };
         bricksLeft++;
      } else if (brickDisplayType = 'random') {  // *** Turn on random bricks
         if(Math.random() < 0.55) {
            brickGrid[i] = {
                           brickState: true,
                           brickLife: 3,
                           brickColor: [ null, '#fa694c', '#c4d559', '#44c676']
                        };
            bricksLeft++;
         } else {
            brickGrid[i] = { brickState: false }
         } // end of else (random check)
      }
   } // end of for each brick
} // end of brickReset func

window.onload = function() {
   canvas = document.getElementById('gameCanvas');
   canvasContext = canvas.getContext('2d');

   var framesPerSecond = 30;
   setInterval(updateAll, 1000/framesPerSecond);

   canvas.addEventListener('mousemove', updateMousePos);

   brickReset();
   ballReset();
}

function updateAll() {
   moveAll();
   drawAll();
}

function ballReset() {
   ballX = canvas.width/2;
   ballY = canvas.height/2;
}

function ballMove() {
   ballX += ballSpeedX;
   ballY += ballSpeedY;

   if(ballX < 0 && ballSpeedX < 0.0) { //left    // ballSpeedX < 0.0 ~ fixes bug where ball gets trapped
      ballSpeedX *=-1;
   }
   if(ballX > canvas.width && ballSpeedX > 0.0) {   //right  // ballSpeedX > 0.0 ~ only flips speed if its not making its way back onto the playfield
      ballSpeedX *=-1;
   }
   if(ballY < 0 && ballSpeedY < 0.0) {  //top
      ballSpeedY *=-1;
   }
   if(ballY > canvas.height) {  //bottom
      ballReset();
      brickReset();
   }
}


function isBrickAtColRow(col, row) {
   if (col >= 0 && col < BRICK_COLS && row >= 0 && row < BRICK_ROWS) {  //checks if is a valid row/col
      var brickIndexUnderCoord = rowColToArrayIndex(col, row);
      return brickGrid[brickIndexUnderCoord]['brickState'];
   } else {
      return false;   //handles error case when ball hits first row.
   }
}

function ballBrickHandling() {
   var ballBrickCol = Math.floor(ballX / BRICK_W);
   var ballBrickRow = Math.floor(ballY / BRICK_H);
   var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow)

   // Hides brick when hit by ball
   if (ballBrickCol >= 0 &&  //checks for edge case.  Negative number does not pass
      ballBrickCol < BRICK_COLS &&
      ballBrickRow >= 0 && //checks for edge case
      ballBrickRow < BRICK_ROWS) {

         //if ball hits existing brick
         if (isBrickAtColRow( ballBrickCol, ballBrickRow )) {

            //checks brick life
            if (brickGrid[brickIndexUnderBall]['brickLife'] > 0 && brickGrid[brickIndexUnderBall]['brickLife'] ) {
               brickGrid[brickIndexUnderBall]['brickLife'] -= 1;
               // console.log(brickGrid[brickIndexUnderBall]['brickLife']);
            }
            //if brickLife = 0
            if (brickGrid[brickIndexUnderBall]['brickLife'] == 0)  {
               brickGrid[brickIndexUnderBall]['brickState'] = false;
               bricksLeft--;
               // console.log(bricksLeft);
            } ;

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);

            var bothTestsFailed = true;

            //if ball changes columns when hitting brick. (hit brick from side). deflect X speed
            if (prevBrickCol != ballBrickCol) {
               //checks if there is an adjacent brick present, fixes bug when hitting block corner
               if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false ) {
                  ballSpeedX *= -1;
                  bothTestsFailed = false;
               }
            }
            //if ball changes rows when hitting brick. (hit brick from top/bottom). deflect Y speed
            if (prevBrickRow != ballBrickRow) {
               //checks if there is an adjacent brick present, fixes bug when hitting block corner
               if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false ) {
                  ballSpeedY *= -1;
                  bothTestsFailed = false;
               }
            }

            if (bothTestsFailed) { //armpit case, prevents ball from going right thru.
               ballSpeedX *= -1;
               ballSpeedY *= -1;
            }

         }  // end of brick found
   }  // end of valid col and row
}  // end of ballBrickHandling function

function ballPaddleHandling() {
   var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
   var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
   var paddleLeftEdgeX = paddleX;
   var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
   //Deflect ball if it hits paddle
   if( ballY > paddleTopEdgeY && // below top of paddle
      ballY < paddleBottomEdgeY &&  // above bottom of paddle
      ballX > paddleLeftEdgeX &&  // right of the left side of paddle
      ballX < paddleRightEdgeX) { // left of the right side of paddle

         ballSpeedY *= -1;

         var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
         var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
         //deflect ball depending on how far from center of paddle the ball hits.
         ballSpeedX = ballDistFromPaddleCenterX * 0.35;

         // reset bricks if 0 bricks and ball hits paddle
         if (bricksLeft == 0) {
            brickReset();
         } // out of bricks
   } // ball center inside paddle
} // end of ballPaddleHandling

//************************** Move All *****************************
function moveAll() {
   ballMove();
   ballBrickHandling();
   ballPaddleHandling()
}

//************************** Draw All *****************************
function drawAll() {
   //draw canvas
   colorRect(0,0, canvas.width,canvas.height, 'black');

   //draw ball
   colorCircle(ballX,ballY, ballRadius, 'white');

   //draw paddle
   colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'orange');

   drawBricks();



   //*********** Mouse position testing **********
   //**display mouse position by pixel grid
   // colorText(mouseX+","+mouseY, mouseX, mouseY, 'yellow');
   //**display mouse position for testing. display rows/column with decimal
   // var mouseBrickCol = mouseX / BRICK_W;
   // var mouseBrickRow = mouseY / BRICK_H;

   // //**display mouse position by row/columns; w/ brick array index
   // var mouseBrickCol = Math.floor(mouseX / BRICK_W);
   // var mouseBrickRow = Math.floor(mouseY / BRICK_H);
   // var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow)
   // colorText(mouseBrickCol+","+mouseBrickRow+":"+brickIndexUnderMouse, mouseX, mouseY, 'yellow');
}

//return array index of a brick
function rowColToArrayIndex(col, row) {
   return BRICK_COLS * row + col;
}

function drawBricks() {
   for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
      for (var eachCol=0; eachCol<BRICK_COLS; eachCol++) {

         var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

         if(brickGrid[arrayIndex]['brickState'] == true) {
            colorRect(BRICK_W*eachCol, BRICK_H*eachRow, BRICK_W-BRICK_GAP, BRICK_H-BRICK_GAP, brickGrid[arrayIndex]['brickColor'][(brickGrid[arrayIndex]['brickLife'])]);
         }  // end of is this brick here
      }  // end of for each brick
   } // end of for each row
}  // end of drawBricks func

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
   canvasContext.fillStyle = fillColor;
   canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
   canvasContext.fillStyle = fillColor;
   canvasContext.beginPath();
   canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true)
   // (centerX, centerY, radius, arc Angle start-0, arc angle end-2pi, clockwise )
   canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
   canvasContext.fillStyle = fillColor;
   canvasContext.fillText(showWords, textX, textY);
}


// ************************** OPTION CONTROLS  *************************************

$form = $('form');
$resetButton = $('#resetBtn');

$resetButton.hide();

//Click the Reset button
$resetButton.on('click', function(){
	$form.show();
	$resetButton.hide();


	//Reset to initial state
	// posX = 10;
	// posY = 10;
	// //Generate new random apple
	// appleX=Math.floor(Math.random()*tileCount);
	// appleY=Math.floor(Math.random()*tileCount);
	// velX = 1;
	// velY = 0;
	// trail=[];
	// tail = 5;
	// playerScore = 0;
	// highScore = 0;
	$('#highScore').text(highScore);

	endRound = false;
	firstGame = true;
});

//Form Submit to start game
$form.on('submit', function(evt) {
	evt.preventDefault();

	brickDisplayType = $('input[name="brickDisplayType"]:checked').val();
	console.log(brickDisplayType);

	firstGame = false;
	$form.hide();
	$resetButton.show();
});
