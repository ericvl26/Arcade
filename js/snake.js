// **************************  GAME  *************************************

var canv;
var ctx;

var posX = 10;
var posY = 10;
var gridSize = 20;
var tileCount = 35;
var appleX = 15;
var appleY = 15;
var velX = 1;
var velY = 0;
var trail=[];
var tail = 5;
var playerScore = 0;
var highScore = 0;
var wallType;

var endRound = false;
var firstGame = true;

function handleMouseClick(evt) {
	if(endRound) {
		playerScore = 0;
		trail=[];
		endRound = false;;
		//Generate new random apple
		appleX=Math.floor(Math.random()*tileCount);
		appleY=Math.floor(Math.random()*tileCount);
	}
};

window.onload=function() {
	canv=document.getElementById("gameCanvas");
	ctx=canv.getContext("2d");
	document.addEventListener("keydown",keyPush);
	setInterval(game,1000/15);

	//Mouseclick to start new round
	canv.addEventListener('mousedown', handleMouseClick);
}



function game() {

	//Draw black background canvas
	ctx.fillStyle="black";
	ctx.fillRect(0,0,canv.width,canv.height);

	if (firstGame) {
		ctx.fillStyle = 'white';
		ctx.font = "50px sans-serif";
		ctx.fillText('SNAKE', 265, 355);
		return;
	}

	if (endRound) {
		ctx.fillStyle = 'white';
		// if(player1Score >= WINNING_SCORE) {
		// 	ctx.fillText('Player 1 Won The Round!', 290, 200);
		// } else if (player2Score >= WINNING_SCORE) {
		// 	ctx.fillText('Player 2 Won The Round!', 290, 200);
		// }
		ctx.font = "25px sans-serif";
		ctx.fillText('Score: '+playerScore, 230, 315);
		ctx.fillText('Click To Play Again...', 230, 355);
		return;
	}

	posX+=velX;
	posY+=velY;

	if (wallType == 'wrap') {
		//Wrap snake at walls
		if(posX<0) {
			posX= tileCount-1;
		}
		if(posX>tileCount-1) {
			posX= 0;
		}
		if(posY<0) {
			posY= tileCount-1;
		}
		if(posY>tileCount-1) {
			posY= 0;
		}	
	} else if (wallType == 'wall') {
		//End round if snake hits the wall
		if(posX<0 || posX>tileCount-1 || posY<0 || posY>tileCount-1) {
			tail = 5;
			endRound = true;
			posX = 15;
			posY = 15;
			if (playerScore > highScore) {
				highScore = playerScore;
				$('#highScore').text(highScore);
			}
		}
	}

	//Draw snake
	ctx.fillStyle="lime";
	for(var i=0;i<trail.length;i++) {
		ctx.fillRect(trail[i].x*gridSize,trail[i].y*gridSize,gridSize-2,gridSize-2);
		//Reset tail if snake hits tail
		if(trail[i].x==posX && trail[i].y==posY) {
			tail = 5;
			endRound = true;
			if (playerScore > highScore) {
				highScore = playerScore;
				$('#highScore').text(highScore);

			}
		}
	}
	trail.push({x:posX,y:posY});
	while(trail.length>tail) {
	trail.shift();
	}

	// if snake hits the apple
	if(appleX==posX && appleY==posY) {
		tail++;
		playerScore++;
		//Generate new random apple
		appleX=Math.floor(Math.random()*tileCount);
		appleY=Math.floor(Math.random()*tileCount);
	}
	ctx.fillStyle="red";
	// ctx.fillRect(appleX*gridSize,appleY*gridSize,gridSize-2,gridSize-2);
	ctx.beginPath();
	ctx.arc(appleX*gridSize+8, appleY*gridSize+8, 10, 0, Math.PI*2, true);
	ctx.fill();

	// draw player score
	ctx.font = "20px sans-serif";
	ctx.fillStyle = 'white';
	ctx.fillText(playerScore, 100, 100);
}

function keyPush(evt) {
	// console.log(evt.keyCode)
	switch(evt.keyCode) {
		case 72:       // h key, move left
			velX=-1;velY=0;
			break;
		case 85:  		// u key, move up
			velX=0;velY=-1;
			break;
		case 75: 		//k key, move right
			velX=1;velY=0;
			break;
		case 74: 		//j key, move down
			velX=0;velY=1;
			break;
	}
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
	posX = 10;
	posY = 10;
	//Generate new random apple
	appleX=Math.floor(Math.random()*tileCount);
	appleY=Math.floor(Math.random()*tileCount);
	velX = 1;
	velY = 0;
	trail=[];
	tail = 5;
	playerScore = 0;
	highScore = 0;
	$('#highScore').text(highScore);

	endRound = false;
	firstGame = true;
});

//Form Submit to start game 
$form.on('submit', function(evt) {
	evt.preventDefault();

	wallType = $('input[name="wallType"]:checked').val();
	// console.log(wallType);

	firstGame = false;
	$form.hide();
	$resetButton.show();
});









