document.body.style.overflow="hidden"; //스크롤바 제거
var canvasWidth = 850; // 캔버스 폭
var canvasHeight = 800; // 캔버스 높이
window.onresize = function(event){//창 크기 변경하면 작동하는 함수, 작동안됨
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
}
document.getElementById("myCanvas").width = canvasWidth;
document.getElementById("myCanvas").height = canvasHeight;
var canvas = document.getElementById("myCanvas"); //캔버스
var ctx = canvas.getContext("2d"); //캔버스컨텍트

//캔버스 기준으로 좌표설정됨.
var ballRadius = 1 / 32 * canvas.height;
var x = canvas.width / 2;
var y = 15 / 16 * canvas.height;
var vel = 20;
var dx = 0;
var dy = vel;
var paddleHeight = 1 / 32 * canvas.height;
var paddleWidth = 10 / 32 * canvas.width;
var paddleX = (canvas.width-paddleWidth) / 2;
var brickWidth = 5 / 32 * canvas.width;
var brickHeight = 1 / 16 * canvas.height;
var brickUDPadding = 1 / 48 * canvas.height;
var brickRLPadding = 1 / 32 * canvas.width;
var brickOffsetTop = 3 / 32 * canvas.height;
var brickOffsetLeft = 1 / 16 * canvas.width;
var rightPressed = false; //오른쪽 방향키
var leftPressed = false; //왼쪽 방향키
var brickRowCount = 5; //벽돌 열개수
var brickColumnCount = 2; //벽돌 행개수
var score = 0; //점수
var lives = 3; //목숨
var stage = 1; //난이도
var winscore = 0; //승리점수
var breeding_level = 0; // 번식 횟수
var start_time; // start 버튼을 누른 시간
var time_limit = 100; //타임 리미트
var play_time = -1; // 남은 게임 시간

// bgm
var audio_breeding = new Audio("breeding_bgm.mp3"); // 번식 이펙트 -> 번식 5초전에 경고.

// 타이머
function Timer() {
  var now = new Date();
  var interval = start_time - now.getTime();
  play_time = parseFloat((interval / 1000) + time_limit);
  document.getElementById("timer").innerText = play_time.toFixed(3);
  document.getElementById("progress").value = play_time.toFixed(3);
}

// 셔플
function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

// 난이도에 따른 벽돌 체력 설정
var s_index = 0;
var bricks = []; //벽돌 배열
var shuffle_list = [];
if(stage == 1) shuffle_list = [3,3,3,3,3,3,3,1,1,1];
else if(stage == 2) shuffle_list = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2];
else {} //보스 스테이지
shuffle_list = shuffle(shuffle_list);

for(var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for(var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: shuffle_list[s_index++] }; //status는 벽돌목숨
    winscore += bricks[c][r].status;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//키를 누르고 있을 때 작동
function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

//키를 뗐을 때 작동
function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

//마우스를 움직일 때 작동
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

//공이 벽돌에 닿을 때 작동
function collisionDetection() {
  for(var c = 0; c < brickColumnCount; c++) {
    for(var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status > 0) {
        if(collision(x, y, ballRadius, bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight)){
          b.status--; //벽돌 목숨 감소
          score++; //점수 증가
          if(score == winscore) { //벽돌이 다 부서지면
            alert("YOU WIN, CONGRATS!");
            // stage++;
            document.location.reload();
          }
        }

      }
    }
  }
}

function collision(x, y, r, bx, by, bw, bh) {
  if(x + r > bx && x - r < bx + bw && y + r > by && y - r < by + bh) {
    if(x > bx && x < bx + bw){
      dy *= -1;
      return true;
    } else if(y > by && y < by + bh){
      dx *= -1;
      return true;
    }
  } else if(distance(x, y, bx, by) <= r+2){
    var temp = dx;
    dx = dy * (-1);
    dy = temp * (-1);
    return true;
  } else if(distance(x, y, bx + bw, by) <= r+2){
    var temp = dx;
    dx = dy;
    dy = temp;
    return true;
  } else if(distance(x, y, bx, by + bh) <= r+2){
    var temp = dx;
    dx = dy;
    dy = temp;
    return true;
  } else if(distance(x, y, bx + bw, by + bh) <= r+2){
    var temp = dx;
    dx = dy * (-1);
    dy = temp * (-1);
    return true;
  }
  return false;
}

function distance(x, y, a, b){
  return Math.sqrt((x - a) * (x - a) + (y - b) * (y - b));
}

//공 그리기
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

//패들 그리기
function drawPaddle() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, canvas.height-paddleHeight, canvas.width, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fillRect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
}

// 번식
function breeding() {
  breeding_level++;
  // 이펙트 및 효과음 주기. 번식 횟수마다 다르게 하려면 breeding level 활용하기
  // 추후 논의

  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 0) {
        var breeding_status;
        var random_status = Math.floor(Math.random() * 10); // 0~9
        if (random_status == 0 || random_status >= 7) breeding_status = 0;
        else if (random_status >= 5) breeding_status = 3;
        else if (random_status >= 3) breeding_status = 2;
        else breeding_status = 1;
        bricks[c][r].status = breeding_status;
        winscore += bricks[c][r].status;
      }
    }
  }
}

//벽돌 그리기
function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status > 0) {
        var brickX = (r*(brickWidth+brickRLPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickUDPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        if(bricks[c][r].status == 3)
          ctx.fillStyle = "red";
        else if(bricks[c][r].status == 2)
          ctx.fillStyle = "orange";
        else if(bricks[c][r].status == 1)
          ctx.fillStyle = "yellow";
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

//점수 그리기
function drawScore() {
  var str = score+"point";
  document.getElementById("score_div").innerText = str;
}

//목숨 그리기
function drawLives() {
  var str = "<img src='heart.png'>"+" "+lives
  document.getElementById("lives_div").innerHTML = str;
}

//타이머 이미지 그리기
function drawTimerImg(){
  var str = "<img src='timer.png' />";
  document.getElementById("timer_img_div").innerHTML = str;
}

//번식 이미지 그리기
function drawBreedingImg(){
  var str = "<img src='timeVirus.png' />";
  if(play_time>=75) document.getElementById("breeding_img1").innerHTML = str;
  else document.getElementById("breeding_img1").innerHTML = "";
  if(play_time>=50) document.getElementById("breeding_img2").innerHTML = str;
  else document.getElementById("breeding_img2").innerHTML = "";
  if(play_time>=25) document.getElementById("breeding_img3").innerHTML = str;
  else document.getElementById("breeding_img3").innerHTML = "";
}

// 프로그레스 바 그리기
function drawProgressBar(){
  var obj = document.getElementById("progress_div");
  obj.innerHTML="<progress id='progress' value='100' min='0' max='100'></progress>";
}

//main
function draw() {
  drawProgressBar();
  Timer(); 

  // 게임시간이 0 이되면 게임종료.
  if(play_time<0){ 
    alert("GAME OVER");
    document.location.reload();
    return;
  }

  // breeding bgm, breeding 5초 전에 play
  if(Math.floor(play_time) == 80 || Math.floor(play_time) == 55 || Math.floor(play_time) == 30 || Math.floor(play_time) == 5){
    audio_breeding.play();
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawTimerImg()
  drawBreedingImg();
  collisionDetection();
  
  //캔버스 좌우에 공이 닿을 때
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //캔버스 위에 공이 닿을 때
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius - paddleHeight) {// 캔버스 아래에 공이 닿을 때
    if(x > paddleX && x < paddleX + paddleWidth) {// 패들위치라면
      var signX;
      var m;
      var n;
      var angle;
      if(x < paddleX + paddleWidth / 2){
        signX = -1;
        m = x - paddleX;
        n = paddleX + paddleWidth / 2 - x;
      } else if(x > paddleX + paddleWidth / 2){
        signX = 1;
        m = paddleX + paddleWidth - x;
        n = paddleX + paddleWidth / 2 + x;
      }else{
        signX = 0;
        m = 89;
        n = -1;
      }
      angle = 90 * m / (m + n) * 70 / 90 + 10;
      dx = Math.cos(angle * Math.PI / 180) * signX * vel;
      dy = -Math.sin(angle * Math.PI / 180) * vel;
    }
    else {
      lives--;
      if(!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-100;
        dx = 0;
        dy = vel;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

//setting
function setting() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Setting", canvas.width * 2 / 5 - 10, canvas.height / 4);

}

var cx = -1;
var cy = -1;
//menu
function menu() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "40px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Destoy", canvas.width * 2 / 5 - 10, canvas.height / 4);
  ctx.fillText("Jquerina", canvas.width * 2 / 5 - 25, canvas.height / 4 + 40);

  ctx.fillStyle = "#0095DD";
  ctx.fillRect(canvas.width * 3 / 8, canvas.height * 3 / 7, canvas.width / 4, canvas.height / 7);
  ctx.fillRect(canvas.width * 3 / 8, canvas.height * 5 / 7, canvas.width / 4, canvas.height / 7);
  ctx.fillRect(0, 0, canvas.width / 6, canvas.height / 7);

  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Start", canvas.width * 4 / 9, canvas.height * 4 / 7 - 20);
  ctx.fillText("Setting", canvas.width * 4 / 9, canvas.height * 6 / 7 - 20);

  canvas.onMouseOver = function(event){// 커서변경, 작동안됨
    var x = event.clientX;
    var y = event.clientY;
    if (x >= canvas.width * 3 / 8 && x <= canvas.width * 5 / 8){
      if(y >= canvas.height * 3 / 7 && y <= canvas.width * 4 / 7)
        canvas.cursor = "pointer";
    }
  }
  canvas.onclick = function(event){// start클릭
    cx = event.clientX;
    cy = event.clientY;
    if (cx >= 0 && cx <= canvas.width / 6){
      if (cy >= 0 && cy <= canvas.height / 7){
        window.resizeTo(window.screen.availWidth / 2, window.screen.availWHeight / 2);
      }
    } else if (cx >= canvas.width * 3 / 8 && cx <= canvas.width * 5 / 8){
      if (cy >= canvas.height * 3 / 7 && cy <= canvas.width * 4 / 7){
        // 스테이지 바뀔 떄
        start_time = new Date().getTime();
        setInterval(breeding, 25000);  //번식 타이머 작동
        draw();
      }
        
        
      else if(cy >= canvas.height * 5 / 7 && cy <= canvas.width * 6 / 7)
        setting();
    }
  }
}

menu();