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
    
    BG : "./assets/sound/BG.mp3", 
    GameOver : "./assets/sound/game_over.wav",
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
    player_speed : 300,
    jump_height : 100,
    jump_lenght : 200,

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

var jump_pattern = (o)=>{
    entitylist.push(new Box(o,0));
    let rand_roll = Math.floor( Math.random()*3.99);
    switch (rand_roll)
    {
        case 0:
            break;
        case 1:
            entitylist.push(new Box(1-o,0));
            break;
        case 2:
            entitylist.push(new Box(1-o,1));
            break;
        case 3:
            entitylist.push(new Box(1-o,2));
            break;
        case 3:
            entitylist.push(new Box(1-o,0));
            entitylist.push(new Box(1-o,2));
            break;
        default:
            break;
    }
}

var duck_pattern = (o)=>{
    let rand_roll = Math.random()>0.5;
    let rand_roll_2 = Math.random()>0.5;
    if(rand_roll)
    {
        entitylist.push(new Box(o,1));
        if(rand_roll_2)
        {
            entitylist.push(new Box(1-o,0));
        }
    }
    else
    {
        entitylist.push(new Box(o,0));
        entitylist.push(new Box(o,2));
        if(rand_roll_2)
        {
            entitylist.push(new Box(1-o,0));
        }
    }
}

var skip_pattern = (o)=>{
    entitylist.push(new Box(o,2));
    let rand_roll = Math.floor( Math.random()*3.99);
    switch (rand_roll)
    {
        case 0:
            break;
        case 1:
            entitylist.push(new Box(1-o,0));
            break;
        case 2:
            entitylist.push(new Box(1-o,1));
            break;
        case 3:
            entitylist.push(new Box(1-o,2));
            break;
        case 3:
            entitylist.push(new Box(1-o,0));
            entitylist.push(new Box(1-o,2));
            break;
        default:
            break;
    }
}


var timer = 0;
var nexttimer =2;

var next_obs = 0;

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
    player_entity.posR = {x:35,y:400};
    player_entity.pos = {x:35,y:400};
    player_entity.state =0;
    player_entity.jump_start = -500;
    player_entity.sprite = player_entity.sprites[0];
    
    next_obs = cav.width + 1000;
    
    entitylist.push(player_entity);    
}

//Initilization function
function init()
{
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    player_entity = new Player();

    mainviewport.set_target(player_entity);
    mainviewport.lock_y = true;

    entitylist.push(player_entity); 

    next_obs = cav.width;

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
            
            game_properties.real_score += game_properties.player_speed * dt;
            game_properties.Score = Math.floor(game_properties.real_score/100);
            game_properties.player_speed += 2 * dt;

            if(next_obs - player_entity.pos.x < cav.width)
            {
                let to = Math.random()>0.5?0:1;
                let jd = Math.random()>0.5;
                if(Math.random() < 0.7)
                {
                if(jd)
                {
                    jump_pattern(to);
                }
                else
                {
                    duck_pattern(to);
                }
                }
                else
                {
                    skip_pattern(to);
                }
                
                next_obs +=  cav.width*(0.4 + Math.random()*0.3);
            }

            if(timer > nexttimer)
            {}            
            


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
        super(null,50,60);
        
        this.sprites = [
            new Sprite(images.player,0,0,50,61),
            new Sprite(images.player,50,0,50,61),
        ]
        this.sprite = this.sprites[0];

        this.pos.y = 400;
        this.pos.x = 35;
        
        this.state = 0;
        this.isjumping = false;
        
        this.posR = Object.assign({},this.pos);
        this.sizeR = Object.assign({},this.size);
        
        this.jump_start = 0;
        this.check_jump = false;
        
        this.animation_timer = 0;
        this.wooble_speed_multiplier = 20;

        this.update = () =>{
            this.animation_timer += dt;

            this.posR.x += game_properties.player_speed * dt;
            this.pos.x = this.posR.x;
            
            if(!this.isjumping)
            {
                let dy = Math.sin(this.animation_timer * this.wooble_speed_multiplier ) * this.sizeR.y * 0.05;
                switch(this.state)
                {
                    case 0:
                        this.pos.y = this.posR.y - dy;
                        this.size.y = this.sizeR.y + dy; 
                        break;
                    case 1:
                        this.pos.y = this.posR.y;
                        this.size.y = this.sizeR.y + dy;
                        break;
                }                
            }

            if(this.check_jump)
            {
                let jump_percent = (this.posR.x - this.jump_start)/game_properties.jump_lenght;
                if(jump_percent<=1)
                {
                    this.isjumping=true;
                    //jump_percent *= jump_percent>0.5? 1.1:1;
                    //jump_percent = clamp(jump_percent,0,1);
                    switch (this.state)
                    {
                        case 0:
                            this.pos.y = this.posR.y -  Math.sin(Math.PI * jump_percent)*game_properties.jump_height;
                            
                            break;
                        case 1:
                            this.pos.y = this.posR.y +  Math.sin(Math.PI * jump_percent)*game_properties.jump_height; 
                            break;
                    } 
                    this.size.y = this.sizeR.y - ( Math.sin(Math.PI * jump_percent) * this.sizeR.y * 0.1 ); 
                }
                else
                {
                    if(jump_percent >1.5)
                    {
                        this.check_jump = false;
                    }
                    if(this.isjumping)
                    {
                        this.isjumping=false;
                        this.animation_timer = 0;
                    }
                    
                }
            }
            
        }

        this.switchOrientation = ()=>{
            if(this.isjumping)
            {
                return;
            }
            this.animation_timer = 0;
            if(this.state == 0)
            {
                this.state = 1;
                this.posR.y = this.posR.y + this.sizeR.y +5;
                this.sprite = this.sprites[1];
            }
            else
            {
                this.state = 0;
                this.posR.y = this.posR.y - this.sizeR.y -5;
                this.sprite = this.sprites[0];
            }
        }

        this.jump = ()=>{
            if(!this.isjumping)
            {
                this.check_jump = true;
                this.jump_start = this.pos.x;
            }
        }

        Engine.onSwipe.push( (e)=>{
            switch(this.state)
                {
                    case 0:
                        if(e.direction == "up")
                        {   
                            this.jump();
                        }
                        else if(e.direction == "down")
                        {
                            this.switchOrientation();
                        }
                        break;
                    case 1:
                        if(e.direction == "up")
                        {
                            this.switchOrientation();
                        }
                        else if(e.direction == "down")
                        {
                            this.jump();
                        }
                        break;
                }
        })
    }

}

class Box extends Entity{
    constructor(side=0,pos=0)
    { 
        super(null,35,37);
        this.color = "#ff4d4d";
        this.pos.x = mainviewport.posx + mainviewport.width;
        this.pos.y = 460 + (side==0?-((pos+1)* 37):+(pos*37)+5);
        this.update =()=> {
            if(this.pos.x < mainviewport.posx - this.size.x)
            {
                this.enabled=false;
            }
            if(Physics.checkCollision(this,player_entity))
            {
                gameOver();
            }
        }  
        this.draw = (context) => {
            context.fillStyle = this.color;
            context.fillRect(this.pos.x-mainviewport.posx,this.pos.y-mainviewport.posy,this.size.x,this.size.y);
        }      
    } 
}

function DrawBackground()
{     
    let b0 = resources.get(images.Background);
    let b0x = - Math.floor((mainviewport.posx/3) % cav.width);

    drawCall(
        ()=>{ 
            cxt.imageSmoothingEnabled = false;
            cxt.drawImage(b0,0,0,cav.width,cav.height);   
            cxt.fillStyle = "#111111" 
            cxt.fillRect(0,460,cav.width,5);
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
}