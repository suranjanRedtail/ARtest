var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

NAME ="Sode";

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

    bottle1 :(gamesandapp?actual_game_path:".")+"/assets/sprites/b1.png",
    bottle2 :(gamesandapp?actual_game_path:".")+"/assets/sprites/b2.png",
    bottle3 :(gamesandapp?actual_game_path:".")+"/assets/sprites/b3.png",
    bottle4 :(gamesandapp?actual_game_path:".")+"/assets/sprites/b4.png",

    ball1 :(gamesandapp?actual_game_path:".")+"/assets/sprites/ball1.png",
    ball2 :(gamesandapp?actual_game_path:".")+"/assets/sprites/ball2.png",
    ball3 :(gamesandapp?actual_game_path:".")+"/assets/sprites/ball3.png",
    ball4 :(gamesandapp?actual_game_path:".")+"/assets/sprites/ball4.png",

    bubble :(gamesandapp?actual_game_path:".")+"/assets/sprites/bubble.png",
    
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
    drop : 1,
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
var nexttimer =2;

text_color = "#7c1508";
outline_color = "#000000";
score_color = "#ffffff";
button_color = text_color;
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines= [
    "Tap the bottles",
    "shoot caps at the bubbles",
    "pop them for points",
]

//customthings

var bottleSpirites = [
    images.bottle1,
    images.bottle2,
    images.bottle3,
    images.bottle4,
]

var ballSpirites = [
    images.ball1,
    images.ball2,
    images.ball3,
    images.ball4,
]

var bubbleColor =[
    "#dca73e",
    "#c42405",
    "#57db40",
    "#3990d8"
]

var bottles =[];



function init()
{
    
    bottles.push(new Bottle(0,{
        x:76,y:932
    }));
    bottles.push(new Bottle(1,{
        x:218,y:932
    }));
    bottles.push(new Bottle(2,{
        x:360,y:932
    }));
    bottles.push(new Bottle(3,{
        x:502,y:932
    }));
    
    pushbottles();
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
            let ballcount =0;
            entitylist.forEach(e=>{
                if(e instanceof Bubble)
                {
                    ballcount++;
                }
            })


            if(timer>nexttimer || ballcount==0)
            {
                let offset =1;
                if(ballcount==0)
                {
                    offset++;
                }
                let count = Math.max(2,Math.floor( Math.random() * 10));
                let strength = Math.max(3,19-(count*2));

                console.log(count,strength);

                assist = 0;


                for (let index = 0; index < count; index++) {

                    for (let i = 0; i < 4; i++) {    
                        let roll = Math.max(1,Math.floor(Math.random()*(strength+1-assist)));   
                        if(roll>strength/2 && strength>4)
                        {
                            assist+= (roll) /strength;
                        }        
                        t= new Bubble(i, roll);
                        t.pos.x = 96 + (i * (42+t.size.x));
                        t.pos.y = 0 - ((t.size.y +20) * (index+offset));
                        entitylist.push(t);
                    }
                }
                nexttimer = (count+strength) * 2;    
                timer =0;            
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

    pushbottles();
    timer =0;
    nexttimer=0;
    count=0;

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

class Bottle extends Entity{
    constructor(type,pos)
    {
        super(bottleSpirites[type]);
        this.pos = pos;
        this.type = type;
        this.firepoint={x:58,y:-9};
        
        

        this.init =()=>{
            Engine.onMouseUp.push(this.onMouseUp);
        }

        this.onMouseUp =()=>{
            if(window.Physics.checkCollisionPoint(this,{x:mousePos[0],y:mousePos[1]}))
            {
                this.fire();
            }
        }

        this.fire = ()=>{            
            if(this.currentBall!=null)
            {
                this.currentBall.fire();
                this.currentBall=null;
                this.createBall();
            }            
        }
        this.createBall =()=>{
            let t = new Ball(type);
            t.pos.x = this.pos.x + this.firepoint.x;
            t.pos.y = this.pos.y + this.firepoint.y;
            t.opacity =0;
            new cAnimation(0.2,(e)=>{
                t.opacity=e.progress;
            },()=>{
                this.currentBall = t;
            });

            entitylist.push(t);
        }

        
    }
}

class Ball extends Entity{
    constructor(type)
    {
        super(ballSpirites[type]);
        this.type = type;
        this.dead = true;
        this.order = -0.01;

        this.update = ()=>{
            if(this.dead)
            {
                return;
            }
            this.pos.y -= game_properties.ball_speed * dt * game_properties.unit_scale;
            entitylist.forEach(e=>{
                
                if(e instanceof Bubble && e.type == this.type)
                {
                    if(window.Physics.checkCollisionCircle(this,e))
                    {                        
                        this.dead=true;
                        new cAnimation(0.1,(e)=>{
                            this.opacity= 1-e.progress;
                        },()=>{
                            this.remove();
                        });
                        e.hit();
                    }
                }
            })            
            if(this.pos.y < -this.size.y)
            {
                this.remove();
            }
        }

        this.fire =()=>{
            this.dead =false;
        }
        
    }
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2,
            y:this.pos.y + this.size.x/2,
        }
    }

    get radius()
    {
        return this.size.x/2;
    }
}

class Bubble extends Entity{
    constructor(type,count)
    {
        super(images.bubble);
        this.type = type;
        this.countMax = count;
        this.count = count; 
        this.pos.y = -this.size.y;

        

        this.update = ()=>{
            this.pos.y += game_properties.bubble_speed * dt * game_properties.unit_scale;              
            if(this.pos.y >932)
            {
                gameOver();
            }

            if(this.count <= 0)
            {
                window.SH.addScore(this.countMax);
                playSound(images.pop);
                this.remove();
            }             
        }

        this.hit = ()=>{
            this.count--;            
        }    
         

        this.draw2 = (context)=>{            
            if(this.count>0)
            {
                context.fillStyle = bubbleColor[type];
                context.font = "70px GameFont";            
                context.textAlign = "center";
                context.fillText( Math.max(this.count,0),this.pos.x+this.size.x/2,this.pos.y + 82);   
            }             
        }  

        this.drawCalls=[{
            fn: this.draw2,
            order:0.01
        }];
    }
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2,
            y:this.pos.y + this.size.x/2,
        }
    }

    get radius()
    {
        return this.size.x/2;
    }
}

function pushbottles()
{
    bottles.forEach(element => {
        entitylist.push(element);
        element.createBall();
    });
}








