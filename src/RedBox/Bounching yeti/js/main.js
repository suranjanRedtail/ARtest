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



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,  
}

const colors = [
    "#296A7A",
    "#649933",
    "#417A29",
    "#2CB57A",
    "#2D69B2",
    "#AF622E",
    "#AA2FAD",
    "#6D2F8E",
    "#3091CE",
    "#6227D6",
    "#C6A105",
    "#DB7F23",
    "#C43535",
    "#DD1F83",
    "#798A2E"];

    var text_color = "#f8ae40";
    var pause_text_color = "#f8ae40";

//game state initilization
var currentGameState;

//Object containing names of resources
var images = {    
    Background : "./assets/sprites/BG.png",
    Logo : "./assets/sprites/Logo.png",
    Playbutton : "./assets/sprites/playbutton.png",
    Pause : "./assets/sprites/pausebutton.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    GameOver : "./assets/sound/game_over.wav",
    BG : "./assets/sound/BG.mp3",
    Help_animation : "./assets/sprites/animations/512_512.png", 
    tap_1 : "./assets/sound/bounce.wav",        
    w1 : "./assets/sound/W1.mp3",
    coin : "./assets/sound/coin.wav",
    p1 : "./assets/sprites/p1.png", 
    p2 : "./assets/sprites/p2.png",
    ball : "./assets/sprites/balls.png",
    block : "./assets/sprites/block.png",
    coin_img : "./assets/sprites/coin.png",    
};


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


var delay_interval;

y.onload = () => {    
    cavMain.getContext('2d').drawImage(y,0,0,cavMain.width,cavMain.height);

    //window.resources.addcallback(init);
    window.resources.load(resources_paths);

    let counter =0;
    let tempcxt = cavMain.getContext('2d');
    delay_interval = setInterval(() => {
        if(counter>=2000 && resources.resourcesloadedcount == resources.resourcescount)
        {
            clearInterval(delay_interval);
            init();
        }   
        else
        {     
        tempcxt.drawImage(y,0,0,cavMain.width,cavMain.height);
        tempcxt.fillStyle = "#ff0000";
        let delta =  (resources.resourcesloadedcount/resources.resourcescount)< counter/2000?(resources.resourcesloadedcount/resources.resourcescount):counter/2000;
        tempcxt.fillRect(0,cavMain.height-10, delta*cavMain.width,10);
        tempcxt.fillStyle = "#000000";
        tempcxt.font =  "BOLD 30px Roboto"
        tempcxt.fillText(Math.ceil( delta*100) + "%",cavMain.width*0.88,cavMain.height - 25);
        counter += counter<2000?10:0;
        }
    }, 10);
    
};


//game properties
var game_properties ={  
    Score:0,
    gametime :0,
    playerSpeed: 500,
    ballsSpeed : 300,
}

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;

//player 
var player_entity;
var B1,B0;
var coin;
var PS;
var timer =0;
var nexttimer = 0;


//mainmenu
function loadmainmenu(){

    let y = new Entity(images.Logo,0,0);
    let y2 = new Button(images.Playbutton,405,159);

    y.ratio = y.size.x / y.size.y;
    y.size.y = 400;
    y.size.x = y.ratio * y.size.y;
    y.pos.x= cav.width/2 - y.size.x/2;
    y.pos.y=200;    

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.8 - y2.size.y;

    y2.onclick = () => {
        setTimeout(() => {
            resources.get(images.BG).play();
        }, 200);        
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
        help.timer = 0;  
        help.enabled = true; 
    };

    uiEntityList.push(y);
    uiEntityList.push(y2); 

    y2.onclick = () => {
        setTimeout(() => {
            resources.get(images.BG).play();
        }, 200);        
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
        help.timer = 0;  
        help.enabled = true; 
    };

    uiEntityList.push(y);
    uiEntityList.push(y2);    
}

function loadgameUI(){
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

function loadpauseUI() {

    let y = new Button(images.resume,405,159);
    let y2 = new Entity(images.blackdrop,cav.width,cav.height);
    y.order = 2;
    y2.order = 1;

    y.pos.x=cav.width/2 - y.size.x/2;
    y.pos.y=cav.height * 0.8 - y.size.y;

    y.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
}

function gameOver() {    
    resources.get(images.GameOver).play();
    clearUI();
    currentGameState = gameStates.gameover;
    let y = new Entity(images.blackdrop,cav.width,cav.height);
    let y2 = new Button(images.Playagain,405,159);
    y.order = 1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.8 - y2.size.y;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        resetgame();  
        resources.get(images.BG).play();    
        help.timer = 0;  
        help.enabled = true;   
    }    
    uiEntityList.push(y2);
    uiEntityList.push(y);       
}

function clearUI(){
    while(uiEntityList.length !=0)
    {
        uiEntityList.pop();
    }
}

function resetgame() {
    currentGameState = gameStates.game;
    game_properties ={  
        Score:0,
        gametime :0,
        playerSpeed: 500,
        ballsSpeed : 300,
    }
    entitylist = [];

    entitylist.push(coin);
    entitylist.push(B0);
    entitylist.push(B1);
    entitylist.push(player_entity);
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    PS = [  
        new Sprite(images.p1,0,0,0,0),
        new Sprite(images.p2,0,0,0,0),
    ]

    player_entity = new Player(PS[0]);
    
    B0 = new Blocks();
    B1 = new Blocks();
    B0.pos.y = 0;
    B1.pos.y = cav.height - B1.size.y;
    B0.oldy = 0;
    B1.oldy = B1.pos.y;

    coin = new Coin();

    entitylist.push(coin);
    entitylist.push(B0);
    entitylist.push(B1);
    entitylist.push(player_entity);

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;

    loadmainmenu();

    resources.get(images.BG).loop = true;
    resources.get(images.BG).oncanplay = () =>
    {
        try{
        resources.get(images.BG).play();
        }
        catch(e){}        
    };
    
    var helpAnimation = new SpriteAnimation(images.Help_animation,0,0,[0,1,0],500,500,2,1); 
    helpAnimation.loop = true;
    help = new Entity(helpAnimation,0,0);
    help.order = 3;
    help.timer = 0;
    help.update = ()=> {
        if(help.timer>=2.2)
        {
            help.enabled=false;
        }
        help.timer += dt;
    }
    help.pos.x = cav.width/2 - help.size.x/2;
    help.pos.y = cav.height/2 - help.size.y/2;

    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;

    
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);

    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:
            game_properties.ballsSpeed += dt * 1;
            game_properties.playerSpeed += dt * 0.5;
            timer +=dt;
            if(timer> nexttimer)
            {
                spawnBall();
                nexttimer += 0.5 + Math.random()*1.5 +Math.max(1- game_properties.gametime/60,0)*1; 
            }

            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = "#ffffff";             
                cxt.font = "bold 80px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-35-100,95);
                cxt.fillStyle = text_color;
                cxt.font = "bold 80px GameFont";
                cxt.fillText(game_properties.Score,cav.width-35-100,95);  
                cxt.textAlign = "start";  
                },2);
            

            help.updateMain();
            draw(help);
            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                draw(e);
            })

            drawCall(()=>
            {
            cxt.font = "bold 70px GameFont";            
            cxt.fillStyle = pause_text_color; 
            cxt.strokeStyle = "#ffffff";
            cxt.textAlign = "center"; 
            cxt.lineWidth = 8;
            cxt.strokeText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.fillText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px GameFont";
            cxt.strokeText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 

        entitylist.forEach(e=>{
            if(! (e instanceof Player) ){
            e.updateMain();
            draw(e);
            }
        });

        drawCall(()=>
            {
            cxt.font = "bold 70px GameFont";            
            cxt.fillStyle = pause_text_color; 
            cxt.strokeStyle = "#ffffff";
            cxt.textAlign = "center"; 
            cxt.lineWidth = 8;
            cxt.strokeText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.fillText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px GameFont";
            cxt.strokeText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.textAlign = "start"; 
            },2);

            break;
        default:         
        break;       
    }
    
    uiEntityList.forEach(e=>{
        draw(e);
    });

    entitylist= entitylist.filter(e=>{
        if(e.enabled)
        {
            return e;
        }
    })

    oldmousestate = keyState["mouse"];


    Rendering.renderDrawCalls();
    
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);

    keyStateOld = JSON.parse(JSON.stringify(keyState));
    
    requestAnimationFrame(main);  
};

function DrawBackground()
{
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
}

class Player extends Entity{
    constructor (sprite){               
        super(sprite,0,0);
        this.speedy = game_properties.playerSpeed; 
        this.ratio = this.sprite.width /this.sprite.height;
        this.size.y = 125;
        this.size.x = this.ratio * this.size.y;
        this.pos.y = cav.height/2 + this.size.y/2;
        this.pos.x = cav.width/2 - this.size.x/2;
        this.changestate = () => {
            resources.get(images.tap_1).currentTime = 0;
            resources.get(images.tap_1).play()  
           this.speedy *= -1;
           this.sprite = this.speedy>0?PS[1]:PS[0];
        } 
        this.update = () => {
            this.pos.y += dt * this.speedy;
        }             
    }
}

class Balls extends Entity{
    constructor (){               
        super(images.ball,0,0);
        this.speedx = 0; 
        this.update = () => {
            this.pos.x += dt * this.speedx;
            let dist = Math.sqrt(Math.pow((this.pos.x - player_entity.pos.x+ this.size.x/2 -player_entity.size.x/2),2)+Math.pow((this.pos.y - player_entity.pos.y+ this.size.y/2 -player_entity.size.y/2),2));
            if(dist <= this.size.x/2 + player_entity.size.x/2 && currentGameState == gameStates.game)
            {
                gameOver();
            }
            if(this.speedx < 0 && this.pos.x < -this.size.x-50)
            {
                this.enabled=false;
            }
            if(this.speedx > 0 && this.pos.x > cav.width+this.size.x+50)
            {
                this.enabled=false;
            }
        }              
    }
}

class Blocks extends Entity{
    constructor (){               
        super(images.block,0,0);
        this.size = {x:150,y:150}
        this.pos.x = cav.width/2 - this.size.x/2;
        this.oldy= this.pos.y;
        this.update = () => {
            if(physics.checkCollision(this,player_entity))
            {
                
                
                this.pos.y += Math.sign(player_entity.speedy) * 10;
                player_entity.pos.y = this.pos.y > cav.height/2? this.pos.y - player_entity.size.y : this.pos.y + this.size.y;
                
                player_entity.changestate();
                
            }

            let d = this.oldy - this.pos.y;  
            if(Math.abs(d)>1)
            {
                this.pos.y += d * 0.1;
            }   
            else
            {
                this.pos.y = this.oldy;
            } 

        }            
    }
}

class Coin extends Entity{
    constructor (){               
        super(images.coin_img,0,0); 
        this.pos.x = cav.width/2 - this.size.x/2;
        this.pos.y = this.pos.y < cav.height/2?B1.pos.y - this.size.y - 20:B0.pos.y + this.size.y + 20; 
        this.update = () => {
            if(physics.checkCollision(this,player_entity))
            {
                game_properties.Score++;
                this.pos.y = this.pos.y < cav.height/2?B1.pos.y - this.size.y - 20:B0.pos.y + B0.size.y+ 20; 
                resources.get(images.coin).play()               
            }
        }             
    }
}

var spawnBall = () => {    
    let tb = new Balls();

    let height = ( B1.pos.y - (B0.pos.y + B0.size.y)- (2*tb.size.y));
    
    tb.pos.y = Math.random() * height;
    tb.pos.y += B0.pos.y + B0.size.y;
    tb.speedx = 100 + game_properties.ballsSpeed*Math.random();
    tb.speedx *= Math.random()>0.5?1:-1;
    
    let rs = 50 + Math.random()*100;
    tb.size = {x:rs,y:rs};
    tb.pos.x = tb.speedx>0? -tb.size.x:cav.width;
    entitylist.push(tb);
}

document.addEventListener("visibilitychange", function() {
    if(document.hidden && currentGameState== gameStates.game)
    {
        currentGameState = gameStates.pause;
        loadpauseUI()
    } 
});


