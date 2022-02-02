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
    GameOver : "./assets/sound/game_over.wav",
    board : "./assets/sprites/board.png",    
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png",

    player : "./assets/sprites/player.png",
    c1 : "./assets/sprites/cloud1.png",
    c2 : "./assets/sprites/cloud2.png",
    c3 : "./assets/sprites/cloud3.png",
    c4 : "./assets/sprites/cloud4.png",
    c5 : "./assets/sprites/cloud5.png",
    i1 : "./assets/sprites/island1.png",
    i2 : "./assets/sprites/island2.png",
    i3 : "./assets/sprites/island3.png",
    i4 : "./assets/sprites/island4.png",
    i5 : "./assets/sprites/island5.png",
    i6 : "./assets/sprites/island6.png",
     
    BG : "./assets/sound/BG.mp3", 
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
    enemy_speed : 300,
    Score : 0,
    real_score : 0,
    island_speed : -200,
        
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

var islands = [];


var Clouds = [];



var fishsprites;
var enemy_sprites =[];

var timer = 0;
var nexttimer =2;

var next_obs = 0;

var text_color = "#000000";
var outline_color = "#ffffff";
var score_color = "#000000";


//mainmenu
function loadmainmenu(){

      
        let y = new Entity(images.Logo,0,0,true);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.85 - y2.size.y;
    
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
        player_entity.storeTpos();
        
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
    resources.get(images.BG).pause();
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
        loadgameUI();
        resetgame();  
        resources.get(images.BG).play();    
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
   
    resources.get(images.BG).currentTime =0;

    for (let index = 0; index < 3; index++) {
        entitylist.push(new Cloud());        
    }
    player_entity.pos.x = cav.width * 0.5;
    player_entity.pos.y = cav.height * 0.2;
    player_entity.Tx =cav.width * 0.5;
    player_entity.Ty =cav.height * 0.2;
    player_entity.outofpause = true;
        
    entitylist.push(player_entity);

    
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);


    Clouds = [
        new Sprite(images.c1),
        new Sprite(images.c2),
        new Sprite(images.c3),
        new Sprite(images.c4),
        new Sprite(images.c5),
    ]
    islands = [
        new Sprite(images.i1),
        new Sprite(images.i2),
        new Sprite(images.i3),
        new Sprite(images.i4),
        new Sprite(images.i5),
        new Sprite(images.i6),
    ]

    player_entity = new Player();
    player_entity.pos.x = cav.width * 0.5;
    player_entity.pos.y = cav.height * 0.2;
    player_entity.Tx =cav.width * 0.5;
    player_entity.Ty =cav.height * 0.2;
    player_entity.outofpause = true;

    entitylist.push(player_entity); 

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    for (let index = 0; index < 3; index++) {
        entitylist.push(new Cloud());        
    }


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
    
    var helpAnimation = new SpriteAnimation(images.Help_animation,0,0,[0,1,2,1,5,0,0,0],500,500,2,1.2); 
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
    dt *= Engine.timeScale;
    

    checkOrientation();
    
    DrawBackground();

    switch(currentGameState)
    {     
         
        case gameStates.menu:  
            draw(player_entity);
            game_properties.game_time += dt;        
            break;
        case gameStates.game:
            mainviewport.update();  

            timer += dt;
            game_properties.game_time += dt; 
            game_properties.island_speed += dt * 2;
            game_properties.real_score += -game_properties.island_speed * dt;
            game_properties.Score = Math.floor(game_properties.real_score/10);

            if(timer > nexttimer)
            {
                entitylist.push(new Obstacle());
                next_obs += 1 + Math.random()*1.5;
                timer=0;
                if(Math.random() < 0.5)
                {
                    entitylist.push(new Cloud());
                }
            }


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = outline_color;             
                cxt.font = "bold 70px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,70);
                cxt.fillStyle = score_color;
                cxt.font = "bold 70px GameFont";
                cxt.fillText(game_properties.Score,cav.width-100,70);  
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
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 550/2 + 70);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 
        game_properties.game_time += dt;  
        entitylist.forEach(e=>{
            //e.updateMain();
            draw(e);
        });

        drawCall(()=>
            {
            cxt.font = "70px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + 550/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 550/2 + 50 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 550/2 + 120);
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

    oldmousestate = keyState["mouse"];


    Rendering.renderDrawCalls();
    
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);

    keyStateOld = JSON.parse(JSON.stringify(keyState));
    
    requestAnimationFrame(main);  
};


class Player extends Entity{
    constructor()
    {
        super(images.player);
        this.Tx=0;
        this.Ty=0;
        this.Otx = 0;
        this.Oty =0;
        this.outofpause = false;

        this.update = ()=>{
            if(keyState["mouse"] && !this.outofpause)
            {
                this.Tx = mousePos[0];
                this.Tx -= this.size.x/2;
                this.Ty = mousePos[1] - this.size.y*1.5;  
            }

            this.oldPosX = this.pos.x;
            if(this.enabled){
                if(this.pos.x != this.Tx)
                {
                    let delta = this.Tx - this.pos.x;
                    this.pos.x += delta * 0.1;
                }
                if(this.pos.y != this.Ty)
                {
                    let delta = this.Ty - this.pos.y;
                    this.pos.y += delta * 0.1;
                }
            }
        }
        this.storeTpos = ()=>{
            this.outofpause = true;
        }
        this.restoreTpos = () => {
            mousePos[0] = this.Otx;
            mousePos[1] = this.Oty;
            this.Tx = mousePos[0];
            this.Ty = mousePos[1];
            console.log(this.Otx,this.Oty,mousePos,this.Tx,this.Ty);
        }
    }
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2
            ,y:this.pos.y + this.size.y/2
        };
    } 
    get radius()
    {
        return this.size.y/2;
    } 

}

class Obstacle extends Entity{
    constructor()
    { 
        super( islands[ Math.floor(Math.random() * islands.length) ])
        this.speedy = game_properties.island_speed *( 1 + Math.random());
        this.pos.x = Math.random() * (cav.width - this.size.x);
        this.pos.y = cav.height + this.size.y;
        this.order = Math.floor( Math.random() * 5) / 5;
        this.update =()=>{
            this.pos.y += this.speedy * dt;
            if(this.pos.y < -this.size.y)
            {
                this.enabled=false;                
            }
            let dist = Math.sqrt( Math.pow (player_entity.center.x - this.center.x,2) + Math.pow (player_entity.center.y -  this.center.y,2));
            let distmax = this.radius + player_entity.radius;
            if(dist < distmax && currentGameState == gameStates.game)
            {
                gameOver();
                resources.get(images.GameOver).currentTime =0;
                resources.get(images.GameOver).play();
            }
        }  
    }
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2
            ,y:this.pos.y + this.size.y/2
        };
    } 
    get radius()
    {
        return this.size.y/2;
    }   
}

class Cloud extends Entity{
    constructor()
    {
        super( Clouds[Math.floor(Math.random() * Clouds.length)])        
        this.speedy = game_properties.island_speed * ( 0.5 + Math.random());
        this.speedx = (Math.random()<0.5?-1:1) * (cav.width/3)* ( 0.5 + Math.random());
        this.pos.y = 0.5*(1 + Math.random())* cav.height;
        this.pos.x = this.speedx>0? -this.size.x: cav.width;
        this.pos.y += this.speedy * dt;
        this.order = Math.floor( Math.random() * 5) / 5;
        this.update =()=>{
            this.pos.y += this.speedy * dt;
            this.pos.x += this.speedx * dt;
            if(this.pos.y < -this.size.y)
            {
                this.enabled=false;                
            }              
        }
    }
}




function DrawBackground()
{ 
    let b0 = resources.get(images.Background);
    drawCall(()=>{ 
         cxt.imageSmoothingEnabled = false;
         cxt.drawImage(b0,0,0,cav.width,cav.height);
    },-2);    
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
    player_entity.outofpause = true;
}