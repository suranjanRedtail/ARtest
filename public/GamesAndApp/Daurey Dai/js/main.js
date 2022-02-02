var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

var NAME ="Daurey";


const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}

how_to_lines= [
    "Tap left or right",
    "correctly to",
    "Chop down the tree",
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

    woodcutter : (gamesandapp?actual_game_path:".")+"/assets/sprites/sprite.png",
    left : (gamesandapp?actual_game_path:".")+"/assets/sprites/left.png",
    middle : (gamesandapp?actual_game_path:".")+"/assets/sprites/middle.png",
    right : (gamesandapp?actual_game_path:".")+"/assets/sprites/right.png",
    ground : (gamesandapp?actual_game_path:".")+"/assets/sprites/ground.png",
    
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

//custom game global variables
var maxbar = 100;
var bar = 100;
var bar_inc = 2;
var barrate = 12;

var treeSprites; 
var base;
var player_poss=[210,510];
var treeparts =[];

function init()
{  
    treeSprites = [images.left,images.right,images.middle,images.ground];
    player_entity = new Player();
    base = new treePart(3);
    base.pos.y = 1121;
    base.pivot.x =183.5;

    Engine.onMouseUp.push(player_entity.onMouseup);
    entitylist.push(player_entity);
    entitylist.push(base);
    player_entity.reset();
    addTree();    
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
                
            }

            if(bar <=0)
            {
                gameOver();
            }

            bar -= barrate * dt;

            drawbar();
            

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

    player_entity.reset();
    
    entitylist =[];  
    treeparts = [];
    bar = maxbar;
    entitylist.push(player_entity);
    entitylist.push(base);
    addTree();
}

DrawBackground=function()
{     
    let b0 = window.resources.get(images.Background);
        
    window.drawCall(
        ()=>{ 
            bxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2);     
}

class Player extends Entity{
    constructor()
    {
        let sprite = new Sprite(resources.get(images.woodcutter),0,0,150,150);
        super(sprite);
        this.pos.y = 1022;
        this.sprites = [sprite,new Sprite(resources.get(images.woodcutter),150,0,150,150)];
        this.side = 0;
        this.horizontalflip=true;
        this.pivot = 
            {
                x:this.size.x/2,
                y:this.size.y/2
            };
        this.reset = ()=>{
            this.side = 1;
            this.pos.x = player_poss[this.side];
            this.horizontalflip = this.side==0;            
        }
        this.onMouseup = ()=>{
            if(currentGameState==gameStates.game)
            {
                let dir = mousePos[0] < cav.width/2?0:1;
                this.switchSide(dir);
            }
        }

        this.switchSide= (side)=>{
            if(this.side != side)
            {
                this.side = side;
                this.pos.x = player_poss[this.side];
                this.horizontalflip = this.side==0;
            }
            this.attack();
        }

        this.attack = ()=>{
            this.sprite = this.sprites[1];
            new cAnimation(0.2,()=>{         
            },()=>{this.sprite=this.sprites[0]});
            if(treeparts[0] == undefined)
            {
                return;
            }
            if(treeparts[0].type == this.side)
            {
                gameOver();
            }
            else
            {                
                treeparts[0].die(this.side);
                if(treeparts[0].type == this.side)
                {
                    gameOver();
                }
                else
                {
                    window.SH.addScore(5);
                    playSound(images.coin);
                    bar += bar_inc;
                    bar = clamp(bar,0,100);
                }            
            }
        }
    }
}

class treePart extends Entity
{
    constructor(index)
    {
        super(treeSprites[index]);
        this.pos.x = cav.width/2;
        this.type = index>=2?2:index==0? 0:1;
        this.pivot ={
            x: this.type>=2?( this.type==2?this.size.x/2:183.5): (this.type==0? this.size.x-75.5:75.5),
            y: Math.floor(this.size.y/2)
        }

        this.die=(dir)=>{
            treeparts.splice(treeparts.indexOf(this),1);
            treeparts.forEach(e=>{
                e.pos.y += 73;
            })
            addTree();            
            let rotation_amt = dir?-30:30;
            let offset = dir?-200:200;
            let intialx = this.pos.x;
            let i =new cAnimation(0.5,(e)=>{
                this.opacity = 1-e.progress;
                this.rotation = 360 + (e.progress * rotation_amt);
                this.pos.x = intialx + (offset * e.progress);
            }, ()=>{this.remove();},null,(e)=>{if(currentGameState==gameStates.gameover){i.die();return 0;} if(currentGameState==gameStates.game){return e} return 0;});
        }
    }
}

function addTree()
{    
    while(treeparts.length==0 || treeparts[treeparts.length-1].pos.y >0)
    {
        if(treeparts.length==0)
        {
            let k = new treePart(2);
            k.pos.y = Math.floor(base.pos.y - base.size.y/2 - k.size.y/2 + 10);
            entitylist.push(k);  
            treeparts.push(k);      
        }
        else
        {
            let lowest = treeparts[treeparts.length-1];
            let nexttype;
            if(lowest.type==2)
            {
                nexttype=Math.random()<0.3?2:Math.random()<0.5?0:1;
            }
            else
            {
                nexttype=Math.random()<0.4?2:Math.random()<0.5?lowest.type:2;
            }
            let k=new treePart(nexttype);
            k.pos.y = Math.floor(lowest.pos.y - 73);
            entitylist.push(k);
            treeparts.push(k);  
        }
    }
}

function drawbar()
{
    window.drawCall(
        ()=>{
            cxt.strokeStyle = "#ffffff";
            cxt.fillStyle= "#e70074";
            cxt.lineWidth = 5;
            cxt.fillRect(152,219,416 *(bar/maxbar),59);
            cxt.strokeRect(152,219,416,59);
    },1.2);
}











