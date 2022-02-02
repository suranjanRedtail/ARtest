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
    
    heart_full : "./assets/sprites/hpfull.png",
    heart_empty : "./assets/sprites/top.png",

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
    Enemy_speed : 150,
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

var topbar,healthfull;

var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var nextchar = 0;

var timer = 0;
var nexttimer =2;

var text_color = "#ff0078";
var outline_color = "#ffffff";
var score_color = "#ff0078";


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
    entitylist.push(topbar);
    entitylist.push(healthfull);
    nextchar=0;
}

//Initilization function
function init()
{
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    topbar = new Entity(images.heart_empty);
    topbar.order =0.1;
    healthfull = new topHealth();
    healthfull.pos.x = 153;
    healthfull.pos.y = 37;

    entitylist.push(topbar);
    entitylist.push(healthfull);

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
            game_properties.Enemy_speed += dt * 0.05;

            if(game_properties.life<=0)
            {
                gameOver();
                playSound(images.GameOver);
            }

            if(timer > nexttimer)
            {
                let ti=Math.floor(Math.random()*26);
                ti = Math.random()>0.95?nextchar:ti;
                let t = new Alphabet(ti );                
                t.pos.x = (cav.width-70) * Math.random();
                entitylist.push(t);
                nexttimer += 0.5;
            }            

            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });            
            mainviewport.update(); 

            drawCall(()=>{
                cxt.textAlign = "end";                
                cxt.strokeStyle = outline_color;
                cxt.font = "bold 55px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-50,60);
                cxt.strokeText(chars[nextchar],cav.width-50,130);
                cxt.fillStyle = score_color;
                cxt.font = "bold 55px GameFont"; 
                cxt.fillText(game_properties.Score,cav.width-50,60);
                cxt.fillText(chars[nextchar],cav.width-50,130);
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

        mainviewport.update();  

        entitylist.forEach(e=>{
            //e.updateMain();
            draw(e);  
                        
        });

        drawCall(()=>
            {
            cxt.font = "70px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + 500/2-50);
            cxt.fillStyle = text_color; 
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 500/2 + 70 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 500/2 + 140);
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
    constructor(id)
    {

        super(null,80,90);
        this.id = id;
        this.text = chars[id];
        this.pos.y = cav.height+this.size.y;

        this.update = ()=>{

            this.pos.y -= game_properties.Enemy_speed * dt;
            if(topbar.size.y - this.pos.y >= this.size.y){
                this.enabled = false;
                if(this.id == nextchar)
                {
                    game_properties.life--;
                    playSound(images.GameOver);
                }                
                
            }
        }

        this.draw =(context)=>{
            if(this.enabled && !this.done)
            {                
                context.font = "90px GameFont";
                context.strokeStyle = "#ffffff";
                context.fillStyle = "#ff0078";
                context.lineWidth =8;
                context.strokeText(this.text,this.pos.x,this.pos.y+this.size.y);
                context.fillText(this.text,this.pos.x,this.pos.y+this.size.y);
                

                cxt.textAlign = "start";
            }                        
        }        

        Engine.onClick.push(this);

        this.onClick = ()=>{           
            if(Physics.checkCollisionPoint(this,{x:mousePos[0],y:mousePos[1]}))
            {            
                    if(nextchar == this.id)
                    {
                        if(nextchar==25)
                        {
                            game_properties.streak++;
                        }
                        nextchar=  (nextchar+1)%26;
                        game_properties.Score+= 10*game_properties.streak;
                        playSound(images.coin);
                    }
                    else
                    {
                        game_properties.life--;
                        playSound(images.GameOver);
                    }
                    this.enabled = false;                
            }
        }

    }
}

class topHealth extends Entity{
    constructor()
    {
        super(images.heart_full);
        this.precent=1;
        this.order=0.2;
        this.update = ()=>{
            this.precent = Math.min(Math.max((game_properties.life+2) /12,0),1);
        }
        this.draw = (context)=>{

            context.imageSmoothingEnabled = !this.ispixel;
            context.drawImage(this.sprite.image, this.sprite.posX, this.sprite.posY, this.sprite.width *this.precent , this.sprite.height, this.pos.x, this.pos.y, this.sprite.width *this.precent, this.size.y);
            
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