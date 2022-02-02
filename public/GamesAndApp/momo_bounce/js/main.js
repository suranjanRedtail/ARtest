var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

var NAME ="Momo Bounce";


const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}

how_to_lines= [
    "Click to change direction",
    "Avoid the forks",
    "Dont get eaten!!",
]

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
    pause_text : (gamesandapp?actual_game_path:".")+"/assets/sprites/pause_text.png",
    music_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_on.png",
    effects_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_on.png",
    music_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_off.png",
    effects_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_off.png",
    howto : (gamesandapp?actual_game_path:".")+"/assets/sprites/how_to.png",

    momo_sprite :(gamesandapp?actual_game_path:".")+"/assets/sprites/momo.png",
    plate :(gamesandapp?actual_game_path:".")+"/assets/sprites/plate.png",
    fork : (gamesandapp?actual_game_path:".")+"/assets/sprites/fork.png",
    Coin : (gamesandapp?actual_game_path:".")+"/assets/sprites/coin.png",
    
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

//Entity List
var oldmousestate = false;

var player_sprites =[]; 
var top_plate,bottom_plate;
var coin_pos;

//player 
var player_entity;

var highScore=0;
var totalScore=0;

var timer = 0;
var nexttimer =2;

text_color = "#623122";
outline_color = "#000000";
score_color = "#ffffff";
button_color = text_color;
notification_color = text_color;

ScoreOutline = false;



function init()
{  
    player_sprites.push( new SpriteAnimation(images.momo_sprite,0,0,[0,1,2],window.resources.get(images.momo_sprite).width/3,window.resources.get(images.momo_sprite).height,1,1));
    player_sprites.push( new SpriteAnimation(images.momo_sprite,0,0,[0,1],window.resources.get(images.momo_sprite).width/3,window.resources.get(images.momo_sprite).height,2,1));
    player_sprites[0].play = false;
    player_sprites[1].loop = true;
    player_sprites[1].play = true;

    player_entity = new Player();
    top_plate = new Plates(true);
    bottom_plate = new Plates(false);
    
    top_plate.pos = {
        x:cav.width/2,
        y: 167,
    }

    bottom_plate.pos = {
        x:cav.width/2,
        y: 1154,
    }

    coin_pos = [top_plate.pos.y+top_plate.size.y,bottom_plate.pos.y-bottom_plate.size.y];
    
    player_entity.reset();

    Engine.onMouseUp.push(player_entity.onMouseup);

    entitylist.push(top_plate);
    entitylist.push(bottom_plate);
    entitylist.push(player_entity);
    createNewCoin();
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
            
            if(timer>=nexttimer && player_entity.state !=0)
            {
                entitylist.push(new Forks(Math.random()>0.5));
                timer=0;
                nexttimer = 0.5 + Math.random()*1.5;
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

    player_entity.reset();
    
    entitylist =[];  

    entitylist.push(top_plate);
    entitylist.push(bottom_plate);
    entitylist.push(player_entity);
    createNewCoin();
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
        super(player_sprites[1]);
        this.speed = 500;

        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }

        this.state = 0;
        this.dir = -1;
        this.rotation = 0;

        this.reset =()=>
        {
            this.state = 0;
            this.pos = {
                x:cav.width/2,
                y: cav.height/2,
            }
            this.sprite = player_sprites[1];
            this.dir = -1;
            this.rotation=0;
        }

        this.update=()=>
        {
            if(this.state!=0)
            {
                this.pos.y += this.speed * this.dir * dt;

                entitylist.forEach(e=>{
                    if(e instanceof Plates)
                    {
                        let tp = e.pos.y < cav.height/2;
                        
                        let pre =false;

                        if((tp && this.dir<0 )||(!tp && this.dir>0))
                        {
                            pre =true;
                        }
                        
                        if(pre && Physics.checkCollisionCircle(this,e))
                        { 
                            playSound(images.ding);
                            this.dir *= -1;
                            this.rotation += 180;                            
                            this.state = 2;
                            let lastrot = this.rotation;
                            new cAnimation(
                                0.1,
                                (e)=>{
                                    
                                },
                                ()=>{this.state =1;                                    
                                }
                            );
                            let lasty = e.pos.y;
                            
                            new cAnimation(
                                0.1, 
                                (param)=>{
                                    e.pos.y = lasty + (50*Math.sin(param.progress*Math.PI)* tp?-1:1);                                
                                },()=>{
                                    e.pos.y = lasty;
                                }
                             );
                        }
                    }
                    else if(e instanceof Forks)
                    {
                        if(Physics.checkCollisionCircle(this,e))
                        {
                            gameOver();
                            this.reset();
                            playSound(images.GameOver);
                        }
                    }
                    else if(e instanceof Coin)
                    {
                        if( e.state &&  Physics.checkCollisionCircle(this,e))
                        {
                            window.SH.addScore(10);
                            playSound(images.coin);
                            e.die();
                            createNewCoin(e);                            
                        }
                    }
                });
            }
        }

        this.onMouseup =()=>
        {
            if(this.state == 0)
            {
                this.state = 1;
                this.sprite = player_sprites[0];
            }
            else if(this.state == 1)
            {
                this.dir *= -1;
                this.rotation += 180;
                this.rotation = this.rotation % 360;
                playSound(images.ding);
            }
        }
    }
    get center(){
        return this.pos;
    }

    get radius(){
        return this.size.x/2;
    }
}

class Plates extends Entity{
    constructor(type)
    {
        super(images.plate);
        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }
        this.rotation = type?180:0;        
    }
    get center()
    {
        return this.pos;
    }
    get radius()
    {
        return this.size.y/2;
    }    
}

class Forks extends Entity{
    constructor(type)
    {
        super(images.fork);
        this.speed = 100 + 300*Math.random();
        this.pivot = {
            x:this.size.x/2,
            y:this.size.y/2
        }  

        this.dir = type?-1:1;
        this.pos.x = type?cav.width+this.pivot.x:-this.pivot.x;
        this.pos.y = coin_pos[0]+ Math.random()*(coin_pos[1]-coin_pos[0]);
        this.rotation = type?0:180;

        this.update = ()=>{
            this.pos.x += this.speed * this.dir * dt;
            if((this.dir <0 && this.pos.x < -this.pivot.x) ||(this.dir>0 && this.pos.x > cav.width+this.pivot.x))
            {
                this.remove();
            }            
        }

    }
    get center (){
        return {x: this.dir<0?this.pos.x - this.size.x/4:this.pos.x + this.size.x/4,y:this.pos.y};
    }
    get radius()
    {
        return this.size.y/2;
    }
}

class Coin extends Entity{
    constructor()
    {
        super(images.Coin);
        this.pos.x = cav.width/2;
        this.state = true;
        this.pivot = {
            x:this.size.x/2,y:this.size.y/2
        }
        this.die = ()=>{
            this.state = false;
            let lastp = this.pos.y;
            
            new cAnimation(0.5,
                (e)=>{
                    this.opacity = 1- e.progress;
                    this.pos.y = lastp - 50 * e.progress;
                },
                ()=>{this.remove();}
                );
        }
    }
    get center (){
        return this.pos;
    }
    get radius()
    {
        return this.size.y/2;
    }
}

function createNewCoin(e)
{
    let t;
    if(e)
    {
        if(e.pos.y < cav.height/2)
        {
            t = new Coin();
            t.pos.y = coin_pos[1];
        }
        else
        {
            t = new Coin();
            t.pos.y = coin_pos[0];
        }
    }
    else
    {
        t = new Coin();
        t.pos.y = coin_pos[0];
    }

    entitylist.push(t);
}







