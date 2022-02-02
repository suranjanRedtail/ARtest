var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");

var game_orientation = 1;

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
    
    block : "./assets/sprites/block.png",
    ball : "./assets/sprites/ball.png",
    platforms : "./assets/sprites/Ground.png",
    pipes : "./assets/sprites/pipes.png",
    warning : "./assets/sprites/warning.png",
    jump : "./assets/sound/jump.mp3",

    BG : "./assets/sound/BG.mp3", 
    GameOver : "./assets/sound/game_over.wav",
    coin : "./assets/sound/coin.wav"
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
    Score : 0,
    real_score : 0,
    player_speed : 200,
    Enemy_speed : 100,

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
var pipes=
        [
            236,
            391,
            539,
            12,
        ];


var timer = 0;
var nexttimer =2;


var text_color = "#ffffff";
var outline_color = "#000000";
var score_color = "#ffffff";


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
            setTimeout( ()=>{resources.get(images.BG).currentTime=0;
                resources.get(images.BG).play();},50);
            
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
        player_entity.pause_flag=true;

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

    mainviewport.posx = 0;
    player_entity.posTrue = {x:0,y:0};
    player_entity.posOffset = {x:42,y:420};    
    
    next_obs = cav.width + 500;
    
    entitylist.push(player_entity);    
}

//Initilization function
function init()
{
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    player_entity = new Player();

    entitylist.push(player_entity); 


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

            if(timer > nexttimer)
            {
                entitylist.push(new Ball());
                timer =0;
                nexttimer=  1*(Math.random()+1);
            }            
            


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });            
            mainviewport.update(); 

            drawCall(()=>{
                cxt.textAlign = "end";
                cxt.strokeStyle = outline_color;             
                cxt.font = "bold 70px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-60,95);
                cxt.fillStyle = score_color;
                cxt.font = "bold 70px GameFont";
                cxt.fillText(game_properties.Score,cav.width-60,95);  
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
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + 500/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 500/2 + 50 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 500/2 + 120);
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
        super(images.block);
        this.target_location_x = 589;
        this.y_bound = 538; 
        this.pos.x = 589;
        this.pos.y = 538;
        this.posTrue = Object.assign({},this.pos);
        this.speed = 500;
        this.x_caps = [117,1067];
        this.pause_flag = false;
        this.state = 0;
        this.jump_timer =  0;
        this.jump_duration = 0.75;


        this.update = ()=>{
            if(this.state == 1)
            {
                this.jump_timer += dt;
                
                let t = this.jump_timer/this.jump_duration;
                if(t<=1)
                {
                this.pos.y = this.y_bound - (Math.sin( Math.PI * t ) * 410);
                }
                else
                {
                    this.pos.y = this.y_bound;
                    this.state = 0;
                }                
            }

            if(!this.pause_flag)
            {
                this.target_location_x = mousePos[0]-this.size.x/2;
            }           
            
            let delta_x = this.target_location_x -this.pos.x;
            if(  Math.abs(delta_x)>1)
            {
                let delta = delta_x * 0.1;
                this.pos.x += Math.abs(delta)>this.speed*dt?this.speed*dt*Math.sign(delta_x):delta;

            }
            else
            {
                this.pos.x = this.target_location_x;
            }            
            this.pos.x = clamp(this.pos.x,this.x_caps[0],this.x_caps[1]);
        }

        this.jump = ()=>{
            if(this.state == 0)
            {
                this.jump_timer=0;
                this.state =1;
                resources.get(images.jump).currentTime=0;
                resources.get(images.jump).play();                
            }
        }

        Engine.onMouseUp.push(()=>{ 
        if(currentGameState == gameStates.game)
            {
                this.jump();
            }
        });
        Engine.onSwipe.push(()=>{ 
            if(currentGameState == gameStates.game)
                {
                    this.jump();
                }
            });
    }

    get center(){
        return {
            x: this.pos.x + this.size.x/2,
            y: this.pos.y + this.size.y/2,
        }
    }
    get radius(){
        return this.size.x/2;
    }
    
}

class Ball extends Entity{
    constructor()
    {
        super(images.ball,100,100);
        this.state = 0;
        this.pos = {x:1180,y:75};
        this.speed = -1000 + (Math.random()*400 * (Math.random()>0.5?-1:1));
        this.timer =0;
        this.timerdur =0;
        this.warning = null;
        this.warning_interval = null;
        this.pipeIndex=0;
        this.vibrated=false;
        this.update =() => {           
            if(this.state==0 || this.state == 2)
            {
                this.pos.x += this.speed * dt;
            }
            if(this.state==0 && this.pos.x <=0)
            {
                this.state = 1;
                this.timer =0;
                //this.timerdur = 0;
                this.timerdur = 1+Math.random()*2; 
                this.pipeIndex = Math.floor(Math.random()*2.9999);

                this.warning=new Entity(images.warning);
                this.warning.pos = {x:126,y:pipes[this.pipeIndex]+pipes[3]};
                entitylist.push(this.warning);
                
                this.warning_interval = setInterval(() => {
                    this.warning.opacity = 0.5 + Math.sin((game_properties.game_time*5) %Math.PI)*0.5;                    
                }, dt*1000);
            }
            if(this.state==1)
            {
                this.timer += dt;
                if(!this.vibrated&& this.timerdur-this.timer<=0.25)
                {
                    navigator.vibrate(500);
                    this.vibrated=true;
                }
                if(this.timer>= this.timerdur)
                {
                    this.state = 2;
                    this.pos.y = pipes[ this.pipeIndex];
                    this.speed = Math.sign(this.speed)*-1*1500;                    
                    clearInterval(this.warning_interval);
                    this.warning.enabled=false;
                    this.warning=null;                    
                }
            }
            if(this.state==2 && this.pos.x >= cav.width)
            {
                this.enabled=false;
            }
            

            if(Physics.checkCollisionCircle(this,player_entity))
            {
                if(this.state == 0)
                {
                    game_properties.Score += 50;
                    resources.get(images.coin).currentTime=0;
                    resources.get(images.coin).play(); 
                    this.die();
                }
                else
                {
                    gameOver();
                    resources.get(images.GameOver).currentTime=0;
                    resources.get(images.GameOver).play();
                }
            }
        }
        this.die = ()=>{
            this.enabled = false;
        }
        
    } 
    get center(){
        return {
            x: this.pos.x + this.size.x/2,
            y: this.pos.y + this.size.y/2,
        }
    }
    get radius(){
        return this.size.x/2;
    }
}

function DrawBackground()
{     
    // let p1 = resources.get(images.mountains);
    // let p2 = resources.get(images.hills);
    // let p3 = resources.get(images.lake);
    // let p4 = resources.get(images.road);
    // let p5 = resources.get(images.fences);
    // let p6 = resources.get(images.fences_front);

    // let p1x = - Math.floor((mainviewport.posx/2) % p1.width);
    // let p2x = - Math.floor((mainviewport.posx/1.8) % p2.width);
    // let p3x = - Math.floor((mainviewport.posx/1.2) % p3.width);
    // let p4x = - Math.floor((mainviewport.posx/1) % p4.width);
    // let p5x = - Math.floor((mainviewport.posx+200/1) % p5.width);
    // let p6x = - Math.floor((mainviewport.posx/1) % p6.width);

    let b0 = resources.get(images.Background);
    let b1 = resources.get(images.platforms);
    let b2 = resources.get(images.pipes);
    drawCall(
        ()=>{ 
            cxt.drawImage(b0,0,0,b0.width,b0.height);  
            cxt.drawImage(b1,0,cav.height-b1.height,b1.width,b1.height);             
    },-2); 

    drawCall(
        ()=>{ 
            cxt.drawImage(b2,0,66,b2.width,b2.height);             
    },0.5);

    // drawCall(
    //     ()=>{
    //     cxt.imageSmoothingEnabled = false;
    //     cxt.drawImage(p1,p1x,78,p1.width,p1.height);
    //     if(p1x + cav.width <= cav.width)
    //     {
    //         cxt.drawImage(p1,p1x+p1.width-1,78,p1.width ,p1.height ); 
    //     } 
    // },-1.9);

     
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