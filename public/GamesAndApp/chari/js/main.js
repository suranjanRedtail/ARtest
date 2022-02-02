var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

NAME ="Chari";

const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}

var last_platform;


//Object containing names of resources
images = {
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
    music_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_on.png",
    effects_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_on.png",
    music_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_off.png",
    effects_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_off.png",
    howto : (gamesandapp?actual_game_path:".")+"/assets/sprites/how_to.png",

    b1 : (gamesandapp?actual_game_path:".")+"/assets/sprites/1.png",
    b2 : (gamesandapp?actual_game_path:".")+"/assets/sprites/3.png",
    b3 : (gamesandapp?actual_game_path:".")+"/assets/sprites/4.png",

    o1 : (gamesandapp?actual_game_path:".")+"/assets/sprites/01.png",
    o2 : (gamesandapp?actual_game_path:".")+"/assets/sprites/02.png",
    o3 : (gamesandapp?actual_game_path:".")+"/assets/sprites/03.png",

    //clouds : (gamesandapp?actual_game_path:".")+"/assets/sprites/how_to.png",

    BG : (gamesandapp?actual_game_path:".")+"/assets/sound/BG.mp3",
    GameOver : (gamesandapp?actual_game_path:".")+"/assets/sound/Gameover.mp3",
    coin : (gamesandapp?actual_game_path:".")+"/assets/sound/coin.wav",
    pop : (gamesandapp?actual_game_path:".")+"/assets/sound/pop1.ogg"
};

music_group = [
    images.BG,    
];

effects_group = [
    images.coin,
    images.GameOver,    
    images.pop
]

//game properties
game_properties = {  
    game_time :0,
    Enemy_speed : 150,
    life :10,
    unit_scale : 10,
    gravity: 200,

    Score:0,   

    ball_speed:300,
    bubble_speed:7,

    
    debug_mode : false,
    base_exp: 50,
    drop : 0,
}

//Entity List
var oldmousestate = false;

var player_sprites =[]; 
var plate;

//player 
var player_entity;



var highScore=0;
var totalScore=0;

var timer = 0;
var nexttimer =0.1;

text_color = "#0f69db";
outline_color = "#000000";
score_color = "#ffffff";
button_color = text_color;
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines= [
    "Hold to fly left",
    "or Right",
    "Score coins, Avoid Rocks!",
]

//customthings

playersprites = [];
obstacleSprites = [
    images.o1,images.o2,images.o3
];


function init()
{
   player_sprites.push(new SpriteAnimation(images.b1,0,0,[0,0,1],105,120,5,1));
   player_sprites.push(new Sprite(images.b2,0,0,0,0));
   player_sprites.push(new Sprite(images.b3,0,0,0,0));

   player_entity = new Bird();
   entitylist.push(player_entity);
   
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


            if(timer>nexttimer )
            {
                SpawnStuff();
                nexttimer += 0.5 * (Math.random()+1);
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
    window.SH.resetScore();

    entitylist =[];  
    player_entity.reset();
    entitylist.push(player_entity);
   
    mainviewport.posx =0;
    mainviewport.posy =0;
    mainviewport.update();
}

DrawBackground=function()
{     
    let b0 = window.resources.get(images.Background);
        
    window.drawCall(
        ()=>{ 
            bxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2);     
}


class Bird extends Entity{
    constructor( dir = normalize([Math.random(),Math.random()]))
    {
        super(player_sprites[0]);
        this.radius = this.size.x/2;
        this.pos.y = 100 + cav.height/2;
        this.pos.x = cav.width/2;
        this.centerPivot();

        this.update=()=>{
            if(currentGameState != gameStates.game)
            {return;}

            if(keyState["mouse"] === true)
            {
                if(mousePos[0] < cav.width/2)
                {
                    this.rotation=MoveTowards(this.rotation,30,0.2);
                    this.pos.x -= Bird.speed*dt;
                    //this.sprite = player_sprites[1];
                }
                else if(mousePos[0] > cav.width/2)
                {
                    this.rotation=MoveTowards(this.rotation,-30,0.2);
                    this.pos.x += Bird.speed*dt;
                    //this.sprite = player_sprites[2];
                }
                if(this.pos.x < this.radius || this.pos.x > cav.width-this.radius)
                {
                    gameOver();
                    playSound(images.GameOver);
                }
            }
            else
            {
                if(this.rotation!=0)
                {
                    this.rotation=MoveTowards(this.rotation,0,0.2);
                }
            }

            entitylist.forEach(e=>{
                if(e instanceof Obstacle)
                {
                    if(window.Physics.checkCollisionCircle(this,e))
                    {
                        gameOver();
                        playSound(images.GameOver);
                    }
                }
                else if(e instanceof Coin)
                {
                    if(window.Physics.checkCollisionCircle(this,e))
                    {
                        window.SH.addScore(10);
                        playSound(images.coin);
                        e.remove();
                    }
                }
            })
        }  
        
        this.reset = ()=>{
            this.pos.x = cav.width/2;
            this.rotation = 0;
        }
                
    }  
    static speed = 1000;
    get center ()
    {
        return this.pos;
    }
}

class Obstacle extends Entity{
    constructor()
    {
          super(  obstacleSprites[  Math.floor(  Math.random()*obstacleSprites.length ) ] ,70,70 );
          this.centerPivot();

          this.update = ()=>{
              this.pos.y += Obstacle.speed * dt;
              if(this.pos.y +this.pivot.y >cav.height)
              {
                  this.remove();
              }
          }
    }
    static speed = 400;

    get center()
    {
        return this.pos;
    }
    get radius ()
    {
        return this.size.x/2;
    }
}

class Coin extends Entity{
    constructor()
    {
        super(null,1,1);
        this.r = [20,16];
        this.radius = 20;
        this.sr = 16;
        this.draw = (context)=>{
            context.fillStyle = "#ffcc00";
            context.beginPath();
            context.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI*2);
            context.fill();
            context.closePath();
            context.fillStyle = "#ffb400";
            context.beginPath();
            context.arc(this.pos.x,this.pos.y,this.sr,0,Math.PI*2);
            context.fill();
            context.closePath();
        }

        this.update = ()=>{
            let st = Math.abs(Math.sin(timer));
            this.radius = 15 + (st*5);
            this.sr = 11 + (st*5);

            this.pos.y += Coin.speed * dt;
            if(this.pos.y +this.pivot.y >cav.height)
            {
                this.remove();
            }
        }
    }
    static speed = 150;

    get center()
    {
        return this.pos;
    }
}

function SpawnStuff()
{
    if(Math.random()<0.3)
    {
        t = new Coin();
        t.pos.x = Math.random() * ( cav.width - (t.radius*2));
        entitylist.push(t);
    }
    else
    {
        let count = Math.floor(Math.random()*5);
        let start = Math.random() * ( cav.width - 35 - (count+1)*70 );
        for(let i =0;i<=count;i++)
        {
            let t = new Obstacle();
            t.pos.x = start;        
            entitylist.push(t);
            start+= 70;
        }
    }
}