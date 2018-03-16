var r = false;
var i = 4;
var c = document.getElementById("countdown");
var l = document.getElementById("lives");
var time = document.getElementById("time");
var scoreText = document.getElementById("score");
var totaltime = 0;
var minutes = 0;
var seconds = 0;
var score = 0;
var lives = 3;
var ballSpeed = 4;
var bricksBroke = 0;

function ready(){
	if(i < 0)
	{
		r = true;
		c.style.display = "none";
	}	
	else{
		c.innerText = i;
		i--;
		setTimeout(ready,1000)
	}
};


MyGame.screens['game-play'] = (function(game, graphics, input) {
	'use strict';
	
	var mouseCapture = false,
		myMouse = input.Mouse(),
		myKeyboard = input.Keyboard(),
		myPaddle = null,
		myBall = null,
		cancelNextRequest = false,
		lastTimeStamp,
		myBricks = [],
		Bricks = [];

	var ps1 = graphics.ParticleSystem({
		position: { x: 300, y: 300},
		speed: { mean: 0.07, stdev: 0.025},
		lifetime: { mean: 2000, stdev: 1000 },
		size: { mean: 5, stdev: 2 },
		fill: 'rgba(0, 0, 255, 0.5)',
		image: 'images/USU-Logo.png'
	});
	
	function initialize() {
		console.log('game initializing...');
		
		myPaddle = graphics.Paddle( {
			x: 200,
			y: 585,
			width: 100,
			moveRate :  600,			
		});

		myBall = graphics.Ball({
			x:250,
			y:475,
			radius: 10,
			directionx: ballSpeed,
			directiony:-ballSpeed
		});
		
		myBricks = graphics.Bricks();
		myBricks.makeBricks();

		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myPaddle.moveLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myPaddle.moveRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			cancelNextRequest = true;
			game.showScreen('main-menu');
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE,myBall.start)
		
	}
	function formatTime(tt){
		seconds = parseInt(tt/1000);
		minutes = parseInt(seconds/60);
		if(minutes > 0){
			if(seconds&60 < 10) return minutes + ":0" + seconds%60;
			return minutes + ":" + seconds%60;
		} 
		if(seconds < 10) return "0" + seconds%60;
		return seconds;
	}
	function update(elapsedTime) {
		if(lives == 0 ){
			reset();
			
		}
		if(myBricks.hasWon()){
			cancelNextRequest = true;
			game.showScreen('game-won');

			reset();
		}
		let t  = formatTime(totaltime)
		myKeyboard.update(elapsedTime);
		myMouse.update(elapsedTime);
		myPaddle.update();
		detectCollisions();
		l.innerText = "Lives:" +lives;
		scoreText.innerText = "Score:" + score;
		time.innerText = "Time:" +t;
		totaltime+=elapsedTime;

	}
	function detectCollisions(){
		if(myBall.x >= myPaddle.x && myBall.x <= myPaddle.x+myPaddle.width && myBall.y+myBall.radius >= myPaddle.y){
			myBall.PaddleCollision(myBall.x,myPaddle.x);
		}
		for(var c = 0; c < cols; ++c){
			for(var r = 0; r < rows; ++r)
			{
				if(bricks[c][r].broke == false)
				{
					
					if(myBall.directiony < 0 && bricks[c][r]){//up
						if(myBall.y-myBall.radius < bricks[c][r].y + brickHeight && myBall.y-myBall.radius > bricks[c][r].y && myBall.x > bricks[c][r].x && myBall.x < bricks[c][r].x +brickWidth){
							myBall.BrickCollision(c,r,"up");
							continue;
						}
					}	
					if(myBall.directiony > 0 && bricks[c][r]){//down
						if(myBall.y+myBall.radius >= bricks[c][r].y && myBall.y+myBall.radius < bricks[c][r].y + brickHeight && myBall.x > bricks[c][r].x && myBall.x < bricks[c][r].x +brickWidth){
							myBall.BrickCollision(c,r,"down");
							continue;
						}
					}
					if(myBall.directionx > 0){
						if(myBall.x + myBall.radius >= bricks[c][r].x && myBall.x +myBall.radius <= bricks[c][r].x +brickWidth &&  myBall.y > bricks[c][r].y && myBall.y < bricks[c][r].y + brickHeight){
							myBall.BrickCollision(c,r,"right");
							continue;
						}
					}
					if(myBall.directionx < 0){
						if(myBall.x - myBall.radius <= bricks[c][r].x + brickWidth && myBall.x-myBall.radius >= bricks[c][r].x && myBall.y > bricks[c][r].y && myBall.y < bricks[c][r].y + brickHeight){
							myBall.BrickCollision(c,r,"left");
							continue;
						}
					}
					
				}
			}
		}
	}
	function render() {
			graphics.clear();
			myBall.move();
			myPaddle.draw();
			myBall.draw();
			myBricks.draw();
			ps1.render();
	}
	
	function gameLoop(time) {
		if(r){
			let elapsedTime = time - lastTimeStamp 
			update(elapsedTime);
			lastTimeStamp = time;
			render();
		}
		else totaltime = -5000;
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		ready();
		
		requestAnimationFrame(gameLoop);
	}
	function reset(){
		let name = prompt("You got a score of " + score + ". Enter your name to save");
		if(name != "") localStorage.setItem(name,score);
		cancelNextRequest = true;
		lives = 3;
		totaltime = 0;
		score =0;
		if(!myBricks.hasWon()){
			game.showScreen("game-over");
		}
		myBricks.makeBricks();
	}
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game, MyGame.graphics, MyGame.input));
