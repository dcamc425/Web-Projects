//*******************************************************//

var ball, paddle, court, ballMover; 
var ballLeft = 0,ballTop = -50, paddleLeft = 1000;
var speed = 1;
var dx = dy = 5;

function initialize(){
	ball = document.getElementById('ball');
	paddle = document.getElementById('paddle');
	court = document.getElementById('court');
}

function startGame(){
	moveBall();
	detectCollisions();
	  
	if (ballLeft < 1050){
		//ball has not hit the right side of the court
		ballMover = setTimeout('startGame()', speed);
	}
	  
	if(ballLeft >= 1050){
		originalPosition();
		incrementScore();
	}
}
	
function originalPosition(){
	ballLeft = 0;
	ballTop = -50;
}
	
function incrementScore(){
	document.getElementById('message').innerHTML = 
	parseInt(document.getElementById('message').innerHTML)+1;
}
	
function resetCounter(){
	document.getElementById('message').innerHTML = "0";
}
	
function detectCollisions(){
	//Reflects the ball when it collides on the borders
	if (LRcollision())
		dx = -1 * dx;
	if (TBcollision())
		dy = -1 * dy;
}
                    
function TBcollision(){
	// check top and bottom boundaries
	if (ballTop < -50 || ballTop > 500)
		return true;
	return false;
}
      
function LRcollision(){
	// check if at left of playing area
	if (ballLeft < 0)
		return true;
	// check to see if ball collided with paddle on the right handside of court
	if ((ballLeft+ball.offsetWidth) > paddle.offsetLeft){
		if(((ballTop+ball.offsetHeight+100) > paddle.offsetTop) && ballTop < (paddle.offsetTop+paddle.offsetHeight-100))
			return true;
	}
	return false;
}
        
function moveBall(){
	ballLeft += dx;
	ballTop += dy;
	ball.style.left = ballLeft + "px";
	ball.style.top = ballTop + "px";
}
	       
function movePaddle(event){
	var y = event.clientY;
	var heightDiff = court.offsetHeight-paddle.offsetHeight;
	  
	if(y > heightDiff-15)
		y = heightDiff-15;
	  
	paddle.style.top = y + "px";
}
	
function setSpeed(num){
	var result;
	for(var i = 0; i< document.form.speed.length; i++){
		if(document.form.speed[i].checked){
			result = document.form.speed[i].value;
			break;
		}
	}
	  
	if(result == 0){
		dx = 5;
	}
	else if(result == 1){
		dx = 15;
	}
	else{
		dx = 30;
	}
}  
//*******************************************************//
