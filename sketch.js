var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, ground
 
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var backImg,attackImg;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("naruto3.png","naruto2.png");
  trex_collided = loadAnimation("narutodie1.png","narutodie2.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("chakra pills.png");
  backImg = loadAnimation( "bc.jpg" );
  
  obstacle1 = loadAnimation("enemy1.png","enemy2.png","enemy3.png","enemy4.png");
  obstacle2 = loadAnimation("uchiha1.png","uchiha2.png","uchiha3.png","uchiha4.png","uchiha5.png");
  obstacle3= loadAnimation("sasuke1.png","sasuke2.png","sasuke3.png","sasuke4.png"," sasuke5.png","sasuke6.png","sasuke7.png","sasuke8.png","sasuke9.png","sasuke10.png","sasuke11.png","sasuke12.png","sasuke13.png");
  attackImg=loadAnimation("attack1.png","attack2.png","attack3.png","attack4.png")  
  restartImg = loadImage("reloadImg.png")
  gameOverImg = loadImage(" game over.jpg")
  
  
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("Naruto sad theme Flute ! Anime.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  bcSound=loadSound("Naruto.mp3")
}

function setup() {
  createCanvas(1350, 650);
  back=createSprite(675,0,1350,650)
  back.addAnimation("bc",backImg)
  back.velocityX=-4
  back.scale=4;
  back.x = back.width/2;
  trex = createSprite(540 ,400,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("attack",attackImg)
  trex.scale = 2;
  
  ground = createSprite(200,620,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(690,325);
  gameOver.addImage(gameOverImg);
   
  restart = createSprite(625,325);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 2.3;
  restart.scale = 0.3;
  
  invisibleGround = createSprite(645,600,3000,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  pillsGroup=createGroup();

  
  trex.setCollider("rectangle",0,0,50,50);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //displa(ying score
  
  
  
  if(gameState === PLAY){
    if (frameCount % 500 === 0) {
      bcSound.play(true)
    }

    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.visible=true;
    ground.velocityX = -(4 + 3* score/100)
    //scoring
     
     
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (back.x < 200){
      back.x = back.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") ) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    
    //attack
    if(keyWentDown("RIGHT_ARROW")) {
      trex.velocityX=6;
    }

    if(keyWentDown("LEFT_ARROW")) {
      trex.velocityX=-6;
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.5
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    if(cloudsGroup.isTouching(trex)){
      score = score + 3;
      cloudsGroup.destroyEach();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;

      obstaclesGroup.visible=false;
      if (frameCount % 500 === 0) {
        bcSound.play(false)
      }
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      obstaclesGroup.setVelocityXEach(0);   
      obstaclesGroup.setVelocityYEach(0);  
     back.velocityX=0
      ground.velocityX = 0;
      trex.velocityY = 0
      trex.velocityx = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     cloudsGroup.setVelocityXEach(0);   
     cloudsGroup.setVelocityYEach(0);   
     
     
  if(mousePressedOver(restart)) {
      reset();
    }


   }
  
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
  fill("green")
  textSize(20);
  text("Score: "+ score, 500,50);
 
}

function reset(){
gameState=PLAY;
gameOver.visible=false;
restart.visible=false;  
obstaclesGroup.destroyEach();  
cloudsGroup.destroyEach();
trex.changeAnimation("running",trex_running);   
score=0;   
}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(1200,585,10,40);
   
   
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addAnimation("enemy",obstacle1);
              break;
      case 2: obstacle.addAnimation("enemy1",obstacle2);
              break;
     case 3: obstacle.addAnimation("enemy2",obstacle3);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 2;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
 else if(frameCount%70 === 0){
 var obstacle = createSprite(50,100,10,40);
 obstacle.velocityX = +(6 + score/100);
 obstacle.velocityY=+6
   
    //generate random obstacles
    var rand=1
    switch(rand) {
       
      
     case 1: obstacle.addAnimation("enemy2",obstacle3);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 2;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
}
else if(frameCount%150 === 0){
  var obstacle = createSprite(1000,100,10,40);
  obstacle.velocityX = -(6 + score/100);
  obstacle.velocityY=+6
    
     //generate random obstacles
     var rand=1
     switch(rand) {
        
       
      case 1: obstacle.addAnimation("enemy1",obstacle2);
               break;
       default: break;
     }
    
     //assign scale and lifetime to the obstacle           
     obstacle.scale = 2;
     obstacle.lifetime = 300;
    
    //add each obstacle to the group
     obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     
    var cloud = createSprite(10,10,40,10);
    cloud.x = Math.round(random(10,1200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -(6 + score/100);
  cloud.velocityY=+6
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


 