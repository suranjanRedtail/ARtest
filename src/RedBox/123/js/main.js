var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");

var game_orientation = 0;

//resizing canvas
cav.width = game_orientation==0?720:1280;
cav.height = game_orientation==0?1280:720;

cavMain.width = game_orientation==0?720:1280;
cavMain.height = game_orientation==0?1280:720;



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}

//game state initilization
var currentGameState;

//Object containing names of resources
var images = {
    Logo : "./assets/sprites/Title.png",
    Playbutton : "./assets/sprites/play.png",
    Pause : "./assets/sprites/pause.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    board : "./assets/sprites/board.png",
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png",
    help : "./assets/sprites/help.png",
    
    player : "./assets/sprites/player.png",
    platfrom : "./assets/sprites/platform.png",
    draw : "./assets/sound/draw.wav",

    BG : "./assets/sound/BG.mp3",
    GameOver : "./assets/sound/passturn.wav",
    coin : "./assets/sound/coin.wav",
 };


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


y.onload = () => {   
    let ratio = y.width/y.height;
    let nwidth = ratio * cavMain.height;

    window.resources.load(resources_paths,false);

    let counter =0;
    let timeoutcounter =0;
    let tempcxt = cavMain.getContext('2d');
    
    //address bar hide hack
    window.scrollTo(0,1);

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
        }
    }, 10);    
};

//game properties
var game_properties ={  
    game_time :0,
    Enemy_speed : 250,
    Player_speed : 300,
    life :10,
    Score:0,
    streak:1,

    debug_mode : false,
}

var game_properties_initial = Object.assign({},this.game_properties);

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;
var previoustate;

//player 
var player_entity;
var mainviewport;

var platfrom;

var nextNUM = 1;

var timer = 0;
var nexttimer =2;

var text_color = "#155257";
var outline_color = "#28727d";
var score_color = "#ffffff";
var outlineScore=false;


//mainmenu
function loadmainmenu(){
     
        let y = new Entity(images.Logo,0,0,true);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.85 - y2.size.y;
    
        y2.onclick = () => {       
            clearUI();
            loadgameUI();
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true; 
            setTimeout( ()=>{
                resources.get(images.BG).currentTime=0;
                resources.get(images.BG).loop = true;
                if(resources.get(images.BG).paused)
                {
                    resources.get(images.BG).play();
                }
                resources.get(images.BG).volume =0.5;
            },500);
            
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
        resources.get(images.BG).pause();
        currentGameState = gameStates.pause;
    }
    uiEntityList.push(y);
}

function loadpauseUI() {

    let y2 = new Button(images.resume,0,0);
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,600,600,true);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        loadgameUI();

        resources.get(images.BG).play();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
    uiEntityList.push(y3);
}

function gameOver() {      
    clearUI();
    currentGameState = gameStates.gameover;
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,600,600,true);
    let y2 = new Button(images.Playagain,0,0);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        resetgame(); 
        loadgameUI(); 
        help.timer = 0;  
        help.enabled = true;   
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

function resetgame() {
    currentGameState = gameStates.game;
    game_properties = Object.assign({},game_properties_initial);

    entitylist =[];  
    entitylist.push(player_entity);
    player_entity.reset();
    entitylist.push(platfrom);
    nextNUM=1;
}

//Initilization function
function init()
{
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    player_entity = new Player();
    entitylist.push(player_entity);

    platfrom = new Entity(images.platfrom);
    platfrom.pos.x = 58;
    platfrom.pos.y = 1066;
    entitylist.push(platfrom);
    

    entitylist.forEach((_ent)=>{
        _ent.init();
    })


    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;
    loadmainmenu();
    
    var helpAnimation = new Sprite(images.help,0,0); 
    help = new Entity(helpAnimation,0,0,true);
    help.order = 3;
    help.timer = 0;
    help.update = ()=> {
        if(help.timer>=3)
        {
            help.enabled=false;
        }
        help.timer += dt;
    }
    help.pos.x = cav.width/2 - help.size.x/3;
    help.pos.y = cav.height/2 - help.size.y/2;
    
    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;
    dt *= Engine.timeScale;

    checkOrientation();
    
    DrawBackground();

    switch(currentGameState)
    {     
         
        case gameStates.menu:  
            game_properties.game_time += dt;        
            break;

        case gameStates.game:            
            timer += dt;
            game_properties.game_time += dt; 

            if(game_properties.life<=0)
            {
                gameOver();
                playSound(images.GameOver);
            }

            if(timer > nexttimer)
            {
                let ta;
                if(Math.random()> 0.9)
                {
                    ta = new Alphabet(nextNUM);
                }
                else
                {
                    let min = Math.max(nextNUM-5,1);
                    let max = Math.min(nextNUM+5,100);
                    let range = max - min;
                    let tnext = Math.floor(Math.random()*range) + min;
                    
                    ta = new Alphabet(tnext);                    
                }

                ta.pos.x = (Math.random()* (platfrom.size.x-ta.size.x))+platfrom.pos.x;
                entitylist.push(ta);  

                nexttimer = timer + 1.5;
            }            

            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });            
            mainviewport.update(); 

            drawCall(()=>{
                cxt.textAlign = "end";                
                cxt.strokeStyle = outline_color;
                cxt.font = "70px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-50,90);
                cxt.fillStyle = score_color;
                cxt.font = "70px GameFont"; 
                cxt.fillText(game_properties.Score,cav.width-50,90);
                cxt.textAlign = "start";
                },2);
           
            

            help.updateMain();
            draw(help);            

            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                draw(e);
            });

            drawCall(()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 550/2 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 550/2 + 100);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 
        
        game_properties.game_time += dt;  

        mainviewport.update();  

        entitylist.forEach(e=>{
            //e.updateMain();
            draw(e);  
                        
        });

        drawCall(()=>
            {
            cxt.font = "70px GameFont";   
                     
            cxt.fillStyle = "#bc2834";            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + 500/2-50);
            cxt.fillStyle = text_color; 
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 500/2 + 70 );
            cxt.font = "70px GameFont"; 
            cxt.fillStyle = "#ffffff";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 500/2 + 170);
            cxt.textAlign = "start"; 
            },2);

            break;
        case gameStates.orientation:
            drawCall(()=>{
            cxt.fillStyle = "#ffffff";
            cxt.fillRect(0,0,cav.width,cav.height);
            cxt.drawImage(resources.get(images.P_L),0,0,resources.get(images.P_L).width*2,resources.get(images.P_L).height/2);
            },11);
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

    Engine.onClick= Engine.onClick.filter(e=>{
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
}

function DrawBackground()
{     
    let b0 = resources.get(images.Background);
    
    drawCall(
        ()=>{ 
            cxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2); 
     
}

class Alphabet extends Entity
{
    constructor(num)
    {
        super(null,80,90);
        this.num = num;
        this.pos.y = -this.size.y;

        this.update = ()=>{
            this.pos.y += game_properties.Enemy_speed * dt;
            if(Physics.checkCollision(this,player_entity.collider))
            {
                if(this.num == nextNUM)
                {
                    game_properties.Score += 10;
                    nextNUM = ((nextNUM+1)%101); 
                    nextNUM = nextNUM==0?nextNUM+1:nextNUM;
                    
                    playSound(images.coin);
                    this.enabled=false;
                }
                else
                {
                    gameOver();
                    playSound(images.GameOver);
                }
            }
            else if(Physics.checkCollision(this,platfrom))
            {
                if(this.num == nextNUM)
                {
                    gameOver();
                }
                this.enabled = false;
            }
        }

        this.draw =(context)=>{
            if(this.enabled && !this.done)
            {                
                context.font = "90px GameFont";
                context.strokeStyle = this.num == nextNUM?"#ff7de3":"#155257";
                context.fillStyle = "#fcda45";
                context.lineWidth =8;
                context.strokeText(this.num,this.pos.x,this.pos.y+this.size.y);
                context.fillText(this.num,this.pos.x,this.pos.y+this.size.y);
                

                cxt.textAlign = "start";
            }                        
        }        

    }
}

class Player extends Entity
{
    constructor()
    {
        let panim = new SpriteAnimation(images.player,0,0,[0,1],159,238,10,1);
        panim.play = false;
        

        super(panim);

        this.order = 0.1;
        this.direction = true;
        this.collider = new Entity(null,72,219);
        this.yspeed =250;
        this.falling = false;

        this.colliderOffset = {
            x: 38,
            y: 17,
        }

        this.init =() =>{

            this.pos.x = 284;
            this.pos.y = 858;

            this.collider.pos.x = this.pos.x + this.colliderOffset.x;
            this.collider.pos.y = this.pos.y + this.colliderOffset.y;
        }

        this.update = ()=>{
            this.pos.x += (this.direction?1:-1) * dt * game_properties.Player_speed;
            
            this.collider.pos.x = this.pos.x + this.colliderOffset.x;
            this.collider.pos.y = this.pos.y + this.colliderOffset.y;

            let overlap = Physics.checkCollision(platfrom,this.collider);

            if(!overlap)
            {
                this.yspeed += 9.8*10 * dt;
                this.pos.y  += this.yspeed * dt;
                this.falling = true;
            }

            if(player_entity.pos.y >= cav.height)
            {
                gameOver();
                playSound(images.GameOver);
            }

        }
        this.reset = ()=>{
            this.pos.x = 284;
            this.pos.y = 858;

            this.collider.pos.x = this.pos.x + this.colliderOffset.x;
            this.collider.pos.y = this.pos.y + this.colliderOffset.y;
            
            this.yspeed=250;

            this.falling = false;
            this.direction =false;
            this.changeDirection();
            
            
        }

        this.changeDirection =()=>{

            if(this.falling)
            {
                return;
            }

            this.direction = !this.direction;
            this.sprite.currentframe = this.direction?0:1;
            playSound(images.draw);
        }

    }
}

function checkOrientation() {
    if(game_orientation == 0)
    {
        return;
    }
    
    if(window.innerWidth < window.innerHeight && currentGameState != gameStates.orientation){
        previoustate = currentGameState;
        currentGameState = gameStates.orientation;        
    }
    else if(currentGameState == gameStates.orientation && window.innerWidth > window.innerHeight)
    {
        currentGameState = previoustate;
        clearUI();
        switch(currentGameState)
        {
            case gameStates.menu:
                loadmainmenu();
                break;
            case gameStates.pause:
                loadpauseUI();
                break;
            case gameStates.game:
                loadgameUI();
                break;
            case gameStates.gameover:
                gameOver();
                break;
            default:
                loadgameUI();
                break;
        }      
    }
}

onGameVisibilityChangePause = ()=>{
}