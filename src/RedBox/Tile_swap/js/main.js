var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");


//resizing canvas
cav.width = 1280;
cav.height = 720;

cavMain.width = 1280;
cavMain.height = 720;



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3, 
    orientation:4,
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

    var text_color = "#333333";
    var pause_text_color = "#585858";

//game state initilization
var currentGameState;

//Object containing names of resources
var images = {    
    P_L : "./assets/sprites/P_L.png",
    Background : "./assets/sprites/BG.png",
    Logo : "./assets/sprites/Logo.png",
    Playbutton : "./assets/sprites/playbutton.png",
    Pause : "./assets/sprites/pausebutton.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    Help_animation : "./assets/sprites/animations/512_512.png",
    tile : "./assets/sprites/tile.png",
    GO : "./assets/sound/gameover.wav",
    t1 : "./assets/sound/T1.mp3",
    t2 : "./assets/sound/T2.mp3",
    w1 : "./assets/sound/W1.mp3",
    w2 : "./assets/sound/W2.mp3",
    BG : "./assets/sound/bg.mp3",  
};

var sounds = [images.t1,images.t2];
var woosh = [images.w1,images.w2];

var tiles;

let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";

var delay_interval;

y.onload = () => {   
    let ratio = y.width/y.height;
    let nwidth = ratio * cavMain.height;

    window.resources.load(resources_paths,true);

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
    Score:0,
    speed : 200,
    gametime : 0,
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
var previoustate;

var nexttimer;

//mainmenu
function loadmainmenu(){
    let y = new Entity(images.Logo,0,0);
    let y2 = new Button(images.Playbutton,405,159);

    y.ratio = y.size.x / y.size.y;
    y.size.y = 300;
    y.size.x = y.ratio * 300;
    y.pos.x= cav.width/2 - y.size.x/2;
    y.pos.y=75;    

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.9 - y2.size.y;

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
    y.pos.y=cav.height * 0.9 - y.size.y;

    y.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
}

function gameOver() {    
    clearUI();
    currentGameState = gameStates.gameover;
    let y2 = new Button(images.Playagain,405,159);
    let y = new Entity(images.blackdrop,cav.width,cav.height);
    y.order = 1;
    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.9 - y2.size.y;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        resetgame();   
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
        speed : 200,
        gametime : 0,        
    }       
    entitylist = [];  
    player_entity = new Player(Math.random()<0.5);
    entitylist.push(player_entity);  
    resources.get(images.BG).play(); 
}

//Initilization function
function init()
{    
    let ts1 =new Sprite( resources.get(images.tile),0,0,100,1000);
    let ts2 =new Sprite( resources.get(images.tile),100,0,100,1000);
    tiles = [ts1,ts2];
    uiEntityList = onhoverlist;
    
    player_entity = new Player(Math.random()<0.5);
    
    entitylist.push(player_entity);

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;

    resources.get(images.BG).loop = true;
    resources.get(images.BG).oncanplay = () =>
    {
        try{
        resources.get(images.BG).play();
        }
        catch(e){}        
    };

    loadmainmenu();  
    
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
    nexttimer = 0;
    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;
   
    if(window.innerWidth < window.innerHeight && currentGameState != gameStates.orientation){
        previoustate = currentGameState;
        currentGameState = gameStates.orientation;        
    }
    else if(currentGameState == gameStates.orientation && window.innerWidth > window.innerHeight)
    {
        currentGameState = previoustate;
        loadgameUI();        
    }

    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:
        game_properties.gametime += dt;
        if( (entitylist[entitylist.length-1].pos.x - 1280)*-1  > nexttimer)
        {
            entitylist.push(new Block(Math.random()<0.5));
            nexttimer = 150 +(Math.random() *100) + Math.max(1-game_properties.gametime/60,0)*400;
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
            e.updateMain();
            draw(e);
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

    oldmousestate = keyState["mouse"];
        
    drawCall(DrawBackground,-1);
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
    constructor (state){
               
        super(state?tiles[0]:tiles[1],0,0);
        this.state = state; 
        this.pos.x = 10;
        this.pos.y = cav.height/2 - this.size.y/2;
        this.changestate = () => {
            this.state = !this.state;
            this.sprite = tiles[ this.state?0:1 ];
             resources.get(woosh[ Math.floor(Math.random()*1.99)]).currentTime =0;
             resources.get(woosh[ Math.floor(Math.random()*1.99)]).play();
        }              
    }
}

class Block extends Entity {
    constructor(state)
    {
              
        super(state?tiles[0]:tiles[1],0,0);
        this.state = state;
        this.pos.x = 1280;
        this.pos.y = cav.height/2 - this.size.y/2;        
        
        this.update = () => {
            this.pos.x -= game_properties.speed * dt;
            if(physics.checkCollision(this,player_entity))
            {
                if(this.state == player_entity.state && currentGameState == gameStates.game)
                {
                    game_properties.Score++;
                    this.enabled = false;
                    resources.get(sounds[ this.state?0:1]).currentTime = 0;
                    resources.get(sounds[ this.state?0:1]).play();
                }else
                {
                    gameOver();
                    this.enabled = false;
                    resources.get(images.GO).currentTime = 0;
                    resources.get(images.GO).play();
                }
            }
        }
    }
}

document.addEventListener("visibilitychange", function() {
    if(document.hidden && currentGameState== gameStates.game)
    {
        currentGameState = gameStates.pause;
        loadpauseUI()
    } 
});

