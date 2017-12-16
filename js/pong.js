// **************************  GAME  *************************************

var canvas;
var canvasContext;
var ballX = 70;
var ballY = 100;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;
var firstGame = true;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 10;

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
		showingWinScreen = false;;
	}
};
//  ************************************ temp mouseclick
// function handleMouseClick(evt) {
// 	if(showingWinScreen || firstGame) {
// 		player1Score = 0;
// 		player2Score = 0;
// 		showingWinScreen = false;
// 		firstGame = false;
// 	}
// };

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30
	setInterval(function(){
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond)

	canvas.addEventListener('mousedown', handleMouseClick);

	//Control left paddle with mouse
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
			console.log(paddle1Y);
			// paddle2Y = mousePos.y-(PADDLE_HEIGHT/2);
		});
};

function ballReset(){
	//check if a player has won
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
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

function moveEverything() {
	if (showingWinScreen || firstGame) {
		return;
	}

	computerMovement();

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

function drawEverything() {
	//Canvas, blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');
	// console.log(canvasContext.font)

	if (showingWinScreen) {
		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText('Left Player Won!', 325, 200);
		} else if (player2Score >= WINNING_SCORE) {
			canvasContext.fillText('Right Player Won!', 325, 200);
		}
		canvasContext.fillText('Click to Continue...', 325, 500);
		return;
	}

	if (firstGame) {
		canvasContext.fillStyle = 'white';
		canvasContext.font = "50px sans-serif";
		canvasContext.fillText('PONG', 330, 310);
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

// ************************** END GAME  *************************************



// ************************** OPTION CONTROLS  *************************************

$form = $('form');

console.log($form);


$form.on('submit', function(evt) {
	evt.preventDefault();
	console.log('dude');
	firstGame = false;
});



























