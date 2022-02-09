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

    var text_color = "#FFFFFF";
    var pause_text_color = "#FFFFFF";

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
    player2 : "./assets/sprites/animations/outline2.png",
    player : "./assets/sprites/animations/jump.png",
    tile1 : "./assets/sprites/NT_1.png",
    tile2 : "./assets/sprites/NT_2.png",
    o1 : "./assets/sprites/spikes.png",
    hop_1 : "./assets/sound/h1.wav",
    hop_2 : "./assets/sound/h2.wav",
    GO : "./assets/sound/gameover.mp3",
    land : "./assets/sound/land.mp3",
    land2 : "./assets/sound/land2.mp3",
    takeoff : "./assets/sound/takeoff.wav",
    takeoff2 : "./assets/sound/takeoff2.wav",
    coin : "./assets/sound/coin.wav",
    BG : "./assets/sound/BG.mp3"
    
};

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
    odds : 0.3,
}

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;

var counter=0;
var next_interval=game_properties.spawn_interval;

//player 
var player_entity;
var StepsManager;
var mainviewport;
var previoustate;
//mainmenu
function loadmainmenu(){
    let y = new Entity(images.Logo,553,242);
    let y2 = new Button(images.Playbutton,405,159);

    y.pos.x=cav.width/2-y.size.x/2;
    y.pos.y=116;    

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
    player_entity.enabled=false;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.9 - y2.size.y;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        resetgame();   
        help.timer = 0;  
        help.enabled = true; 
        resources.get(images.BG).play();  
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
        odds : 0.3,
    }    
    entitylist = [];    
    mainviewport = new ViewPort(-100,-100,1280,720);
    StepsManager.generateblocks();
    StepsManager.addblockstogame();
    player_entity.enabled = true;
    player_entity.state = "idle";
    player_entity.timer = 0;
    player_entity.pos.x = StepsManager.blockslist[4].pos.x;
    player_entity.pos.y = StepsManager.blockslist[4].pos.y - player_entity.size.y;
    mainviewport.set_target(player_entity);
    entitylist.push(player_entity);
}

//Initilization function
function init()
{    
    let ts1 =new Sprite( resources.get(images.tile1),0,0,0,0);
    let ts2 =new Sprite( resources.get(images.tile2),0,0,0,0);
    tiles = [ts1,ts2];
    uiEntityList = onhoverlist;
    let pa = new SpriteAnimation(images.player2,0,0,[0,1,2,3,4],100,131,12,1);
    //let pa = new SpriteAnimation(images.player,0,0,[0,1,2,3,4],485,638,12,1);
    pa.loop = true;
    pa.play=false;
    player_entity = new Player(pa);
    player_entity.size.x = 100;
    player_entity.size.y = 131;

    mainviewport = new ViewPort(-100,-100,cavMain.width,cavMain.height);
    StepsManager = new Blockhandler();
    StepsManager.generateblocks();
    StepsManager.addblockstogame();

    player_entity.pos.x = StepsManager.blockslist[4].pos.x;
    player_entity.pos.y = StepsManager.blockslist[4].pos.y - player_entity.size.y;
    
    mainviewport.set_target(player_entity);
    
    entitylist.push(player_entity);

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;

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

            mainviewport.update();
            StepsManager.update();

            entitylist.forEach(e=>{
                e.updateMain(); 
                draw(e);              
            });
            

            drawCall(()=>{
            cxt.textAlign = "center";
            cxt.strokeStyle = "#ffffff";             
            cxt.font = "bold 80px Nepali";   
            cxt.fillStyle = text_color;
            cxt.font = "bold 80px Nepali";
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
            cxt.fillStyle = text_color; 
            cxt.textAlign = "center"; 
            cxt.fillText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px Nepali";
            cxt.fillStyle = pause_text_color; 
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
            cxt.fillStyle = text_color; 
            cxt.textAlign = "center"; 
            cxt.fillText("YOUR SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px Nepali";
            cxt.fillStyle = pause_text_color;            
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

class ViewPort {
    constructor(posx,posy,width,height)
    {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.zoomValue = 1;
        this.xmin = this.posx,
        this.xmax = this.posx+this.width;
        this.ymin = this.posy,
        this.ymax = this.posy+this.height;
        this.target = null;
        this.targetoffset = null;
        this.update = () => {
            if(this.target!=null)
            {             
                let dx = (this.target.pos.x - this.targetoffset[0]) - this.posx; 
                let dy = (this.target.pos.y - this.targetoffset[1]) - this.posy; 
                this.posx += dx * 0.1;
                this.posy += dy * 0.2;
            }
            this.xmin = this.posx,
            this.xmax = this.posx+ this.width;
            this.ymin = this.posy,
            this.ymax = this.posy+this.height;
        }
        this.set_target = (target) => {
            this.target = target;
            this.targetoffset = [ target.pos.x - this.posx , target.pos.y - this.posy];
        }
    }
}


class Player extends Entity{
    constructor (sprite){
        super(sprite,0,0);

        this.state = "idle";
        this.playerpressed = false;
        this.prev_pos = [];
        this.collidedobjects = [];
        this.jp = 0;
        this.speed =[0,0];
        this.timer = 0;
        this.target_pos_x = null;
        this.haslanded = true;

        this.update= () => {
            this.timer +=dt;
            
            switch(this.state)
            {
                case "idle":
                    if(this.timer>0.3)
                    {
                    this.timer = 0;
                    this.state = "takeoff"
                    this.sprite.currentframe = 1;
                    }
                    break;
                case "takeoff":
                    if(this.timer>0.2)
                    {
                    this.timer =0;
                    this.jump();
                    this.state = "up"
                    this.haslanded = false;
                    this.sprite.currentframe = 2;
                    }
                    break;
                case "up":
                    if(this.speed[1]>-400)
                    {
                    this.state = "top";
                    this.sprite.currentframe = 3;
                    }
                    break;
                case "top":
                    if(this.speed[1]>100)
                    {
                    this.state = "";
                    this.sprite.currentframe = 4;
                    }
                    break;
                case "down":
                    if(this.timer > 0.1)
                    {
                    this.state = "idle";
                    this.sprite.currentframe = 0;
                    }
                    break;
                default:
                    break;
            }         
            

            this.pos.x += this.target_pos_x!=null && this.collidedobjects.length>0?(this.target_pos_x - this.pos.x) * 0.1:0;
            
            
            if(this.collidedobjects.length == 0)
            {
            this.speed[1] += this.speed[1]>0?dt * 10 * 100*4 : dt * 10 * 100*2;
            }
            
            this.pos.x += this.speed[0]*dt;
            this.pos.y += this.speed[1]*dt;

            this.collidedobjects= this.collidedobjects.filter(e=>{
                if(physics.checkCollision(e,this))
                {
                    return e;
                }
            })

            entitylist.forEach(e => {
                if(e instanceof Block)
                {
                    if(physics.checkCollision(e,this))
                    {                        
                        this.speed = [0,0];
                        this.pos.y = e.pos.y - this.size.y; 
                        this.target_pos_x = e.pos.x - this.size.x/1.5 + e.size.x/2 ;                       
                        if(!this.haslanded)
                        {
                            this.state = "down";
                            this.timer = 0;
                            this.sprite.currentframe = 1;

                            this.haslanded = true;
                            
                            let TA = [resources.get(images.land),resources.get(images.land2)]
                            let tr = Math.floor(Math.random() * 2);
                            TA[tr].currentTime =0;
                            TA[tr].play();
                        }
                        
                        if(this.collidedobjects.indexOf(e) < 0)
                        {
                        this.collidedobjects.push(e);
                        }
                    }
                }
            });
        }
        this.draw = (context) => {
            
            if(this.enabled && !this.done){
                context.imageSmoothingEnabled = true;
                this.sprite.draw(context,this.pos.x - mainviewport.posx ,this.pos.y - mainviewport.posy,this.size.x,this.size.y);  
                } 
            }
        this.normaljump = () => {
                player_entity.speed = [190,-800];
                player_entity.target_pos_x = player_entity.pos.x;
        }  
        this.playerjump = () => {            
            resources.get(images.hop_1).currentTime = 0;
            resources.get(images.hop_1).play();
              
            player_entity.speed = [295,-1100];
            player_entity.target_pos_x = player_entity.pos.x;
            
        }
        this.jump = () => {           
                let TA = [resources.get(images.takeoff),resources.get(images.takeoff2)]
                let tr = Math.floor(Math.random() * 2);
                TA[tr].currentTime =0;
                TA[tr].play();
                if(this.playerpressed)
                {
                    this.playerjump();
                    this.playerpressed = false;
                }
                else
                {
                    this.normaljump();
                }
        }              
    }
}


class Blockhandler {
    constructor()
    {
        this.blockslist = [];
        this.offseted = [];
        this.spawnedbefore = false;
        this.generateblocks = ()=>{
            this.blockslist = [];
            let blockscount = Math.ceil(cavMain.width/resources.get(images.tile1).width)+1;
            for (let index = 0; index < blockscount; index++) {
                let u = new Block(Math.random()>0.5?images.tile1:images.tile2);
                u.size.x = 128;
                u.pos.x = index * u.size.x;
                u.pos.y = cav.height - (index*93);
                u.obstacle = null;
                this.blockslist.push(u);
            }
        }
        this.update = () => {
           
            while(true)
            {
                if(this.blockslist[0].pos.x + this.blockslist[0].size.x < mainviewport.xmin)
                {
                    let u = this.blockslist.shift();
                    u.obstacle = null;
                    u.coin = null;
                    u.pos.x = this.blockslist[this.blockslist.length-1].pos.x + this.blockslist[this.blockslist.length-1].size.x;
                    u.pos.y = this.blockslist[this.blockslist.length-1].pos.y - 93;
                    
                    u.sprite = Math.random()>0.5?tiles[0]:tiles[1];                     
                    
                    if(Math.random() < game_properties.odds && !this.spawnedbefore)
                    {
                        let to = new Obstacle(images.o1);
                        to.size.x = u.size.x * 0.9;
                        u.setobs(to); 
                        this.spawnedbefore = true; 
                        game_properties.odds = 0.3; 
                        let tc = new Coin();
                        u.setcoin(tc);                        
                    }
                    else
                    {
                        game_properties.odds += 0.05;
                        this.spawnedbefore = false; 
                    }
                    this.blockslist.push(u);
                }
                else
                {
                    break;
                }
            }            
        }
        this.addblockstogame = () => {
            entitylist = entitylist.filter(e=>{
                if(this.blockslist.indexOf(e) < 0)
                {
                    return e;
                }                
            })
            entitylist = entitylist.concat(this.blockslist);
        }
    }
}

class Block extends Entity {
    constructor(sprite)
    {
        super(sprite,0,0);
        this.obstacle = null;
        this.coin = null;
        this.draw = (context) => {        
        if(this.enabled && !this.done){
            if(this.obstacle!=null)
            this.obstacle.draw(context);

            //if(this.coin!=null)
            //this.coin.draw(context);

            this.sprite.draw(context,this.pos.x - mainviewport.posx ,this.pos.y - mainviewport.posy,this.size.x,this.size.y);  
            } 
        }
        this.update= ()=> {
            if(this.obstacle!=null)
            this.obstacle.updateMain();
            if(this.coin!=null)
            this.coin.updateMain();
        }
        this.setobs = (ob) => {
            this.obstacle = ob;
            ob.pos.x = this.pos.x+ this.size.x * 0.1;
            ob.pos.y = this.pos.y - ob.size.y;
        }
        this.setcoin = (ob) => {
            this.coin = ob;
            ob.pos.x = this.pos.x + this.size.x + this.size.x/2;
            ob.pos.y = this.pos.y - 93 - 10;
        }
    }
}

class Obstacle extends Entity{
    constructor(sprite)
    {
        super(sprite,0,0);
        this.update=() => {
            if(physics.checkCollision(player_entity,this))
            {                
                resources.get(images.GO).currentTime =0;
                resources.get(images.GO).play();
                gameOver();
            }
        }
        this.draw = (context) => {
            if(this.enabled && !this.done){
                this.sprite.draw(context,this.pos.x - mainviewport.posx ,this.pos.y - mainviewport.posy,this.size.x,this.size.y);  
                } 
            }
    }

}

class Coin extends Entity{
    constructor()
    {
        super(null,40,40);
        this.order = 10;
        this.update=() => {
            if(physics.checkCollision(player_entity,this))
            {    
                resources.get(images.coin).currentTime =0;
                resources.get(images.coin).play();            
                game_properties.Score++;
                this.enabled = false;
            }
        }
        this.draw = (context) => {
            if(this.enabled && !this.done){
            context.fillStyle = "#ff0000";
            context.fillRect(this.pos.x - this.size.x/2- mainviewport.posx,this.pos.y - this.size.y/2- mainviewport.posy,this.size.x,this.size.y);
            }
        }; 
    }
    

}

document.addEventListener("visibilitychange", function() {
    if(document.hidden && currentGameState== gameStates.game)
    {
        currentGameState = gameStates.pause;
        loadpauseUI()
    } 
});