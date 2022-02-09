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
    GameOver : "./assets/sound/game_over.wav",
    board : "./assets/sprites/board.png",    
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png",
    help : "./assets/sprites/help.png",

    player : "./assets/sprites/animations/player_50_40.png",
    bat : "./assets/sprites/animations/bat_35.png",
    fore_ground : "./assets/sprites/fore_ground.png",
    fore_ground_top : "./assets/sprites/fore_ground_top.png",
    fore_ground_rock : "./assets/sprites/fore_ground_2.png",
    road : "./assets/sprites/road.png",
    road_top_rocks : "./assets/sprites/top_back_rock.png",
    water : "./assets/sprites/water.png",
    water_bones : "./assets/sprites/water_bone.png",
    skelly : "./assets/sprites/skelly.png",
    rock_front : "./assets/sprites/rock_front.png",
    ball_sack : "./assets/sprites/rock_back.png",
    back_rocks : "./assets/sprites/back_rocks.png",
    back_rocks_deeper : "./assets/sprites/back_rocks_deeper.png",
     
    BG : "./assets/sound/BG.mp3", 
    tap_1 : "./assets/sound/bounce.wav",
    jump_sfx : "./assets/sound/h2.wav",
    land_sfx : "./assets/sound/land.mp3",
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
    Score:0,
    game_time :0,
    enemy_speed : 300,
    Score : 0,
    real_score : 0,
    paralax_2_amt : 2,
    paralax_3_amt : 1.5,
    jump_height : 125,
    jump_length : 300,
    player_speed : 300,
    has_ran :0,
    slide_duration : 1,
    jump_duration : 1,
    min_obs_dist : 500,
    Obs_dist : 1000,
        
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
var bone=null;
var foreground = null;

//player 
var player_entity;
var mainviewport;


var fishsprites;
var enemy_sprites =[];

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

    player_entity.pos.x = cav.width*0.2 - player_entity.size.x/2;
    player_entity.issliding = false;
    player_entity.jump_timer = 0;

    mainviewport.posx = 0;
    next_obs = player_entity.pos.x + cav.width*2;
    bone.reset();
    foreground.reset();
    
    entitylist.push(player_entity);
    entitylist.push(bone);
    entitylist.push(foreground);
    
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);


    for (let index = 0; index < 4; index++) {
        let t = new Sprite( images.obstacles,133 * index,0,133,133);
        //enemy_sprites.push(t);        
    }

    player_entity = new Player();
    player_entity.pos.x = cav.width*0.2 - player_entity.size.x/2;
    player_entity.pos.y = 380;
   
    bone = new Entity(images.water_bones);
    bone.size.x *= 4;
    bone.size.y *= 4;
    bone.order = -0.59;
    bone.sprite.ispixel = true;

    bone.pos.y = 112*4;
    bone.update = ()=>{
        bone.pos.x += dt * 100;
        if(bone.pos.x + bone.size.x < mainviewport.posx)
        {
            bone.reset();
        }
    }
    bone.reset = ()=>{
        bone.pos.x = player_entity.pos.x + cav.width*(Math.random()+1);
    }

    foreground = new Entity(images.fore_ground_rock);
    foreground.size.x *= 4;
    foreground.size.y *= 4;
    foreground.order = 0.4;
    foreground.sprite.ispixel = true;
    foreground.update = ()=>{
        foreground.pos.x -= dt * 200;
        if(foreground.pos.x + foreground.size.x < mainviewport.posx)
        {
            foreground.reset();
        }
    }
    foreground.reset = ()=>{
        foreground.pos.x = player_entity.pos.x + cav.width*(Math.random()+2);
    }
    //resources.get(images.running_loop).loop = true;
    bone.reset();
    foreground.reset();

    entitylist.push(player_entity);
    entitylist.push(bone);
    entitylist.push(foreground);
    next_obs = player_entity.pos.x + cav.width*2;  

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    mainviewport.set_target(player_entity);
    mainviewport.lock_y = true;

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
    
    var helpAnimation = new Sprite(images.help); 
    helpAnimation.ispixel = true;
    help = new Entity(helpAnimation,0,0,true);
    help.size.x *= 3;
    help.size.y *=3;
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
            game_properties.player_speed += dt * 3;
            game_properties.Score = Math.floor(player_entity.pos.x/100);

            // if(timer>nexttimer)
            // {
            //     entitylist.push(new Obstacle( Math.floor(Math.random()*1.99) ));
            //     timer = 0;
            //     nexttimer = 1 + Math.random()*4;                
            // }
            if(next_obs - player_entity.pos.x < cav.width)
            {
                entitylist.push(new Obstacle( Math.floor(Math.random()*1.99) ));
                next_obs += game_properties.min_obs_dist + (Math.random() * game_properties.Obs_dist);
            }


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = outline_color;             
                cxt.font = "bold 100px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,95);
                cxt.fillStyle = score_color;
                cxt.font = "bold 100px GameFont";
                cxt.fillText(game_properties.Score,cav.width-100,95);  
                cxt.textAlign = "start";  

                },2);
           
            

            help.updateMain();
            draw(help);
            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                draw(e);
                if(e.type != null)
                {
                    e.updateMain();
                }
            })

            drawCall(()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "100px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 );
            cxt.font = "100px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 70);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 
        game_properties.game_time += dt;  
        entitylist.forEach(e=>{
            if(! (e instanceof Player) ){
            //e.updateMain();
            draw(e);
            }
        });

        drawCall(()=>
            {
            cxt.font = "100px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "100px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 50 );
            cxt.font = "100px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 120);
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
        let player_sprite = new SpriteAnimation(images.player,0,0,getArrayFromRange(1,8),50,40,10,1);
        player_sprite.ispixel = true;
        super(player_sprite);
        this.jump_sprite = new SpriteAnimation(images.player,0,0,getArrayFromRange(9,11),50,40,10,1);
        let slide_sprite = new SpriteAnimation(images.player,0,0,[0],50,40,1,1);
        slide_sprite.ispixel = true;
        this.jump_sprite.play = false;
        this.jump_sprite.ispixel = true;
        this.size.x = 50*4;
        this.size.y = 40*4;
        this.jump_length=400;
        this.jump_start = -5000;
        this.jump_height = 100;
        this.isjumping = false;
        this.issliding = false;
        this.jump_slide = false;
        this.slide_timer = 0;
        this.jump_timer = 0;

        this.init = ()=>{
            this.sprite.currentframe = 0;
        }

        this.update = ()=>{
            player_sprite.speed = game_properties.player_speed/game_properties_initial.player_speed;
            this.pos.x += game_properties.player_speed * dt;
            if(!this.isjumping)
            {                
            }

            if(this.issliding)
            {
                if(this.isjumping)
                {
                    //this.jump_start -= dt* game_properties.player_speed/2;
                    this.jump_timer -= dt;
                    this.jump_slide = true;
                }
                else if(this.jump_slide)
                {
                    this.pos.x += dt * 100;
                }
                else
                {
                    this.pos.x -= dt * game_properties.player_speed * 0.1;
                }
                this.pos.x -= Math.random() * dt * game_properties.player_speed * 0.1;
                this.sprite = slide_sprite;
                this.slide_timer -= dt;
                
                if(this.slide_timer <=0)
                {
                    this.issliding=false;
                    this.jump_slide = false;                    
                }
            } 
            //let jump_percent = (this.pos.x - this.jump_start)/this.jump_length;
            let jump_percent = 1 - (this.jump_timer/game_properties.jump_duration);
            if(jump_percent<1)
            {
                this.sprite = this.jump_sprite;
                this.jump_sprite.currentframe = this.jump_sprite.keyframes[jump_percent<=0.1?0:jump_percent<=0.6?1:2];
                this.pos.y = 400 - Math.sin(Math.PI * jump_percent)*this.jump_height;
                this.isjumping =true;
                this.jump_timer -= dt;
            }
            else
            {
                if(this.isjumping)
                {
                    resources.get(images.land_sfx).currentTime =0;
                    resources.get(images.land_sfx).play();
                    if(game_properties.player_speed>1000 && !this.issliding)
                    {
                    this.issliding = true;
                    this.slide_timer = game_properties.slide_duration/3;
                    }

                }
                if(!this.issliding)
                {
                this.sprite = player_sprite;
                }
                this.pos.y = 380;
                this.isjumping=false;
            }
                       
        }
        this.draw = (context) =>{
            if(this.enabled && !this.done){
                if(this.ui)
                {
                this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);       
                }
                else{            
                    this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                }      
            }
            if(game_properties.debug_mode)
            {
            drawcircle( this.radius,this.center);
            }
        }
        this.jump = (amnt=game_properties.jump_height,length=game_properties.jump_length) =>{
            if(this.isjumping)
            {
                return;
            }
            this.issliding = false;
            this.jump_timer = game_properties.jump_duration;
            this.jump_start = this.pos.x;
            this.jump_height = amnt;
            this.jump_length = length;
            resources.get(images.jump_sfx).currentTime =0;
            resources.get(images.jump_sfx).play();

            this.isjumping = true;            
            
            
        }
        this.slide = (duration = game_properties.slide_duration)=>{
            if(this.issliding)
            {
                return;
            }
            this.slide_timer = duration;
            this.issliding = true;
        }
        Engine.onSwipeUp.push( ()=>{if(currentGameState==gameStates.game){ this.jump()}});   
        Engine.onSwipeDown.push( ()=>{if(currentGameState==gameStates.game){ this.slide()}});        
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
        return this.size.y/4;
    }

}

class Obstacle extends Entity{
    constructor(type=0)
    {   
        if(type==0)
        {
            super(images.skelly);
        }
        else
        {
            super(images.rock_front);
            this.sprite_sack = new Sprite(images.ball_sack);
            this.sprite_sack.ispixel = true;
        }
        this.type = type;
        this.sprite.ispixel = true;
        this.pos.x = mainviewport.posx + cav.width; 
        this.pos.y = type==0?111:93;
        this.pos.y *=4;           
        this.size.x *= 4;
        this.size.y *= 4;
        this.order = 0.2;

        this.update = ()=>{
            if(this.pos.x + this.size.x < mainviewport.posx )
            {
                this.enabled = false;
            }
            let dist = Math.sqrt(  Math.pow (player_entity.center.x - this.center.x,2) + Math.pow (player_entity.center.y -  this.center.y,2));
        
            let distmax = this.radius + player_entity.radius;

            if(dist < distmax && currentGameState == gameStates.game)
            {   
                if( type ==1 && player_entity.issliding && !player_entity.isjumping){
                    player_entity.slide_timer += dt/2;
                }
                else
                {
                resources.get(images.GameOver).currentTime =0;
                resources.get(images.GameOver).play();
                gameOver();
                }                
            }

            if(type==0)
            {
                drawCall( ()=>
                {            
                    this.sprite.draw(cxt,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                }
                ,this.order);
            }
            else if(type==1)
            {
                drawCall( ()=>{
                    this.sprite.draw(cxt,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                },0.1);

                drawCall( ()=>{    
                    this.sprite_sack.draw(cxt,this.pos.x- mainviewport.posx- (10*4),this.pos.y- mainviewport.posy+(7*4),this.sprite_sack.width*4,this.sprite_sack.height*4);
                },-0.1);
            }
        }

        this.draw = (context) =>{
            if(game_properties.debug_mode)
            {
            drawcircle( this.radius,this.center);
            }
        }
    }
    get center()
    {
        return {
            x:this.type==0?this.pos.x + this.size.x/2:this.pos.x + this.size.x/2.5
            ,y:this.pos.y + this.size.y/2
        };
    } 
    get radius()
    {
        return this.type==0?this.size.y/2:this.size.y/2.5;
    }
}

class Flag extends Entity{
    constructor()
    {
        let f_image = new SpriteAnimation(images.flag,0,0,[0,1,2,3],13,34,6,1);
        f_image.ispixel = true;
        super(f_image)
        this.order = -0.1;
        this.size.x *= 4;
        this.size.y *= 4;
        this.pos.x = mainviewport.posx + mainviewport.width;
        this.pos.y = 400  + player_entity.size.y*0.5 -  this.size.y;
        this.update = () => {
            if(this.pos.x + this.size.x < mainviewport.posx)
            {
                this.pos.x = mainviewport.posx + mainviewport.width + 100 +Math.random()*1280*2;
            }
        }
    }
}



function DrawBackground()
{        
    let p1 = resources.get(images.road);
    let p2 = resources.get(images.road_top_rocks);
    let p3 = resources.get(images.water);
    let p4 = resources.get(images.back_rocks);
    let p5 = resources.get(images.back_rocks_deeper);
    let p6 = resources.get(images.fore_ground_top);
    let p7 = resources.get(images.fore_ground);
    let p8 = resources.get(images.Background);
    
    let p1x = - Math.floor(mainviewport.posx % cav.width); 
    let p2x = - Math.floor((mainviewport.posx/1.1) % cav.width);
    let p3x = - Math.floor((mainviewport.posx/1.5) % cav.width);
    let p4x = - Math.floor((mainviewport.posx/2) % cav.width);
    let p5x = - Math.floor((mainviewport.posx/2.5) % cav.width);
    let p6x = - Math.floor((mainviewport.posx/0.5) % cav.width);
    let p8x = - Math.floor((mainviewport.posx/5) % cav.width);

    // drawCall(()=>{ 
    //     cxt.imageSmoothingEnabled = false;
    //     cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
    // },-2);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p8,p8x,0-mainviewport.posy,cav.width,cav.height);
        if(p8x + cav.width <= cav.width)
        {
            cxt.drawImage(p8,p8x+cav.width-1,0,p8.width * 4,p8.height * 4); 
        } 
    },-2);
    

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p1,p1x,0-mainviewport.posy,cav.width,cav.height);
        if(p1x + cav.width <= cav.width)
        {
            cxt.drawImage(p1,p1x+cav.width-1,0,p1.width * 4,p1.height * 4); 
        } 
    },-0.5);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p2,p2x,0,p2.width*4,p2.height*4);
        if(p2x + cav.width <= cav.width)
        {
            cxt.drawImage(p2,p2x+cav.width-1,0,p2.width*4,p2.height*4); 
        } 
    },-0.6);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p3,p3x,416,p3.width*4,p3.height*4);
        if(p3x + cav.width <= cav.width)
        {
            cxt.drawImage(p3,p3x+cav.width-1,416,p3.width*4,p3.height*4); 
        } 
    },-0.6);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p4,p4x,0,p4.width*4,p4.height*4);
        if(p4x + cav.width <= cav.width)
        {
            cxt.drawImage(p4,p4x+cav.width-1,0,p4.width*4,p4.height*4); 
        } 
    },-0.7);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p5,p5x,0,p5.width*4,p5.height*4);
        if(p5x + cav.width <= cav.width)
        {
            cxt.drawImage(p5,p5x+cav.width-1,0,p5.width*4,p5.height*4); 
        } 
    },-0.8);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p6,p6x,0,p6.width*4,p6.height*4);
        if(p6x + cav.width <= cav.width)
        {
            cxt.drawImage(p6,p6x+cav.width-1,0,p6.width*4,p6.height*4); 
        } 
    },0.5);

    drawCall(()=>{ 
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p7,0,540,p7.width*4,p7.height*4);
    },0.5);
    
}

function drawcircle(radius,center)
{
    cxt.beginPath();
    cxt.arc(center.x - mainviewport.posx,center.y-mainviewport.posy,radius,0,Math.PI*2);
    cxt.strokeStyle ="#FF0000";
    cxt.lineWidth = 5;
    cxt.stroke();
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