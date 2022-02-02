var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

NAME ="Momo defense";

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

    fork : (gamesandapp?actual_game_path:".")+"/assets/sprites/fork.png",
    spoon : (gamesandapp?actual_game_path:".")+"/assets/sprites/spoon.png",
    knife : (gamesandapp?actual_game_path:".")+"/assets/sprites/knife.png",
    momos : (gamesandapp?actual_game_path:".")+"/assets/sprites/momos.png",
    plate : (gamesandapp?actual_game_path:".")+"/assets/sprites/plate.png",
    circle : (gamesandapp?actual_game_path:".")+"/assets/sprites/circle.png",
    
    BG : (gamesandapp?actual_game_path:".")+"/assets/sound/BG.mp3",
    GameOver : (gamesandapp?actual_game_path:".")+"/assets/sound/gameover.mp3",
    coin : (gamesandapp?actual_game_path:".")+"/assets/sound/block.wav",
};

music_group = [
    images.BG,    
];

effects_group = [
    images.coin,
    images.GameOver,
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

var obstacles =[
    images.spoon,
    images.fork,
    images.knife,
];

var circle,shield,momos;


var highScore=0;
var totalScore=0;

var timer = 0;
var nexttimer =2;

text_color = "#ffffff";
button_color = "#623122";
outline_color = "#000000";
score_color = "#ffffff";
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines= [
    "Guide the Shield",
    "with ur mouse or finger.",
    "Protect the momos",
    "from being devoured",
]

//customthings
var bottles =[];


function init()
{    
    circle = new Entity(images.circle);
    momos = new Entity(images.momos);  

    circle.pos = 
    {
        x:cav.width/2,
        y:cav.height/2 + 100,
    }

    circle.pivot = {
        x:circle.size.x/2,
        y:circle.size.x/2,
    }

    momos.pivot = {
        x:momos.size.x/2,
        y:momos.size.y/2,
    }

    shield = new Shield();
    momos.pos = circle.pos;    
    shield.pos = circle.pos;

    circle.center = circle.pos;
    circle.radius = circle.size.x/2;

    entitylist.push(shield);
    entitylist.push(circle);
    entitylist.push(momos);
    
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

            if(timer>nexttimer)
            {
                    entitylist.push(new Obstacles());
                    nexttimer = 0.5 + (Math.random()*1.25); 
                    timer=0;   
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

    entitylist.push(shield);
    entitylist.push(circle);
    entitylist.push(momos);

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

class Shield extends Entity
{
    constructor()
    {
        super(images.plate);

        this.pivot =
        {
            x:- circle.size.x/2,
            y:this.size.y/2,
        }
        
        this.update = ()=>
        {
            if(currentGameState==gameStates.game)
            {
               this.rotation = this.getanglefrompos( {x:mousePos[0],y:mousePos[1]});                               
            }
        }

        this.getanglefrompos= (pos)=>
        {
            let temp = {x:0,y:0};
            temp.x = pos.x - this.pos.x;
            temp.y = pos.y - this.pos.y;

            let angle = Math.atan(temp.y/temp.x);

            if(temp.x < 0)
            {
                angle -= Math.PI;
            }
            if(angle < 0)
            {
                angle -= Math.PI * 2;
            }

            angle = 180/Math.PI * angle *-1;
            while(angle<=0)
            {
                angle+= 360;
            }
            while(angle>360)
            {
                angle-=360;
            }
            return angle;
        }

    }
}

class Obstacles extends Entity{
    constructor()
    {
        super(obstacles[Math.floor(Math.random()*obstacles.length) ]);
        this.speed=50 + 150*Math.random();
        this.dir = {x:0,y:0};
        this.getrandomPos=()=>{
            let rand = Math.PI * 2 * Math.random();
            this.dir.x = Math.cos(rand);
            this.dir.y = Math.sin(rand);
            this.pos.x = circle.pos.x + this.dir.x * cav.height*0.75; 
            this.pos.y = circle.pos.y + this.dir.y * cav.height*0.75; 
            
            this.rotation = rand * (180/Math.PI);
            this.rotation *= -1;
            this.rotation += 180;
            
            while(this.rotation<0)
            {
                this.rotation+= 360;
            }
            while(this.rotation>360)
            {
                this.rotation-= 360;
            }
        }

        this.getrandomPos();
        this.sizeDisplayAABB ={ x:this.size.x,y:this.size.x};

        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }
                
        this.update = () =>
        {
            this.pos.x += -this.dir.x * this.speed * dt; 
            this.pos.y += -this.dir.y * this.speed * dt;   

            if(Physics.checkCollisionCircle(this,circle))
            {
                let rot = this.rotation + 180;

                while(rot<0)
                {
                    rot+= 360;
                }
                while(rot>360)
                {
                    rot-= 360;
                }
                console.log(rot,shield.rotation);

                if(shield.rotation <90 && rot>270)
                {
                    rot = shield.rotation + 360 -rot;
                }
                if(shield.rotation>270 && rot<90)
                {
                    rot = 360 + rot -shield.rotation;
                }
                else
                {
                    rot = rot - shield.rotation;
                }                
                
                if(Math.abs(rot)<10)
                {
                    this.remove_next_call=true;
                    window.SH.addScore(20);
                    playSound(images.coin);
                    new cAnimation(1,(e)=>{
                        window.drawCall( ()=>{
                            cxt.save();                                                
                            cxt.globalAlpha =  1-e.progress;                                
                            cxt.fillStyle=text_color;
                            cxt.font = "50px GameFont";
                            cxt.textAlign = "center"
                            cxt.fillText("+20",578,512-(e.progress*80));
                            cxt.fillText("Nice!",578,470-(e.progress*80));
                            cxt.restore(); 
                    },0)});
                }
                else if(Math.abs(rot)<60)
                {
                    this.remove_next_call=true;
                    window.SH.addScore(10);
                    playSound(images.coin);
                    new cAnimation(1,(e)=>{
                        window.drawCall( ()=>{
                            cxt.save();                                                
                            cxt.globalAlpha =  1-e.progress;                                
                            cxt.fillStyle=text_color;
                            cxt.font = "50px GameFont";
                            cxt.textAlign = "center"
                            cxt.fillText("+10",578,512-(e.progress*80));
                            //cxt.fillText("",578,470-(e.progress*80));
                            cxt.restore(); 
                    },0)});
                }
                else
                {
                    gameOver();
                    playSound(images.GameOver);
                }
            }
        }


        
    }
    get radius()
    {
        return this.size.x/2;
    }
    get center()
    {
        return {
            x: this.pos.x,
            y:this.pos.y,
        }
    }
}










