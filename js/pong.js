// **************************  GAME  *************************************

var $p1RoundsWon = $('#p1RoundsWon');
var $p2RoundsWon = $('#p2RoundsWon');

var canvas;
var canvasContext;
var ballX = 70;
var ballY = 100;
// var ballSpeedX = 10;
var ballSpeedX;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;
var player1RoundsWon = 0;
var player2RoundsWon = 0;

var showingWinScreen = false;
var firstGame = true;
var onePlayer;
var numberOfPlayers;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 10;

const KEY_UP_ARROW = 73;    // i key
const KEY_DOWN_ARROW = 75;  // k key
var keyHeldUp = false;
var keyHeldDown = false;

// Player 1 mouse movement controls
function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top;
	return {
		x:mouseX,
		y:mouseY
	}
};

function handleMouseClick(evt) {
	if(showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
};

// Player 2 key controls
function keyPressed(evt) {
	// console.log(evt.keyCode);
	if (evt.keyCode == KEY_UP_ARROW) {
		keyHeldUp = true;
	}
	if (evt.keyCode == KEY_DOWN_ARROW) {
		keyHeldDown = true;
	}
}

// Player 2 key controls
function keyReleased(evt) {
	// console.log(evt.keyCode);
	if (evt.keyCode == KEY_UP_ARROW) {
		keyHeldUp = false;
	}
	if (evt.keyCode == KEY_DOWN_ARROW) {
		keyHeldDown = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond)

	canvas.addEventListener('mousedown', handleMouseClick);

	// event listener for player 2 paddle movement
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);


	// Control left paddle with mouse
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
			// console.log(paddle1Y);
			// paddle2Y = mousePos.y-(PADDLE_HEIGHT/2);
		});
};

function ballReset(){
	//check if a player has won
	if(player1Score >= WINNING_SCORE)  {
		player1RoundsWon += 1;
		$p1RoundsWon.text(player1RoundsWon);
		showingWinScreen = true;
	}
	if(player2Score >= WINNING_SCORE) {
		player2RoundsWon += 1;
		$p2RoundsWon.text(player2RoundsWon);
		showingWinScreen = true;
	}

	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX *= -1;
}

function computerMovement(){
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if (paddle2YCenter < ballY - 35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY + 35) {
		paddle2Y -= 6;
	}
};

function player2movement() {
	if (keyHeldDown) {
		paddle2Y += 12;
	}
	if (keyHeldUp) {
		paddle2Y -= 12;
	}
}

// Move Everything *****************************************************
function moveEverything() {

	if (showingWinScreen || firstGame) {
		return;
	}

	// One player or two player game?
	if (numberOfPlayers == 1) {
		computerMovement();
	} else if (numberOfPlayers == 2) {
		player2movement();
	};



	ballX += ballSpeedX;
	ballY += ballSpeedY;

	//when ball hits left paddle or wall
	if (ballX < 0 + BALL_RADIUS + PADDLE_WIDTH) {
		if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
			ballSpeedX *= -1;
			//returns ballSpeedY depending on how far from the center of the paddle the ball hits
			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++; //must be BEFORE ballReset()
			ballReset();
		}
	}
	//when ball hits right paddle or wall
	if (ballX > canvas.width - BALL_RADIUS - PADDLE_WIDTH) {
		if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX *= -1;
			//returns ballSpeedY depending on how far from the center of the paddle the ball hits
			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++; //must be BEFORE ballReset()
			ballReset();
		}
	}

	//When ball hits top wall
	if (ballY < 0) {
		ballSpeedY *= -1;
	}

	//When ball hits bottom wall
	if (ballY > canvas.height) {
		ballSpeedY *= -1;
	}
}

function drawNet() {
	for(var i=0; i<canvas.height; i+=40) {
		colorRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}

// Draw Everything *****************************************************
function drawEverything() {
	//Canvas, blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');
	// console.log(canvasContext.font)

	if (firstGame) {
		canvasContext.fillStyle = 'white';
		canvasContext.font = "50px sans-serif";
		canvasContext.fillText('PONG', 330, 310);
		return;
	}

	if (showingWinScreen) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText('Player 1 Won The Round!', 290, 200);
		} else if (player2Score >= WINNING_SCORE) {
			canvasContext.fillText('Player 2 Won The Round!', 290, 200);
		}
		canvasContext.fillText('Click To Play Again..', 313, 500);
		return;
	}

	drawNet();

	//Paddle left
	colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

	//Paddle right
	colorRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

	//Ball
	colorCircle(ballX, ballY, BALL_RADIUS, 'green');

	canvasContext.font = "20px sans-serif";
	canvasContext.fillStyle = 'white';
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

// ************************** END GAME CODE  *************************************



// ************************** OPTION CONTROLS  *************************************

$form = $('form');
$resetButton = $('#resetBtn');

$resetButton.hide();

//Click the Reset button
$resetButton.on('click', function(){
	$form.show();
	$resetButton.hide();

	//Reset to initial state
	firstGame = true;

	//reset round total scores
	player1RoundsWon = 0;
	player2RoundsWon = 0;
	$p1RoundsWon.text(player1RoundsWon);
	$p2RoundsWon.text(player2RoundsWon);

	//reset in game info
	player1Score = 0;
	player2Score = 0;
	showingWinScreen = false;
});

//Form Submit to start game
$form.on('submit', function(evt) {
	evt.preventDefault();

	// Get number of players from Form input
	// var numberOfPlayers = document.querySelector('input[name="numberPlayers"]:checked').value;
	numberOfPlayers = $('input[name="numberPlayers"]:checked').val();

	var speedX = $('#selectBallSpeed option:selected').val();
	console.log(speedX);
	if (speedX == 10) {
		ballSpeedX = 10;
	} else if (speedX == 5) {
		ballSpeedX = 5;
	} else if (speedX == 15) {
		ballSpeedX = 15;
	}

	firstGame = false;
	$form.hide();
	$resetButton.show();
});
