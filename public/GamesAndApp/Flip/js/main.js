var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

NAME ="Flip";

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

    bar : (gamesandapp?actual_game_path:".")+"/assets/sprites/power_bar.png",
    arrow : (gamesandapp?actual_game_path:".")+"/assets/sprites/arrow.png",
    
    
    BG : (gamesandapp?actual_game_path:".")+"/assets/sound/BG.ogg",
    GameOver : (gamesandapp?actual_game_path:".")+"/assets/sound/GO.ogg",
    coin : (gamesandapp?actual_game_path:".")+"/assets/sound/coin.ogg",
    flip : (gamesandapp?actual_game_path:".")+"/assets/sound/flip.ogg",
};

music_group = [
    images.BG,    
];

effects_group = [
    images.coin,
    images.GameOver,    
    images.flip,
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

var bottleSpirites = [
    images.bottle1,
    images.bottle2,
    images.bottle3,
    images.bottle4,
]

var main_bar;
var arrow;


var bottles = [];

var highScore=0;
var totalScore=0;

var timer = 0;
var nexttimer =2;

text_color = "#ffffff";
var button_color = "#f2ca25";
outline_color = "#000000";
score_color = "#ffffff";
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines= [
    "Tap the screen in",
    "time to flip the bottle",
    "Score points!",
]

//customthings
var bottles =[];


function init()
{    
    bottles.push(new Bottle(bottleSpirites[0]));
    bottles.push(new Bottle(bottleSpirites[1]));
    bottles.push(new Bottle(bottleSpirites[2]));
    bottles.push(new Bottle(bottleSpirites[3]));

    main_bar = new Bar();
    arrow = new Arrow();

    main_bar.bottle = bottles[Math.floor( Math.random()*bottles.length)];

    main_bar.arrow = arrow;

    entitylist.push(main_bar);
    entitylist.push(main_bar.bottle);
    entitylist.push(main_bar.arrow);
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

    main_bar.bottle = bottles[Math.floor( Math.random()*bottles.length)];
    entitylist.push(main_bar);
    entitylist.push(arrow);
    entitylist.push(main_bar.bottle);
    main_bar.bottle.rotation = 0;
    main_bar.reset();

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

class Bottle extends Entity
{
    constructor(i)
    {
        super(i);
        this.state = 0;
        this.pivot =
        {
            x:this.size.x/2,
            y:this.size.y/2
        }

        this.pos = {
            x:cav.width/2,
            y:cav.height/2 + 200
        }
    }
}

class Bar extends Entity
{
    constructor()
    {
        super(images.bar);

        this.pos = {
            x: cav.width/2 - this.size.x/2,
            y: 100
        }
        this.state = 0;
        this.progress = 0.5;
        this.direction= -1;
        this.speed = 1;
        this.bottle;
        this.arrow;       
        
        this.update =()=>
        {
            if(this.state==0)
            {
                this.progress += this.speed * this.direction * dt;

                if(this.progress<0)
                {
                    this.progress = 0;
                    this.direction = 1;
                }

                if(this.progress>1)
                {
                    this.progress =1;
                    this.direction = -1;
                }

                this.arrow.rotation = -45 + (1-this.progress)* 90;
                this.arrow.pos.x = this.pos.x + 100+ (this.progress * (this.size.x-200));
                this.arrow.pos.y = this.size.y + this.pos.y- 10 - ((this.arrow.size.y*0.75 - 20) * Math.sin(this.progress*(Math.PI)));
            }
        }

        this.onMouseUp = ()=>
        {
            if(this.progress> 0.45 && this.progress<0.55)
            {                
                if(this.state==0 && currentGameState==gameStates.game)
                {
                    this.state =1;
                    let rotdirection = Math.random()>0.5?-1:1;
                    playSound(images.flip);
                    new cAnimation(1.5,
                    (e)=>
                    {
                        this.bottle.rotation = 360* 2 * e.progress*rotdirection;
                        this.bottle.pos.y = cav.height/2 +200 -  (400 * Math.sin( Math.PI * e.progress));
                    },
                    ()=>
                    {
                        this.state = 0;
                        window.SH.addScore(20);
                        playSound(images.coin);   
                        this.reset();  
                        
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
                            },0)   
                        });
                    },null,this.rule)
                }
            }else if(this.progress> 0.3 && this.progress<0.7)
            {                
                if(this.state==0 && currentGameState==gameStates.game)
                {
                    this.state =1;
                    let rotdirection = Math.random()>0.5?-1:1;
                    playSound(images.flip);
                    new cAnimation(1,
                    (e)=>
                    {
                        this.bottle.rotation = 360 * e.progress*rotdirection;
                        this.bottle.pos.y = cav.height/2 +200 -  (300 * Math.sin( Math.PI * e.progress));
                    },
                    ()=>
                    {
                        this.state = 0;
                        window.SH.addScore(10);
                        playSound(images.coin);   
                        this.reset();  
                        
                        new cAnimation(1,(e)=>{
                            window.drawCall( ()=>{
                                cxt.save();                                                
                                cxt.globalAlpha =  1-e.progress;                                
                                cxt.fillStyle=text_color;
                                cxt.font = "50px GameFont";
                                cxt.fillText("+10",571,512-(e.progress*80));
                                cxt.restore(); 
                            },0)   
                        });
                    },null,this.rule)
                }
            }else
            {                
                if(this.state==0 && currentGameState==gameStates.game)
                {
                    this.state =1;
                    let triggered=false;
                    let rotdirection = Math.random()>0.5?-1:1;
                    playSound(images.flip);
                    new cAnimation(1,
                    (e)=>
                    {
                        this.bottle.rotation = 450* Math.min(e.progress/0.75,1)*rotdirection;
                        this.bottle.pos.y = cav.height/2 +200-(200 * Math.sin( Math.PI * Math.min(e.progress/0.75,1)));
                        if(e.progress>=0.75 && !triggered)
                        {
                            playSound(images.GameOver);
                            triggered=true;
                        }
                    },
                    ()=>
                    {                        
                        this.state = 0;
                        gameOver();  
                        this.reset();                      
                    },null,this.rule)
                }
            }
        }

        Engine.onMouseUp.push(this.onMouseUp);    

        this.reset= ()=>{
            this.speed = 0.5 +(Math.random()*1.5)
            this.progress = Math.random();
        }

        this.rule = (e)=>{
            if(currentGameState==gameStates.game)
            {
                return e;
            }
            else
            {
                return 0;
            }
        }
    }
}

class Arrow extends Entity{
    constructor()
    {
        super(images.arrow);

        this.pivot = 
        {
            x:this.size.x/2,
            y:this.size.y
        }

    }
}









