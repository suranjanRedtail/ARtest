var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

var NAME ="Corner Score";


const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}

how_to_lines= [
    "Tap to change direction",
    "hit golden blocks for points",
    "Avoid Obstacles!",
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

    Score:0,   
    
    
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

text_color = "#ffffff";
outline_color = "#000000";
score_color = "#ffffff";
button_color = "#e70074";
notification_color = text_color;


ScoreOutline = false;

//custom game global variable

var normal;
var target;
var ball;
var obs;

var boxes = [];



function init()
{  
    normal = document.createElement("canvas");
    normal.height=30,
    normal.width=85;
    let ncxt=normal.getContext("2d");
    Engine.roundedrectangle(ncxt,0,0,normal.width,normal.height,"#22525C");

    target = document.createElement("canvas");
    target.height=30,
    target.width=85;
    let tcxt=target.getContext("2d");
    Engine.roundedrectangle(tcxt,0,0,target.width,target.height,"#C18B14");

    ball = document.createElement("canvas");
    ball.height=30,
    ball.width=30;
    let bcxt=ball.getContext("2d");
    bcxt.fillStyle="#D23F09";
    bcxt.beginPath();
    bcxt.arc(15, 15, 15, 0, 2 * Math.PI);
    bcxt.fill();
    bcxt.closePath();
    
    
    obs = document.createElement("canvas");
    obs.height=30,
    obs.width=30;
    let ocxt=obs.getContext("2d");
    ocxt.fillStyle="#63542d";
    ocxt.fillRect(0,0,30,30);

    boxes.push(new Box(0));
    boxes.push(new Box(1));
    boxes.push(new Box(2));
    boxes.push(new Box(3));
 
    player_entity = new Ball();

    Engine.onMouseUp.push(player_entity.onMouseUp);
    entitylist.push(player_entity);

    boxes.forEach(e=>{
        entitylist.push(e);
    })

    picknewTarget();

    player_entity.reset();   
}

var main = () =>{ 

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
                entitylist.push(new Obs());
                nexttimer += 1 + Math.random();
            }           

            entitylist.forEach(e=>{
                e.updateMain();
                window.draw(e);
            });            
            mainviewport.update(); 

                      

            break;
        case gameStates.pause:

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

    timer = 0;
    nexttimer = 2;

    entitylist =[];

    player_entity.reset();
    player_entity.opacity = 1;

    boxes.forEach(e=>{
        entitylist.push(e);
    }) 

    picknewTarget();
    
    entitylist.push(player_entity);
}

DrawBackground=function()
{     
    let b0 = window.resources.get(images.Background);
        
    window.drawCall(
        ()=>{ 
            bxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2);
}

class Ball extends Entity{
    constructor()
    {
        super(ball);
        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }
        this.base_speed = 300;
        this.dir = 1;
        this.state = 0;
        this.speed = [0,0];
        this.cancollide = true;
        this.dead = false;

        
        
        this.update = ()=>{
            if(!this.dead)
            {
                switch(this.state)
                {
                    case 0:
                    this.speed = [0,this.base_speed];
                    break;
                    case 1:
                    this.speed = [this.base_speed,0];
                    break;  
                }

                this.pos.x += dt * this.speed[0] * this.dir;
                this.pos.y += dt * this.speed[1] * this.dir;
                
                entitylist.forEach(e=>{
                    if(e instanceof Box && this.cancollide)
                    {                    
                        if(window.Physics.checkCollisionCircle(this,e))
                        {
                            this.cancollide = false;
                            new cAnimation(0.2,()=>{},()=>{this.cancollide=true});

                            console.log(e.type);
                            this.state = (this.state+1)%2;
                            if(e.type==0 || e.type==2)
                            {
                                this.dir *=-1;
                            }
                            if(e.istarget)
                            {
                                window.SH.addScore(10);

                                playSound(images.coin);

                                e.setNormal();  
                                picknewTarget(e.type);
                            }
                        }
                    }
                    else if(e instanceof Obs)
                    {
                        if(window.Physics.checkCollisionCircle(this,e))
                        {
                            this.dead=true;
                            new cAnimation(0.5,(p)=>{this.opacity = 1-p.progress;},()=>{gameOver();});
                        }
                    }
                })
            }
        }

        this.reset = ()=>{
            this.pos.x = 565;
            this.pos.y = 660;
            this.state = 0;
            this.dir = 1;
            this.dead = false;
        }

        this.onMouseUp =()=>{
            if(this.cancollide && currentGameState == gameStates.game)
            {
                this.dir *= -1;
            }
        }
    }
    get radius()
    {
        return this.size.x/2;
    }
    get center()
    {
        return this.pos;
    }
}

class Box extends Entity{
    constructor(type)
    {
        super(normal);
        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }
        this.type = type;
        this.istarget = false;

        switch(this.type)
        {
            case 0:
                this.rotation = 45;
                this.pos.x = 568;
                this.pos.y = 819;
                break;
            case 1:
                this.rotation = -45;
                this.pos.x = 568;
                this.pos.y = 458;
                break;
            case 2:
                this.rotation = 45;
                this.pos.x = 143;
                this.pos.y = 458;
                break;
            case 3:
                this.rotation = -45;
                this.pos.x = 143;
                this.pos.y = 819;
                break;
        }
    }

    setTarget() 
    {
        this.sprite.image = target;
        this.istarget = true;
    }

    setNormal()
    {
        this.sprite.image = normal;
        this.istarget = false;
    }

    get radius()
    {
        return this.size.y/2;
    }
    get center()
    {
        return this.pos;
    }
    

}

class Obs extends Entity{
    constructor()
    {
        super(obs);
        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }
        this.speed = 100 + (100*Math.random());

        this.pos.y = 520 + Math.random()*200;
        this.pos.x = cav.width + this.size.x;
        this.update = ()=>{
            this.pos.x -= this.speed * dt;
            if(this.pos.x < -this.size.x/2)
            {
                this.remove();
            }
        }
    }

    get center ()
    {
        return this.pos;
    }

    get radius()
    {
        return this.size.x/2;
    }
}

function picknewTarget(old=0)
{
    let newx;
    do{
        newx = Math.floor(Math.random()*3.999);
    }while(newx == old);
    boxes[newx].setTarget();
}












