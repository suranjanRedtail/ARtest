var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

NAME ="Burger";

const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}


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
    music_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_on.png",
    effects_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_on.png",
    music_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_off.png",
    effects_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_off.png",
    howto : (gamesandapp?actual_game_path:".")+"/assets/sprites/how_to.png",

    top: (gamesandapp?actual_game_path:".")+"/assets/sprites/top.png",
    bot: (gamesandapp?actual_game_path:".")+"/assets/sprites/bottom.png",

    s1:(gamesandapp?actual_game_path:".")+"/assets/sprites/1.png",
    s2:(gamesandapp?actual_game_path:".")+"/assets/sprites/2.png",
    s3:(gamesandapp?actual_game_path:".")+"/assets/sprites/3.png",
    s4:(gamesandapp?actual_game_path:".")+"/assets/sprites/4.png",
    s5:(gamesandapp?actual_game_path:".")+"/assets/sprites/5.png",    

    BG : (gamesandapp?actual_game_path:".")+"/assets/sound/BG.mp3",
    GameOver : (gamesandapp?actual_game_path:".")+"/assets/sound/game_over.wav",
    coin : (gamesandapp?actual_game_path:".")+"/assets/sound/coin.mp3",
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

    h_speed_min:20,
    h_speed_max:100,
    v_speed:100,

    
    debug_mode : false,
    base_exp: 50,
    drop : 1,
}

//Entity List
var entitylist = [];
var oldmousestate = false;

var count=0;
var min_overlap=1;


//player 
var player_entity;
var last_platform;

var base_platform;
var top_platform;


var highScore=0;
var totalScore=0;

var timer = 0;
var nexttimer =2;

text_color = "#681833";
outline_color = "#000000";
score_color = "#ffffff";
button_color = text_color;
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines= [
    "Tap to",
    "Stack Ingeridents",
    "Make ur tallest burger",
]

//customthings
var stuffs = [
    images.s1,
    images.s2,
    images.s3,
    images.s4,
    images.s5,
]

function init()
{
    base_platform = new Entity(images.bot);
    base_platform.pos.x = cav.width/2 - base_platform.size.x/2;
    base_platform.pos.y = cav.height - base_platform.size.y - 50;
    last_platform=base_platform;

    top_platform = new Entity(images.top);
    top_platform.osize = Object.assign({},top_platform.size);

    entitylist.push(new StackingThings(1));
    entitylist.push(base_platform);
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
    min_overlap=1;

    entitylist.push(base_platform);
    last_platform=base_platform;   
    

    mainviewport.posx =0;
    mainviewport.posy =0;
    mainviewport.update();
    count=0;

    entitylist.push(new StackingThings(Math.floor(Math.random()*stuffs.length)));
}

DrawBackground=function()
{     
    let b0 = window.resources.get(images.Background);
        
    window.drawCall(
        ()=>{ 
            bxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2);     
}

class StackingThings extends Entity{
    constructor(index,ratio=1)
    {
        super( stuffs[index]);
        this.pos.x = Math.random()*(cav.width-this.size.x);
        this.pos.y = mainviewport.posy + 100;
        if(ratio<1)
        {
            this.size.x *= ratio;
            //this.size.y *= ratio;
        }
        this.ratio=ratio;
        this.speed = Math.max(game_properties.h_speed_min, Math.random()* game_properties.h_speed_max);

        this.state = 0;
        this.direction = Math.random()<0.5? 1:-1;

        this.update = function(){
            switch(this.state)
            {
                case 0:
                    this.pos.x += this.speed * game_properties.unit_scale * this.direction*dt;
                    if(this.pos.x < 0)
                    {
                        this.pos.x =0;
                        this.direction=1;
                    }
                    else if(this.pos.x+this.size.x > cav.width)
                    {
                        this.pos.x= cav.width-this.size.x;
                        this.direction=-1;
                    }

                    break;
                case 1:
                    if(this.pos.y < last_platform.pos.y)
                    {
                        this.pos.y += game_properties.v_speed * game_properties.unit_scale * dt;
                    }
                    else
                    {
                        this.state=2;                        
                        this.destory();
                    }    

                    let overlap = window.Physics.checkOverlapX_Length(this,last_platform);
                    let ratio = overlap/this.size.x;
                    
                    console.log(ratio);

                    if(overlap>0 &&  ratio > 0.5)
                    {       
                        min_overlap = Math.min(ratio,min_overlap);
                                         
                        this.state = 2;
                        this.pos.y = last_platform.pos.y-this.size.y;

                        last_platform=this;
                        window.SH.addScore(10);
                        console.log("hey");
                        count++;
                        playSound(images.coin);
                        Engine.onMouseUp.splice(Engine.onMouseUp.indexOf(this.onMouseUp));
                        if(this.pos.y - mainviewport.posy < mainviewport.height/1.5 )
                        {
                            let diff = (mainviewport.height/1.5) - (this.pos.y - mainviewport.posy);
                            let original_pos =  mainviewport.posy;                            
                            new cAnimation(0.5,(p)=>{
                                mainviewport.posy = original_pos - (diff * p.progress);
                            },()=>{entitylist.push(new StackingThings(Math.floor(Math.random()*stuffs.length*0.99),min_overlap))});
                        }
                        else
                        {
                            entitylist.push(new StackingThings(Math.floor(Math.random()*stuffs.length*0.99),min_overlap));
                        }
                    }
                    else if(overlap>0)
                    {
                        this.state=2;
                        this.destory();
                    }
                    break;
                case 2:
                    break;
            }
        }.bind(this);

        this.onMouseUp = ()=>{
            if(this.state ==0)
            {
                this.state = 1;
            }        
        };
        
        this.destory = ()=>{
            playSound(images.GameOver);
            
            new cAnimation(0.5, (e)=>{
                this.opacity = 1-e.progress;
              }, ()=>{
                  bring_down_top(
                      ()=>{
                        let diff = mainviewport.posy;
                        new cAnimation(2, (e)=>{
                            mainviewport.posy = Math.max(0,(1-(e.progress/0.5)))*diff;
                          },
                          ()=>{
                                gameOver();
                              this.remove_next_call=true;
                              Engine.onMouseUp.splice(Engine.onMouseUp.indexOf(this.onMouseUp));
                              
                          });
                      }
                  )
              });
            
        };

        Engine.onMouseUp.push(this.onMouseUp);        
    }
}

function bring_down_top( callBack )
{
    entitylist.push(top_platform);
    let ratio = (last_platform.size.x+50)/top_platform.osize.x;
    
    top_platform.size.x = top_platform.osize.x * ratio;  
    top_platform.size.y = top_platform.osize.y * ratio;

    top_platform.pos.y=mainviewport.posy - top_platform.size.y;
    top_platform.pos.x=last_platform.pos.x + last_platform.size.x/2 - top_platform.size.x/2;
    let diff = last_platform.pos.y - top_platform.pos.y - top_platform.size.y;
    let start = top_platform.pos.y;
   

    new cAnimation( 1,(e)=>{
        top_platform.pos.y = start + diff*e.progress;
    },callBack );
}