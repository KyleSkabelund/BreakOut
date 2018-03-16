var bricks = [];
var brickHeight = 20;
var brickWidth = 32.7;
var spacingx = 3;
var spacingy = 3;
var cols = 14;
var rows = 8;
var topBroken = false;
var paddleWidth = 100;
var ballSpeed = 1;
var offsetY = 100;
var green = "rgb(0, 151, 0)"
var blue = "rgb(0, 134, 202)"
var orange = "rgb(253, 177, 0)"
var yellow = "rgb(230, 230, 0)"


MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');

	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

	function clear() {
		context.clear();
	}

	function drawImage(center, size, rotation, image) {
		context.save();
		context.drawImage(
			image,
			300,
			300,
			10, 10);

		context.restore();
	}

	function Bricks(spec){
		var that = {};
		that.makeBricks = function(){
			if (bricks.length > 0) bricks = [];
			for (let col = 0; col < cols; col++) {
				bricks.push([]);
				for (let row = 0; row < rows; row++) {
					bricks[col].push({
						x: 0 ,
						y: 0,
						broke: false,
						width : 10,
						color:""
					});
					if(row == 0 || row == 1) bricks[col][row].color = green
					if(row == 2 || row == 3) bricks[col][row].color = blue;
					if(row == 4 || row == 5) bricks[col][row].color = orange;
					if(row == 6 || row == 7) bricks[col][row].color = yellow;
				}
			}
		};
		that.hasWon = function(){
			for (let col = 0; col < cols; col++) {
				for (let row = 0; row < rows; row++) {
					if(bricks[col][row].broke == false) return false;
				}
			}
			return true;
		}
		that.drawBrick = function(brick){
			
			if(brick.broke == false){
				context.save();
				context.fillStyle = brick.color;
				context.fillRect(brick.x,brick.y,brickWidth,brickHeight);
				context.restore();
			}
		};

		that.draw = function(){
			for(var i = 0; i < cols; ++i){
				for(var j = 0; j < rows; ++j){
					bricks[i][j].x = i*(brickWidth + spacingx);
					bricks[i][j].y = j*(brickHeight + spacingy)+offsetY;
					that.drawBrick(bricks[i][j]);
				}
			}
		};
		
		return that;
	}

	function Paddle(spec) {
		var that = {};

		that.moveLeft = function(elapsedTime) {
			if(spec.x > 0 )
				spec.x -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveRight = function(elapsedTime) {
			if(spec.x + spec.width < canvas.width)
				spec.x += spec.moveRate * (elapsedTime / 1000);
		};
		that.moveTo = function(center) {
			spec.x = x;
		};
		
		that.draw = function() {
				context.save();
				context.fillStyle = "rgb(0, 0, 0)";
				context.fillRect(spec.x,spec.y,spec.width,10);
				context.strokeStyle = yellow;
				context.strokeRect(spec.x,spec.y,spec.width,10);
				context.restore();
		};
		
		that.update = function(){
			if(topBroken)
			{
				spec.width = paddleWidth/2;
			}
			else spec.width = paddleWidth;
			
			that.x = spec.x;
			that.y = spec.y;
			that.width = spec.width;
		}
		

		return that;
	}
	function Ball(spec)
	{
		let that = {};
		
		that.move = function(elapsedTime){
			spec.x += spec.directionx;
			spec.y += spec.directiony;
			if (spec.x < 0 ){
				spec.x = 0;
				spec.directionx *= -1;
			}
			if(spec.x > canvas.width){
				spec.x = canvas.width;
				spec.directionx *= -1;
			}
			if(spec.y < 0){
				spec.y = 0;
				spec.directiony *= -1;
			}
			if(spec.y > canvas.height)
			{
				spec.y = canvas.height;
				lives--;
				topBroken = false;
				that.reset();
			}
			that.x = spec.x;
			that.y = spec.y;
			that.radius = spec.radius;
			that.directiony = spec.directiony;
			that.directionx = spec.directionx;
		};
		that.PaddleCollision = function(bx,px){
			var poc = bx-px;
			var loc = 1;

			if(spec.directionx > 0 && poc < 30){
				spec.directionx *= -loc ;
			}
			if(spec.directionx < 0 && poc < 30){
				spec.directionx *= loc ;
			}
			if(spec.directionx > 0 && poc > 70){
				spec.directionx *= loc ;
			}
			if(spec.directionx < 0 && poc > 70){
				spec.directionx *= -loc ;
			}

				spec.directiony *=-1;
		}
		that.BrickCollision = function(c,r,d){
			
			if(r == 0) topBroken = true;
			if(bricks[c][r].color == yellow){score +=1;}
			if(bricks[c][r].color == orange){score +=2;}
			if(bricks[c][r].color == blue){score +=3;}
			if(bricks[c][r].color == green){score +=5;}
			
			if(d == 'up'){
				spec.directiony *= -1;
			}
			if(d == 'down'){
				spec.directiony *= -1;
			}
			if(d == 'left'){
				spec.directionx *= -1;
			}
			if(d == 'right'){
				spec.directionx *= -1;
			}
			bricksBroke++;
			if(spec.directionx < 0){
				if(bricksBroke == 4) {  spec.directionx-=1; spec.directiony+=1; }
				if(bricksBroke == 12) { spec.directionx-=1; spec.directiony+=1; }
				if(bricksBroke == 36) { spec.directionx-=2; spec.directiony+=2; }
				if(bricksBroke == 62) { spec.directionx-=2; spec.directiony+=2; }

			}
			else if(spec.directionx > 0){
				if(bricksBroke == 4) {  spec.directionx+=1; spec.directiony+=1; }
				if(bricksBroke == 12) { spec.directionx+=1; spec.directiony+=1; }
				if(bricksBroke == 36) { spec.directionx+=2; spec.directiony+=2; }
				if(bricksBroke == 62) { spec.directionx+=2; spec.directiony+=2; }

			}
			bricks[c][r].broke = true;
		}
		that.start = function(){
			if(spec.directionx == 0 && spec.directiony == 0){
				spec.directionx =-5;
				spec.directiony =-5;
			}
		}
		that.reset = function(game){
			top.topBroken = false;
			spec.x = 250;
			spec.y = 570;
			spec.directionx = 0;
			spec.directiony = 0;
		}
		that.draw = function(){
			context.save();
			context.fillStyle = "rgb(255,255,255)";
			context.beginPath();
			context.arc(spec.x,spec.y,spec.radius,0,2*3.1415926);
			context.fill();
			context.restore();
		};
		return that;
	}

	function ParticleSystem(spec) {
		let that = {};
		let particles = [];
		let image = new Image();
		image.onload = function () {
			that.render = function() {
				for (let particle = 0; particle < particles.length; particle++) {
					if (particles[particle].alive >= 100) {
						drawImage(
							particles[particle].position,
							particles[particle].size,
							particles[particle].rotation,
							image);
					}
				}
			};	
		};
		image.src = spec.image;
	
		that.update = function(elapsedTime) {
			let keepMe = [];
	
			for (let particle = 0; particle < particles.length; particle++) {
				particles[particle].alive += elapsedTime;
				particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);
				particles[particle].rotation += particles[particle].speed / .5;
	
				if (particles[particle].alive <= particles[particle].lifetime) {
					keepMe.push(particles[particle]);
				}
			}
	
			for (let particle = 0; particle < 25; particle++) {
				let p = {
					position: { x: spec.position.x, y: spec.position.y },
					direction: 10,
					speed: 10,	// pixels per millisecond
					rotation: 0,
					lifetime: 1000,	// milliseconds
					alive: 200,
					size: 1000,
					fill: spec.fill,
					stroke: 'rgb(0, 0, 0)'
				};
				keepMe.push(p);
			}
			particles = keepMe;
		};
	
		that.render = function() {};
	
		return that;
	}
	
	return {
		clear : clear,
		Paddle : Paddle,
		Ball : Ball,
		Bricks : Bricks,
		ParticleSystem : ParticleSystem
	};
}(MyGame.game));
