var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

var NAME ="Harka";


const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}

how_to_lines= [
    "Click to jump from",
    "one rope to another.",
    "Collect honey, Avoid Bees!",
]

var last_platform;

//Object containing names of resources
var images = {
    Logo : (gamesandapp?actual_game_path:".")+"/assets/sprites/Title.png",
    Playbutton : (gamesandapp?actual_game_path:".")+"/assets/sprites/play.png",
    Pause : (gamesandapp?actual_game_path:".")+"/assets/sprites/pause.png",
    Playagain : (gamesandapp?actual_game_path:".")+"/assets/sprites/playagain.png",
    resume : (gamesandapp?actual_game_path:".")+"/assets/sprites/resume.png",
    blackdrop : (gamesandapp?actual_game_path:".")+"/assets/sprites/backdrop.png",
    whitedrop : (gamesandapp?actual_game_path:".")+"/assets/sprites/backdrop_w.png",
    board : (gamesandapp?actual_game_path:".")+"/assets/sprites/board.png",
    Background : (gamesandapp?actual_game_path:".")+"/assets/sprites/bg.png",
    P_L : (gamesandapp?actual_game_path:".")+"/assets/sprites/P_L.png",
    game_over_text : (gamesandapp?actual_game_path:".")+"/assets/sprites/gameover_text.png",
    //pause_text : (gamesandapp?actual_game_path:".")+"/assets/sprites/pause_text.png",
    music_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_on.png",
    effects_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_on.png",
    music_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_off.png",
    effects_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_off.png",
    howto : (gamesandapp?actual_game_path:".")+"/assets/sprites/how_to.png",

    harka: (gamesandapp?actual_game_path:".")+"/assets/sprites/sprite.png",
    bee1:(gamesandapp?actual_game_path:".")+"/assets/sprites/bee.png",
    bee2: (gamesandapp?actual_game_path:".")+"/assets/sprites/bee2.png",
    hives: (gamesandapp?actual_game_path:".")+"/assets/sprites/bg_2.png",
    ropes: (gamesandapp?actual_game_path:".")+"/assets/sprites/bg_3.png",
    honey : (gamesandapp?actual_game_path:".")+"/assets/sprites/honey.png",
    
    jump : (gamesandapp?actual_game_path:".")+"/assets/sound/jump.ogg",
    ding : (gamesandapp?actual_game_path:".")+"/assets/sound/ding.wav",
    BG : (gamesandapp?actual_game_path:".")+"/assets/sound/BG.ogg",
    GameOver : (gamesandapp?actual_game_path:".")+"/assets/sound/death.ogg",
    coin : (gamesandapp?actual_game_path:".")+"/assets/sound/coin.wav",
};

music_group = [
    images.BG,    
];

effects_group = [
    images.jump,
    images.coin,
    images.GameOver,    
    images.ding,
]

//game properties
game_properties = {  
    game_time :0,
    Enemy_speed : 150,
    life :10,
    unit_scale : 10,
    gravity: 200,
    player_jump_speed : 175,
    player_speed:50,

    platform_min: 200,
    platform_rand : 180,

    Score:0,   
    currentMax : 10,

    cp : 0,
    cmax : 20,
    TapPower : 2,
    
    debug_mode : false,
    base_exp: 100,
    drop : 0,
}





//game global variables
var player_entity;

var highScore=0;
var totalScore=0;

var timer = 0;
var nexttimer =2;

text_color = "#fdbc01";
outline_color = "#000000";
score_color = "#ffffff";
button_color = text_color;
notification_color = text_color;

ScoreOutline = false;

//custom game global variables
var ropes;
var player_sprites =[];
var obstacles = [images.honey,images.bee1,images.bee2];
var lanes = [160,364,568];


function init()
{  
    Engine.backgroundMode=0;
    player_sprites.push( new SpriteAnimation(images.harka,0,0,[0,1],window.resources.get(images.harka).width/4,window.resources.get(images.harka).height,5,1));
    player_sprites.push( new SpriteAnimation(images.harka,0,0,[2],window.resources.get(images.harka).width/4,window.resources.get(images.harka).height,2,1));
    player_sprites.push( new SpriteAnimation(images.harka,0,0,[3],window.resources.get(images.harka).width/4,window.resources.get(images.harka).height,2,1));
    player_sprites[0].play = true;
    player_sprites[0].loop = true;
    player_sprites[1].play = false;
    player_sprites[2].play = false;

    player_entity = new Player();
    ropes = new Entity(images.hives);
    player_entity.reset();

    Engine.onMouseUp.push(player_entity.onMouseup);

    entitylist.push(player_entity);
    entitylist.push(ropes);
}

var main = () =>{ 
    drawbackgroundCustom(timer);
    switch(currentGameState)
    {     
        case gameStates.menu:              
            game_properties.game_time += dt;        
            break;

        case gameStates.game:            
            timer += dt;
            game_properties.game_time += dt; 
            
            if(timer>=nexttimer)
            {
                let t = new Obstacle( Math.random()<0.3?0:Math.random()<0.5?1:2);
                t.pos.x = lanes[ Math.floor(Math.random()*lanes.length) ];    
                entitylist.push(t);           
                nexttimer += 1+Math.random();
            }
            

            entitylist.forEach(e=>{
                e.updateMain();
                window.draw(e);
            });            
            mainviewport.update(); 
            drawRopeCustom(timer);

                    

        break;
        case gameStates.pause:
            drawRopeCustom(timer);
            entitylist.forEach(e=>{
                window.draw(e);
            });
            break;
        case gameStates.gameover: 
        
        game_properties.game_time += dt;  

        mainviewport.update();  

        entitylist.forEach(e=>{
            //e.updateMain();
            //window.draw(e);                        
        });

        break;

        case gameStates.orientation:
            window.drawCall(()=>{
            cxt.fillStyle = "#ffffff";
            cxt.fillRect(0,0,cav.width,cav.height);
            cxt.drawImage(window.resources.get(images.P_L), Math.floor((cavMain.width/2)- (window.resources.get(images.P_L).width/2)),0,window.resources.get(images.P_L).width,window.resources.get(images.P_L).height);
            },11);
            break;
        default:         
        break;       
    }
}

function resetgame() {    
    game_properties = Object.assign({},game_properties_initial);
    SH.resetScore();

    player_entity.reset();
    
    entitylist =[];  

    entitylist.push(ropes);
    entitylist.push(player_entity);
}

DrawBackground=function()
{     
    //let b0 = window.resources.get(images.Background);
        
    window.drawCall(
        ()=>{ 
            //bxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2);     
}

class Player extends Entity{
    constructor()
    {
        super(player_sprites[0]);
        this.speed = 500;
        this.size = {
            x:this.size.x*0.8,
            y:this.size.y*0.8
        }

        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }
        this.lane = 1;
        this.state = 0;
        this.dir = -1;
        this.rotation = 0;
        this.pos.y = 1126;
        this.order = 0.1;

        this.reset =()=>
        {
            this.state=0;
            this.lane=1;
            this.pos.x = lanes[1];
            this.pos.y = 1126;
            this.sprite=player_sprites[0];
        }

        this.update=()=>
        {
            
            entitylist.forEach(e=>{
                if(e instanceof Obstacle)
                {
                    if(Physics.checkCollisionCircle(this,e))
                    {
                        if(e.type==0)
                        {
                            window.SH.addScore(10);
                            e.remove();
                            playSound(images.coin);
                        }
                        else
                        {
                            gameOver();
                            playSound(images.GameOver);
                        }
                    }
                }
            });
            
            //drawCircle(this.radius,this.center);
        }

        this.onMouseup =()=>
        {            
            if(this.state==0 && Math.abs(this.pos.x-mousePos[0])>50 && currentGameState==gameStates.game)
            {
                let targetlane=mousePos[0]<this.pos.x?this.lane-1:this.lane+1;
                targetlane = Math.max( 0,Math.min(targetlane,2));
                if(targetlane!=this.lane)
                {
                    this.changeLane(targetlane);
                }
            }
        }

        this.changeLane=(target)=>
        {
            this.sprite=player_sprites[ target<this.lane?2:1];
            this.state=1;
            playSound(images.jump);
            new cAnimation(0.5,(e)=>{
                this.pos.x = lanes[this.lane]+e.progress*(lanes[target]-lanes[this.lane]);
                this.pos.y = 1126 - 100*(Math.sin(Math.PI * e.progress));
            },()=>{
                this.lane=target;
                this.state=0;
                this.sprite=player_sprites[0];
            },null,(e)=>{return currentGameState!=gameStates.pause?e:0;})
        }
    }
    get center(){
        return this.pos;
    }

    get radius(){
        return this.size.x/4;
    }
}

class Obstacle extends Entity{
    constructor(type)
    {
        super(obstacles[type]);        
        this.type = type;
        this.pos.y = 230;
        this.speed = Math.random()<0.5 || type==0?200:200*(1+Math.random());
        this.opacity=0;
        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2,
        }
        this.state =0;
        this.update = ()=>{
            if(this.state ==1)
            {
                this.pos.y += this.speed*dt;
                if(this.pos.y>cav.height+this.size.y)
                {
                    this.remove();
                }
            }
            //drawCircle(this.radius,this.center);
        }
        new cAnimation(0.2,(e)=>{this.opacity=e.progress;},()=>{this.state=1;this.opacity=1;});        
    }
    get center()
    {
        return this.pos;
    }
    get radius()
    {
        return 45;
    }
}

function drawbackgroundCustom(timer)
{
    b0 = window.resources.get(images.Background);
    let posy = Math.floor(timer * 200*0.8)%1280; 
    window.drawCall(
        ()=>{ 
            cxt.drawImage(b0,0,posy,b0.width,b0.height);   
            cxt.drawImage(b0,0,posy-1280,b0.width,b0.height);  
    },-2); 
}

function drawRopeCustom(timer)
{
    b = window.resources.get(images.ropes);
    let posy = Math.floor(timer * 200)%1280; 
    window.drawCall(
        ()=>{ 
            cxt.drawImage(b,0,posy,b.width,b.height);   
            cxt.drawImage(b,0,posy-1280,b.width,b.height);  
    },-2);
}








