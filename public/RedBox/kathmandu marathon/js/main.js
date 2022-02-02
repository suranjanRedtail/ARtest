var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");

//resizing canvas
cav.width = 720;
cav.height = 1280;

cavMain.width = 720;
cavMain.height = 1280;



let bg = document.createElement("audio");
bg.src = "./assets/music/bg.mp3";
bg.loop = true;
bg.volume = 0.5;



const gameStates ={
    menu:0,
    game:1,
    pause:2,
    restart:3,
}

//game state initilization
var currentGameState = gameStates.menu;

//Object containing names of resources
var images = {
    Playbutton : "./assets/sprites/play.png",
    Pause : "./assets/sprites/pause.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    board : "./assets/sprites/board.png",
    background : "./assets/sprites/BG.png",
    E_Nepal : "./assets/sprites/Tempo/E_nepal.png",
    E_Sajha : "./assets/sprites/Tempo/E_sajha.png",
    E_Taxi : "./assets/sprites/Tempo/E_taxi.png",
    E_Tripper : "./assets/sprites/Tempo/E_tipper.png",
    E_Bike : "./assets/sprites/Tempo/E_bike.png",
    explosion : "./assets/sprites/animations/128_128.png",  
    icon_Pause : "./assets/sprites/Icons/pause.png", 
    Logo : "./assets/sprites/Logo.png",
    Bridge : "./assets/sprites/Props/Bridge.png",
    Bridge_2 : "./assets/sprites/Props/Bridge_2.png",
    Dog :"./assets/sprites/Props/Dog.png",
    lampL :"./assets/sprites/Props/lampL.png",
    lampR :"./assets/sprites/Props/lampR.png",
    Man : "./assets/sprites/Props/Man.png",
    Woman : "./assets/sprites/Props/woman.png",
    Plant : "./assets/sprites/Props/Plant.png",
    sign1 : "./assets/sprites/Props/sign1.png",
    sign2 : "./assets/sprites/Props/sign2.png",
    sign3 : "./assets/sprites/Props/sign3.png",
    sign4 : "./assets/sprites/Props/sign4.png",
    Stop : "./assets/sprites/Props/Stop.png",
    Help_animation : "./assets/sprites/animations/512_512.png",
    treeR :"./assets/sprites/Props/tree.png",
    treeL :"./assets/sprites/Props/treeL.png",
    stupaR :"./assets/sprites/Props/stupa.png",
    stupaL :"./assets/sprites/Props/stupaL.png",
    cone :"./assets/sprites/Props/vlc.png",
    generic : "./assets/sprites/generic.png",

    player : "./assets/sprites/player.png",
};

let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

const enemyCarSpriteList = [
    images.E_Bike,
    images.E_Nepal,
    images.E_Sajha,
    images.E_Taxi,
    images.E_Tripper
];


const temponame = ["Bikram Tempo","Safa Tempo","Tuk Tuk","Tuk Tuk 2"];

const signs = [images.sign1,
    images.sign2,
    images.sign3,
    images.sign4,];



let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


y.onload = () => {   
    let ratio = y.width/y.height;
    let nwidth = ratio * cavMain.height;

    window.resources.load(resources_paths,false);

    let counter =0;
    let timeoutcounter =0;
    let tempcxt = cavMain.getContext('2d');
    delay_interval = setInterval(() => {
        timeoutcounter += 10;
        if(counter>=2000 && resources.resourcesloadedcount == resources.resourcescount)
        {
            clearInterval(delay_interval);
            init();
        }   
        else
        {    
        tempcxt.fillStyle ="#FFFFFF"; 
        tempcxt.fillRect(0,0,cavMain.width,cavMain.height);
        tempcxt.drawImage(y,cavMain.width/2 - nwidth/2,0,nwidth,cavMain.height);
        tempcxt.fillStyle = "#ff0000";
        let delta =  (resources.resourcesloadedcount/resources.resourcescount)< counter/2000?(resources.resourcesloadedcount/resources.resourcescount):counter/2000;
        tempcxt.fillRect(0,cavMain.height-10, delta*cavMain.width,10);
        tempcxt.fillStyle = "#000000";
        tempcxt.font =  "BOLD 30px Roboto"
        tempcxt.fillText(Math.ceil( delta*100) + "%",cavMain.width*0.88,cavMain.height - 25);
        counter += counter<2000?10:0;
        if(timeoutcounter> 10000)
        {
            window.resources.load(resources_paths,false);
            timeoutcounter =0;
            console.log("warning slow connection!")
        }                
        }
    }, 10);    
};


//game properties
var game_properties ={
    game_time:0,
    background:null,
    bpos:{x:0,y:0},
    bsize:{w:720,h:0},
    background_scroll : true,
    background_scroll_speed : { x:0,y:0},
    background_scroll_acceleration :{ x:0,y:0.1},
    enable_shadows:true,
    pause:false,
    playerCar:null,
    Score:0,
    ScoreReal :0,
    game_score_text:null,
    enemy_current_speed:5,
    enemy_acceleration:0.2,
}
var last_time = Date.now();
window.dt = 0;

const lanes = [ cav.width * 0.29 , cav.width * 0.5 , cav.width * 0.70 ];
var entitylist = [];
var uiEntityList = [];
var obstacles =[];
var obstaclesList = [];
var mainviewport = []; 
var text_color = "#000000";
var pause_text_color = "#ffffff";

//Player Entity
var player;
var explosion;
var help;
let player_anim;

//load main menu function
function loadmainmenu(){
    let y = new Entity(images.Logo,0,0,true);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.85 - y2.size.y;
    
        y2.onclick = () => {
            bg.currentTime =0;
            bg.loop = true;
            bg.play();
            player.enabled = true;
            entitylist.forEach((x)=>{
                    x.initlocation();
                    x.speed = 5;
            });
            loadgameUI();
            game_properties.Score = 0;
            game_properties.ScoreReal = 0;
            game_properties.background_scroll_speed.y = 2;
            game_properties.enemy_current_speed=5;
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true;  
            entitylist.unshift(help); 
        };    
        uiEntityList.push(y);
        uiEntityList.push(y2);     
}

function loadSelectionMenu(){
        clearUI();
        let c =0;
        playerCarSpriteList.forEach(
            (e)=>{  
                y= new Select_board(temponame[c],e);                
                y.onclick = () => {                          
                };
                y.pos.x = cav.width/2 - y.size.x/2;
                y.pos.y = 20 + (320 * c);
                uiEntityList.push(y);
                c++;
            }
        )
}

function loadgameUI(){
    clearUI();
    let y = new Button(images.Pause,70,70);
    y.pos.x = 35;
    y.pos.y = 20;

    y.onclick = () => {
        clearUI();
        loadpauseUI();
        currentGameState = gameStates.pause;
    }
    uiEntityList.push(y);
}

function loadpauseUI(){
    
    let y2 = new Button(images.resume,0,0);
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,0,0,true);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }

    uiEntityList.push(y);
    uiEntityList.push(y2);
    uiEntityList.push(y3);   
}

function gameOver() {      
    clearUI();
    currentGameState = gameStates.restart;
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,0,0,true);
    let y2 = new Button(images.Playagain,0,0);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        bg.currentTime =0;
            bg.loop = true;
            bg.play();
            player.enabled = true;
            entitylist.forEach((x)=>{
                    x.initlocation();
                    x.speed = 5;
            });
            loadgameUI();
            game_properties.Score = 0;
            game_properties.ScoreReal = 0;
            game_properties.background_scroll_speed.y = 2;
            game_properties.enemy_current_speed=5;
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true;  
            entitylist.unshift(help); 
        currentGameState = gameStates.game        
    }    
    uiEntityList.push(y2);
    uiEntityList.push(y);    
    uiEntityList.push(y3);     
}

function clearUI(){
    while(uiEntityList.length !=0)
    {
        uiEntityList.pop();
    }
}

//Initilization function
function init()
{    
    images.BG = "BG";
    resources.loaded_Resources[images.BG] = bg;
    uiEntityList = onhoverlist;
    prepare_obstacles();
    mainviewport = new ViewPort(0,0,0,0);
    player_anim = new SpriteAnimation(images.player,0,0,[1,2,3,4,3,2],45,35,12,1);
    player_anim.ispixel = true;
    player= new Player(player_anim,72,72,20);
    player.init();
    player.enabled = false;

    explosion = new Entity (new SpriteAnimation(resources.get(images.explosion),0,0,getArrayFromRange(0,5),128,128,12,1),0,0);
    explosion.sprite.done = true;
    explosion.sprite.loop = false;
    explosion.size = { x:128*2,y:128*2};


    loadmainmenu();   
    
    game_properties.background= window.resources.get(images.background);
    
    game_properties.bsize ={
        w:720,
        h:game_properties.background.height/game_properties.background.width * 720,
    }
    game_properties.bpos = {
        x:0,
        y:0
    }
    game_properties.background_scroll_speed ={
        x:0,
        y:1,
    }

    var car = new Sprite(resources.get(enemyCarSpriteList[0]),0,0,0,0);
    car2 = new Enemy(car,0,0,5);
    car3 = new Enemy(enemyCarSpriteList[3],0,0,5);
    car4 = new Enemy(enemyCarSpriteList[3],0,0,5);
    car5 = new Enemy(enemyCarSpriteList[0],0,0,5);
    car6 = new Enemy(enemyCarSpriteList[1],0,0,5);
    
    car2.pos.y = 0.8 * cav.height;
    car3.pos.y = 0.6 * cav.height;
    car4.pos.y = 0.3 * cav.height;
    car5.pos.y = 0.1 * cav.height;
    car6.pos.y = -0.2 * cav.height;
    entitylist.push(car2);   
    entitylist.push(car3); 
    entitylist.push(car4); 
    entitylist.push(car5);
    entitylist.push(car6);     

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    var helpAnimation = new SpriteAnimation(images.Help_animation,0,0,[0,1],500,500,2,1); 
    helpAnimation.loop = true;
    help = new Entity(helpAnimation,0,0);
    help.initlocation = ()=>{};
    help.order = 3;
    help.timer = 0;
    help.update = ()=> {
        if(help.timer>=2.1)
        {
            help.enabled=false;
        }
        help.timer += dt;
    }
    help.pos.x = cav.width/2 - help.size.x/2;
    help.pos.y = cav.height/2 - help.size.y/2;

    Rendering.setContext(cxt);

    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;
    game_properties.game_time += dt;


    switch(currentGameState)
    {
        case gameStates.menu:{
            drawBackground();            
            entitylist.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });            
            player.init();
            break;
        }
        case gameStates.game:{
            
            drawBackground();
            spawnobstacles();
            entitylist.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });
            obstaclesList.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });
            player.updateMain();
            draw(player);
            game_properties.background_scroll_speed.y += game_properties.background_scroll_acceleration.y * dt;
            game_properties.enemy_current_speed += game_properties.enemy_acceleration * dt;
            game_properties.ScoreReal += dt*5;
            game_properties.Score = Math.floor(game_properties.ScoreReal);

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = text_color;             
                cxt.font = "bold 60px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,95);
                cxt.fillStyle = pause_text_color;
                cxt.font = "bold 60px GameFont";
                cxt.fillText(game_properties.Score,cav.width-100,95);  
                cxt.textAlign = "start";  
                },2);            

            break;
        }
        case gameStates.pause:{
            drawBackground();
            entitylist.forEach((_ent)=>{
                
                draw(_ent);
            });
            obstaclesList.forEach((_ent)=>{
                
                draw(_ent);
            });
            draw(player);
            drawCall(()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "60px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 );
            cxt.font = "60px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 70);
            cxt.textAlign = "start"; 
            },2);
            break;
        }
        case gameStates.restart:{
            spawnobstacles();
            drawBackground();
            entitylist.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });
            obstaclesList.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });
            explosion.updateMain();
            draw(explosion);

            drawCall(()=>
            {
            cxt.font = "60px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "60px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 50 );
            cxt.font = "60px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 120);
            cxt.textAlign = "start"; 
            },2);

            break;
        }
        default: 
        break;       
    }

    uiEntityList.forEach(e=>{
        draw(e);
    });

    entitylist = entitylist.filter((e) => {
        if(e.enabled)
        {
            return e;
        }
    });

    obstaclesList= obstaclesList.filter((e) => {
        if(e.enabled)
        {
            return e;
        }
    });



    Rendering.renderDrawCalls();
    requestAnimationFrame(main);
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);
};

var drawBackground = () => {
    let {background,bpos,bsize} = game_properties; 

    bpos.x = bpos.x % bsize.w;
    bpos.y = bpos.y % bsize.h;

    cxt.drawImage(background,bpos.x,bpos.y,bsize.w,bsize.h);
    cxt.drawImage(background,bpos.x,bpos.y-bsize.h,bsize.w,bsize.h);
    cxt.drawImage(background,bpos.x,bpos.y+bsize.h,bsize.w,bsize.h);

    if(currentGameState != gameStates.pause)
    {
        bpos.x += game_properties.background_scroll_speed.x;
        bpos.y += game_properties.background_scroll_speed.y;
    }
};

class Enemy extends Entity{
    constructor(sprite,sizeX,sizeY,speed)
    {
        super(sprite,sizeX,sizeY);
        this.speed = speed;

        this.update = () => {
            if(this.enabled){
            if((this.pos.y) > cav.height)
            {      
                this.enabled = false;          
                let tempE = new Enemy(enemyCarSpriteList[ Math.floor(enemyCarSpriteList.length * Math.random())  ],0,0,game_properties.enemy_current_speed);
                tempE.pos.y = entitylist[entitylist.length-1].pos.y - tempE.size.y - (player.size.y*3) + ((1 - (Math.random() * 0.5 ))*player.size.y);
                tempE.set_random_lane();
                entitylist.push(tempE);                
            };
            }
            if(!game_properties.pause){
            this.pos.y += this.speed;
            this.speed += game_properties.enemy_acceleration * dt;
            }
            if(player.enabled){
            if(physics.checkCollision(this,player))
            {    
                obstaclesList = obstaclesList.filter(e=>{return null;})           
                player.enabled = false;                
               explosion.pos = player.pos;
               explosion.pos.x -=128/1.5;
               explosion.pos.y -=128/1.5;
               explosion.sprite.reset();
               currentGameState = gameStates.Restart;
                gameOver();
            }
        }
        };
        
        this.set_random_lane = () => {            
            let rand = Math.ceil( Math.random() * 3);
            this.pos.x = lanes[rand-1];
            this.pos.x -= this.size.x/2;
        };
        this.init = () => {
            this.set_random_lane();
        };

        this.resetCarColor = (index) => {
            this.sprite.image = resources.get(enemyCarSpriteList[index]);
        }      
        this.draw = (context) => {
            if(this.enabled){
                                  
            this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);
        }
        }  
        this.initlocation = () => {
            this.pos.y -= cav.height * 1.5; 
        }
    }    
}


class Player extends Entity{
    constructor(sprite,sizeX,sizeY,speed)
    {
        super(sprite,sizeX,sizeY);
        this.speed = speed;
        this.currentLane = lanes[1];
        this.targetLane = lanes[1];
        this.update = () => {
            if(this.enabled){
            player.sprite.speed = game_properties.background_scroll_speed.y/4;
            if(this.currentLane != this.targetLane)
            {
                let delta = this.targetLane - this.currentLane;
                delta /= Math.abs(delta);
                this.pos.x += delta * this.speed;
                if(delta<0 && this.pos.x  <= this.targetLane - this.size.x/2)
                {
                    this.pos.x = this.targetLane - this.size.x/2;
                    this.currentLane = this.targetLane;
                }   
                else if(delta>0 && this.pos.x  >= this.targetLane - this.size.x/2)
                {
                    this.pos.x = this.targetLane - this.size.x/2;
                    this.currentLane = this.targetLane;
                }           
            }
        }
        };
        
        this.init = () => {      
            this.pos.x = this.currentLane - this.size.x/2;
            this.pos.y = cav.height * 0.85;      
        };
    
        this.draw = (context) => {
        if(this.enabled)
        {                       
            this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);
        }  
    }
    }    
}

class obstacleEntity extends Entity{
    constructor(sprite,sizeX,sizeY)
    {
        super(sprite,sizeX,sizeY);
        {
            this.order = 0.1;
            this.offset = 0;
            this.update = ()=>{
                this.pos.y +=  game_properties.background_scroll_speed.y;
                if(this.pos.y>= cav.height)
                {
                    this.enabled =false;
                }
            }
            this.swaplocation=()=>{
                this.pos.y = 0- this.size.y;
                if(Math.random()<0.5)
                {
                if(this.pos.x < cav.width/2)
                {
                    
                    this.pos.x += this.offset;
                    
                }
                else{
                    this.pos.x -= this.offset;                    
                }
                }
            };            
        }
    }
}

function obstaclesdetails(url,posx,offset){
    this.url = url;
    this.posx = posx;
    this.offset = offset;
    this.sizeX = 0;
}

class Select_board extends Button{
    constructor(text,sprite)
    {
        super(images.board,300,300);
        this.text = text;
        this.onBoardSprite = resources.get(sprite);
        
        this.draw = (context)=>
        {
            this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);
            context.drawImage(this.onBoardSprite,this.pos.x+99,this.pos.y+36,103,174);
            context.drawImage(resources.get(images.generic),this.pos.x+14 , this.pos.y +210,273,68);

            context.fillStyle = "#000000";
            context.font = "bold 25px GameFont"; 
            context.textAlign = "center";
            context.fillText(this.text,this.pos.x+14 + (210/1.9),this.pos.y +210+ 68/1.5);
        }        
    }
}

function prepare_obstacles() {
    let t;
    t = new obstaclesdetails(images.Bridge,0,0);
    t.order = 2;
    obstacles.push(t);
    t.sizeX = 720;

    t = new obstaclesdetails(images.Bridge_2,0,0);
    t.order = 2;
    obstacles.push(t);
    t.sizeX = 720;

    t = new obstaclesdetails(images.Dog,0,0);
    t.posx = 650;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.lampL,0,0);
    t.posx = 54;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.lampR,0,0);
    t.posx = 540;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.Man,0,0);
    t.posx = 20;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.Plant,0,0);
    t.offset = 615;
    t.posx = 32;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.sign1,0,0);
    t.offset = 590;
    t.posx = 20;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.sign2,0,0);
    t.offset = 590;
    t.posx = 20;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.sign3,0,0);
    t.offset = 590;
    t.posx = 20;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.sign4,0,0);
    t.offset = 590;
    t.posx = 20;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.Stop,0,0);
    t.offset = 0;
    t.posx = 0;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.Woman,0,0);
    t.posx = 20;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.stupaL,0,0);
    t.posx = 0;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.stupaR,0,0);
    t.posx = cav.width - resources.get(images.stupaR).width;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.treeL,0,0);
    t.posx = 0;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.treeR,0,0);
    t.posx = cav.width - resources.get(images.treeR).width;
    t.order = 2;
    obstacles.push(t);

    t = new obstaclesdetails(images.cone,0,0);
    t.offset = cav.width - 20 - resources.get(images.cone).width;
    t.posx = 20;
    t.order = 2;
    obstacles.push(t);
}

function spawnobstacles()
{
    let tempcond = true;
    if(obstaclesList.length>0)
    {
    tempcond = obstaclesList[obstaclesList.length-1].pos.y > 0;
    }                
            if( tempcond )
            {                   
                let randIndex =  Math.floor((Math.random() - 0.00001) * obstacles.length);
                
                let od = obstacles[randIndex];
                let tempobst = new obstacleEntity(od.url,od.sizeX,0);
                tempobst.offset = od.offset;
                tempobst.pos.x = od.posx;
                let starty = obstaclesList[obstaclesList.length-1] == null ?0:obstaclesList[obstaclesList.length-1].pos.y;                
                
                tempobst.swaplocation();

                tempobst.pos.y = starty - tempobst.size.y - 150;
                
                obstaclesList.push(tempobst);
            }
}
