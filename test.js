var character; // 선택된 캐릭터 종류. brave, smart, bully.
var paddle; // 선택된 패들 종류. green, pink, blue.
var stage = 1; // 스테이지 단계. 1,2,3.
var bgm; // 배경음악 종류. 1,2,3.
var start_time; // start 버튼을 누른 시간
var time_limit = 100; //타임 리미트
var play_time = -1; // 남은 게임 시간

$(document).ready(function () {
  $("#scene1").show();

  // title 색 변경 함수
  var titleColorIndex = 0;
  setInterval(function () {
    var color_arr = ["#FF0404", "#FFE604", "#FF04E6", "#00FF66"];
    if (titleColorIndex > color_arr.length) {
      titleColorIndex = 0;
    }
    $(".title").css("color", color_arr[titleColorIndex++]);
  }, 300);

  // 마지막 장면 폭죽 관련 함수
  var particles = [];
  const colors = ["#eb6383", "#fa9191", "#ffe9c5", "#b4f2e1"];
  function makeParticle() {
    for (var i = 0; i < 150; i++) {
      const p = document.createElement("particle");
      p.x = window.innerWidth * 0.5;
      p.y = window.innerHeight + Math.random() * window.innerHeight * 0.3;
      p.vel = {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * -30,
      };
      p.mass = Math.random() * 0.2 + 0.8;
      particles.push(p);
      p.style.transform = `translate(${p.x}px, ${p.y}px)`;
      const size = Math.random() * 15 + 5;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(p);
    }
  }
  function render() {
    for (var i = particles.length - 1; i--; i > -1) {
      const p = particles[i];
      p.style.transform = `translate3d(${p.x}px, ${p.y}px, 1px)`;

      p.x += p.vel.x;
      p.y += p.vel.y;

      p.vel.y += 0.5 * p.mass;
      if (p.y > window.innerHeight * 2) {
        p.remove();
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(render);
  }

  // scene 변경
  $("#scene1Btn1").click(function () {
    $("#scene1").hide();
    $("#scene2").show();
  });
  $("#scene1Btn2").click(function () {
    $("#scene1").hide();
    $("#settingScene").show();
  });
  $("#settingSaveBtn").click(function () {
    $("#settingScene").hide();
    $("#scene1").show();
    bgm = parseInt($("input[name=bgm]:checked").val());
  });
  $("#scene2Btn1").click(function () {
    $("#scene2").hide();
    $("#scene3").show();
  });
  $("#scene3Btn1").click(function () {
    $("#scene3").hide();
    $("#scene4").show();
  });
  $("#scene4Btn1").click(function () {
    $("#scene4").hide();
    $("#scene5").show();
    character = $("input[name=character]:checked").val();
  });
  $("#scene5Btn1").click(function () {
    $("#scene5").hide();
    $("#scene6").show();
    paddle = $("input[name=paddle]:checked").val();
  });
  // scene6에서 대사 변경 후 scene7로 이동
  var activeScene7 = false;
  $("#scene6Btn1").click(function () {
    if (activeScene7) {
      $("#scene6").hide();
      $("#scene7").show();
    }
    activeScene7 = true;
    $("#scene6 .speach").html(
      "심장에 가장 가까운 바이러스를 없애면 그 외의 모든 바이러스가 사라져 빨리<br>돌아올 수 있지만, 그만큼 강하니 조심하게나.<br>그럼 행운을 빌지..!"
    );
  });
  // stage 선택 시 시작 버튼 활성화
  $("input[name=stage]").change(function () {
    $("#startBtn").removeClass("disableStartBtn");
  });
  $("#startBtn").click(function () {
    // 선택한 stage로 이동
    // stage에 맞는 게임을 실행시켜주시면 됩니다. 임시로 마지막 장면이랑 연결시켰습니다.
    if ($("input[name=stage]").is(":checked")) {
      stage = parseInt($("input[name=stage]:checked").val());
      $("#scene7").hide();
      //목으로 가는 이미지
      if(stage==1){
        $("#rect1").show();
      }

      //폐로 가는 이미지
      if(stage==2){
        $("#rect2").show();
      }

      //심장으로 가는 이미지
      if(stage==3){
        $("#rect3").show();
      }

      // $("#lastScene").show();

      // 이 아래는 마지막 장면에서만 사용되는 코드입니다.
      //makeParticle();
      //window.setTimeout(render, 200);
      //$("#lastScene .titleBox").css("cursor", "pointer");
      //$("#lastScene .titleBox").click(makeParticle);
      // 마지막 장면에서 welcome!을 클릭하면 커서 모양이 변하고 폭죽이 다시 터집니다.
    }
  });

  //폐로가는 애니메이트
  $("#box1").click(function(){
    $("#box1").text("")
    $("#box1").animate({height:40, width:40, top:168, left:250})
    $("#oval1").fadeIn('slow');
    $("#rect1").fadeOut(2000);
    start_time = new Date().getTime();
    $('#myCanvas').show();
    $("#info").fadeIn(2000);
    setTimeout(draw, 2000);
  })

  $("#box2").click(function(){
    $("#box2").text("")
    $("#box2").animate({height:40, width:40, top:290, left:213})
    $("#oval2").fadeIn('slow');
    $("#rect2").fadeOut(2000);
    start_time = new Date().getTime();
    $('#myCanvas').fadeIn(2000);
    $("#info").fadeIn(2000);
    setTimeout(draw, 2000);
  })

  $("#box3").click(function(){
    $("#box3").text("")
    $("#box3").animate({height:40, width:40, top:322, left:268})
    $("#oval3").fadeIn('slow');
    $("#rect3").fadeOut(2000);
    start_time = new Date().getTime();
    $('#myCanvas').fadeIn(2000);
    $("#info").fadeIn(2000);
    setTimeout(draw, 2000);
  })

  function canvasOn(){
    document.getElementById("container").style.display = "none";
    document.getElementById("info").style.display = "block";
    document.getElementById("myCanvas").style.display = "block";
  }
  function containerOn(){
    document.getElementById("container").style.display = "flex";
    document.getElementById("info").style.display = "none";
    document.getElementById("myCanvas").style.display = "none";
  }
  // 여기서부터 준원님 코드입니다
  document.body.style.overflow = "hidden"; //스크롤바 제거
  var canvasWidth = 850; // 캔버스 폭
  var canvasHeight = 740; // 캔버스 높이
  //window.onresize = function (event) {
    //창 크기 변경하면 작동하는 함수, 작동안됨
  //  canvasWidth = window.innerWidth;
  //  canvasHeight = window.innerHeight;
  //};
  document.getElementById("myCanvas").width = canvasWidth;
  document.getElementById("myCanvas").height = canvasHeight;
  var canvas = document.getElementById("myCanvas"); //캔버스
  var ctx = canvas.getContext("2d"); //캔버스컨텍트

  //캔버스 기준으로 좌표설정됨.
  var ballRadius = (1 / 32) * canvas.height;
  var x = canvas.width / 2;
  var y = (15 / 16) * canvas.height;
  var vel = 20;
  var dx = 0;
  var dy = vel;
  var paddleHeight = (1 / 32) * canvas.height;
  var paddleWidth = (10 / 32) * canvas.width;
  var paddleX = (canvas.width - paddleWidth) / 2;
  var brickWidth = (5 / 32) * canvas.width;
  var brickHeight = (1 / 16) * canvas.height;
  var brickUDPadding = (1 / 48) * canvas.height;
  var brickRLPadding = (1 / 32) * canvas.width;
  var brickOffsetTop = (3 / 32) * canvas.height;
  var brickOffsetLeft = (1 / 16) * canvas.width;
  var rightPressed = false; //오른쪽 방향키
  var leftPressed = false; //왼쪽 방향키
  var brickRowCount = 5; //벽돌 열개수
  var brickColumnCount = 2; //벽돌 행개수
  var score = 0; //점수
  var lives = 3; //목숨
  var winscore = 10; //승리점수
  var breeding_level = 0; // 번식 횟수
  var bosslives = 10; //보스 체력
  var bdx = 5; //보스 속도
  var bossX = canvas.width / 2 - 80; //보스 x좌표
  var bossY = 50; //보스 y좌표
  var bossWidth = 160; //보스 가로길이
  var bossHeight = 147; //보스 세로길이

  // bgm
  var audio_breeding = new Audio("breeding_bgm.mp3"); // 번식 이펙트 -> 번식 5초전에 경고.

  // 타이머
  function Timer() {
    var now = new Date();
    var interval = start_time - now.getTime();
    play_time = parseFloat(interval / 1000 + time_limit);
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
  if (stage == 1) shuffle_list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  else if (stage == 2) shuffle_list = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2];
  else {
  } //보스 스테이지
  shuffle_list = shuffle(shuffle_list);

  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: shuffle_list[s_index++] }; //status는 벽돌목숨
      winscore += bricks[c][r].status;
    }
  }
  if(stage == 3)
    winscore = 10;

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  //키를 누르고 있을 때 작동
  function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  }

  //키를 뗐을 때 작동
  function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }

  //마우스를 움직일 때 작동
  function mouseMoveHandler(e) {
    var relativeX = e.clientX;
    if (relativeX > window.innerWidth / 2 - canvas.width / 2 && relativeX < window.innerWidth / 2 + canvas.width / 2) {
      paddleX = relativeX - paddleWidth * 3 / 2;
    }
  }

  //공이 벽돌에 닿을 때 작동
  function collisionDetection() {
    if(stage != 3){
      for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
          var b = bricks[c][r];
          if(b.status > 0) {
            if(collision(x, y, ballRadius, bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight)){
              b.status--; //벽돌 목숨 감소
              score++; //점수 증가
              if(score == winscore) { //벽돌이 다 부서지면
                alert("YOU WIN, CONGRATS!");
                document.location.reload();
              }
            }
          }
        }
      }
    }else{
      if(bosslives > 0){
        if(collision(x, y, ballRadius, bossX, bossY, bossWidth, bossHeight)){
          bosslives--;
          score++;
          if(score == 10){
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }

  //충돌 여부
  function collision(x, y, r, bx, by, bw, bh) {
    if(x > bx && x < bx + bw && y > by - r && y < by + bh + r){
      dy *= -1;
      return true;
    } else if(y > by && y < by + bh && x > bx - r && x < bx + bw + r){
      if(bdx * dx < 0)
        bdx *= -1;
      dx *= -1;
      return true;
    } else if(distance(x, y, bx, by) <= r){
      if(bdx * dx < 0)
        bdx *= -1;
      var temp = dx;
      dx = dy * (-1);
      dy = temp * (-1);
      return true;
    } else if(distance(x, y, bx + bw, by) <= r){
      if(bdx * dx < 0)
        bdx *= -1;
      var temp = dx;
      dx = dy;
      dy = temp;
      return true;
    } else if(distance(x, y, bx, by + bh) <= r){
      if(bdx * dx < 0)
        bdx *= -1;
      var temp = dx;
      dx = dy;
      dy = temp;
      return true;
    } else if(distance(x, y, bx + bw, by + bh) <= r){
      if(bdx * dx < 0)
        bdx *= -1;
      var temp = dx;
      dx = dy * (-1);
      dy = temp * (-1);
      return true;
    }
    return false;
  }

  function distance(x, y, a, b) {
    return Math.sqrt((x - a) * (x - a) + (y - b) * (y - b));
  }

  //공 그리기
  function drawBall() {
    var ballimg = new Image();
    if(character == "brave")
      ballimg.src = "images/ball1.png";
    else if(character == "smart")
      ballimg.src = "images/ball2.png";
    else if(character == "bully")
      ballimg.src = "images/ball3.png";
    ctx.drawImage(
      ballimg,
      x - ballRadius,
      y - ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
    //ctx.beginPath();
    //ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    //ctx.fillStyle = "red";
    //ctx.fill();
    //ctx.closePath();
  }

  //패들 그리기
  function drawPaddle() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, canvas.height - paddleHeight, canvas.width, paddleHeight);
    var paddletype = new Image();
    if(paddle == "green")
      paddletype.src = "images/paddle1.png";
    else if(paddle == "pink")
      paddletype.src = "images/paddle2.png";
    else if(paddle == "blue")
      paddletype.src = "images/paddle3.png";
    ctx.drawImage(
      paddletype,
      paddleX,
      canvas.height - paddleHeight,
      paddleWidth,
      paddleHeight
    );
    //ctx.fillStyle = "#0095DD";
    //ctx.fillRect(
    //  paddleX,
    //  canvas.height - paddleHeight,
    //  paddleWidth,
    //  paddleHeight
    //);
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
    var virus1 = new Image();
    virus1.src = "images/virus1.png";
    var virus2 = new Image();
    virus2.src = "images/virus2.png";
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status > 0) {
          var brickX = r * (brickWidth + brickRLPadding) + brickOffsetLeft;
          var brickY = c * (brickHeight + brickUDPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          if (bricks[c][r].status == 1) ctx.drawImage(virus1, brickX, brickY, brickWidth, brickHeight);
          else if (bricks[c][r].status == 2) ctx.drawImage(virus2, brickX, brickY, brickWidth, brickHeight);
        }
      }
    }
  }


  //보스 그리기
  function drawBoss(){
    var boss = new Image();
    boss.src = "images/boss.png";
    if (bosslives > 0)
      ctx.drawImage(boss, bossX, bossY, bossWidth, bossHeight);
  }

  //점수 그리기
  function drawScore() {
    var str = score + "point";
    document.getElementById("score_div").innerText = str;
  }

  //목숨 그리기
  function drawLives() {
    var str = "<img src='images/heart.png'>" + " " + lives;
    document.getElementById("lives_div").innerHTML = str;
  }

  //타이머 이미지 그리기
  function drawTimerImg() {
    var str = "<img src='images/timer.png' />";
    document.getElementById("timer_img_div").innerHTML = str;
  }

  //번식 이미지 그리기
  function drawBreedingImg() {
    var str = "<img src='images/timeVirus.png' />";
    if (play_time >= 75)
      document.getElementById("breeding_img1").innerHTML = str;
    else document.getElementById("breeding_img1").innerHTML = "";
    if (play_time >= 50)
      document.getElementById("breeding_img2").innerHTML = str;
    else document.getElementById("breeding_img2").innerHTML = "";
    if (play_time >= 25)
      document.getElementById("breeding_img3").innerHTML = str;
    else document.getElementById("breeding_img3").innerHTML = "";
  }

  // 프로그레스 바 그리기
  function drawProgressBar() {
    var obj = document.getElementById("progress_div");
    obj.innerHTML =
      "<progress id='progress' value='100' min='0' max='100'></progress>";
  }

  //main
  function draw() {
    drawProgressBar();
    Timer();

    // 게임시간이 0 이되면 게임종료.
    if (play_time < 0) {
      alert("GAME OVER, time out");
      document.location.reload();
      return;
    }

    // breeding bgm, breeding 5초 전에 play
    if (
      Math.floor(play_time) == 80 ||
      Math.floor(play_time) == 55 ||
      Math.floor(play_time) == 30 ||
      Math.floor(play_time) == 5
    ) {
      audio_breeding.play();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (stage != 3)
      drawBricks();
    else
      drawBoss();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawTimerImg();
    drawBreedingImg();
    drawBall();
    collisionDetection();

    //캔버스 좌우에 공이 닿을 때
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    //캔버스 위에 공이 닿을 때
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
      // 캔버스 아래에 공이 닿을 때
      if (x > paddleX && x < paddleX + paddleWidth) {
        // 패들위치라면
        var signX;
        var m;
        var n;
        var angle;
        if (x < paddleX + paddleWidth / 2) {
          signX = -1;
          m = x - paddleX;
          n = paddleX + paddleWidth / 2 - x;
        } else if (x > paddleX + paddleWidth / 2) {
          signX = 1;
          m = paddleX + paddleWidth - x;
          n = paddleX + paddleWidth / 2 + x;
        } else {
          signX = 0;
          m = 89;
          n = -1;
        }
        angle = (((90 * m) / (m + n)) * 70) / 90 + 10;
        dx = Math.cos((angle * Math.PI) / 180) * signX * vel;
        dy = -Math.sin((angle * Math.PI) / 180) * vel;
      } else {
        lives--;
        if (!lives) {
          alert("GAME OVER, lifeless");
          document.location.reload();
        } else {
          x = canvas.width / 2;
          y = canvas.height - 100;
          dx = 0;
          dy = vel;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    if(bossX + bdx > canvas.width - bossWidth || bossX + bdx < 0)
      bdx = -bdx;

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;
    if(stage == 3)
      bossX += bdx;
    requestAnimationFrame(draw);
  }
});
