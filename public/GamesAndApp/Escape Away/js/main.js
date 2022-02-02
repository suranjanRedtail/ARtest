var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

NAME = "Escape";

const gameStates = {
    menu: 0,
    game: 1,
    gameover: 2,
    pause: 3,
    orientation: 4,
}

var last_platform;

//Object containing names of resources
var images = {

    //ui stuff
    Logo: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/Title.png",
    Playbutton: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/play.png",
    Pause: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/pause.png",
    Playagain: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/playagain.png",
    resume: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/resume.png",
    blackdrop: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/backdrop.png",
    whitedrop: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/backdrop_w.png",
    board: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/board.png",
    Background: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/bg.png",
    P_L: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/P_L.png",
    game_over_text: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/gameover_text.png",
    music_btn_on: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/music_on.png",
    effects_btn_on: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/sound_on.png",
    music_btn_off: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/music_off.png",
    effects_btn_off: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/sound_off.png",
    howto: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/how_to.png",

    //game stuff here

    trees : (gamesandapp ? actual_game_path : ".") + "/assets/sprites/bg_2.png",
    bird : (gamesandapp ? actual_game_path : ".") + "/assets/sprites/bird.png",
    baby : (gamesandapp ? actual_game_path : ".") + "/assets/sprites/baby.png",
    eagle : (gamesandapp ? actual_game_path : ".") + "/assets/sprites/eagle.png",
    eagle_2 : (gamesandapp ? actual_game_path : ".") + "/assets/sprites/eagle_2.png",

    //music stuff    
    BG: (gamesandapp ? actual_game_path : ".") + "/assets/sound/BG.mp3",
    GameOver: (gamesandapp ? actual_game_path : ".") + "/assets/sound/Gameover.mp3",
    coin: (gamesandapp ? actual_game_path : ".") + "/assets/sound/coin.wav",
    pop: (gamesandapp ? actual_game_path : ".") + "/assets/sound/pop1.ogg"
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
    game_time: 0,
    Enemy_speed: 150,
    life: 10,
    unit_scale: 10,
    gravity: 200,

    Score: 0,

    ball_speed: 300,
    bubble_speed: 7,


    debug_mode: false,
    base_exp: 50,
    drop: 1,
}

//Entity List
var oldmousestate = false;

var player_sprites;
var plate;

//player 
var player_entity;



var highScore = 0;
var totalScore = 0;

var timer = 0;
var nexttimer = 0.1;

text_color = "#05443c";
outline_color = "#000000";
score_color = "#ffffff";
button_color = "#d14d3a";
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines = [
    "Hold to fly left",
    "or Right",
    "Score coins, Avoid Rocks!",
]

//customthings

var player_sprites = [];
var eagle_sprite=[];
var background_ent;
var baby_ent;

var lp = 0;
var last_platfrom = null;

var babybirdloc = null;


//init
function init() {
    player_sprites = new SpriteAnimation(images.bird, 0, 0, getArrayFromRange(0, 3), 138, 120, 16, 1);
    player_sprites.loop = true;
    player_sprites.play = true;
    
    let te = new SpriteAnimation(images.eagle, 0, 0, getArrayFromRange(0, 1), 163, 218, 3, 1);
    te.loop = true;
    te.play = true;

    eagle_sprite.push(te);

    

    te = new SpriteAnimation(images.eagle_2, 0, 0, getArrayFromRange(0, 1), 163, 218, 3, 1);
    te.loop = true;
    te.play = true;

    eagle_sprite.push(te);

    background_ent = new Entity(images.trees); 
    background_ent.order = -0.1;
    baby_ent = new Entity(images.baby);
    baby_ent.order = -0.2;
    baby_ent.centerPivot();
    baby_ent.pos.x = cav.width/2;


    player_entity = new Player();
    player_entity.reset();
    lp = player_entity.pos.x;
    Engine.onMouseUp.push(player_entity.onMouseUp);

    
    player_entity.reset();

    resetbabybird();

    entitylist.push(player_entity);
    entitylist.push(baby_ent);
    entitylist.push(background_ent);
}

var main = () => {

    switch (currentGameState) {
        case gameStates.menu:
            game_properties.game_time += dt;
            break;

        case gameStates.game:
            timer += dt;
            game_properties.game_time += dt;
            
            if (timer > nexttimer) {
                SpawnStuff();
                nexttimer += 0.5 * (Math.random() +2);
            }

            entitylist.forEach(e => {
                e.updateMain();
                window.draw(e);
            });
            mainviewport.update();



            break;
        case gameStates.pause:

            entitylist.forEach(e => {
                window.draw(e);
            });
            break;
        case gameStates.gameover:

            game_properties.game_time += dt;

            mainviewport.update();

            entitylist.forEach(e => {
                //e.updateMain();
                //window.draw(e);                        
            });

            break;

        case gameStates.orientation:
            window.drawCall(() => {
                cxt.fillStyle = "#ffffff";
                cxt.fillRect(0, 0, cav.width, cav.height);
                cxt.drawImage(window.resources.get(images.P_L), Math.floor((cavMain.width / 2) - (window.resources.get(images.P_L).width / 2)), 0, window.resources.get(images.P_L).width, window.resources.get(images.P_L).height);
            }, 11);
            break;
        default:
            break;
    }
}

function resetgame() {
    game_properties = Object.assign({}, game_properties_initial);
    window.SH.resetScore();

    entitylist = [];

    resetbabybird();

    player_entity.reset();
    entitylist.push(player_entity);
    entitylist.push(baby_ent);
    entitylist.push(background_ent);
}

DrawBackground=function()
{     
    let b0 = window.resources.get(images.Background);
        
    window.drawCall(
        ()=>{ 
            bxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2);     
}

class Player extends Entity {
    constructor() {
        super(player_sprites);
        this.speed = 200;
        this.centerPivot(); 


        this.timer = 0;
        this.can_tap = true;
        this.direction = -1;

        this.reset = () => {
            this.pos.x = cav.width / 2;
            this.pos.y = cav.height / 2;
        }

        this.update = () => {

            if(this.direction<0)
            {
                this.sprite.speed=0.75;
            }
            else
            {
                this.sprite.speed=0.5;
            }

            this.pos.y += this.speed * dt * this.direction;   

            if(this.direction<0 && this.pos.y < 117 + this.pivot.y)
            {     
                this.pos.y = 117 + this.pivot.y;       
                this.cantap_delay();
                this.direction =1;
                if(babybirdloc == 0)
                {
                    window.SH.addScore(10);
                    playSound(images.coin);
                    resetbabybird();
                }
            }
            else if(this.direction>0 && this.pos.y > 1126- this.pivot.y)
            {
                this.pos.y = 1126 - this.pivot.y;
                this.cantap_delay();
                this.direction =-1;
                if(babybirdloc == 1)
                {
                    window.SH.addScore(10);
                    playSound(images.coin);
                    resetbabybird();
                }
            }
                     
        }

        this.onMouseUp = ()=>{
            if(currentGameState == gameStates.game && this.can_tap)
            {
                this.cantap_delay();
                this.direction *= -1;
            }
        }

        this.cantap_delay = ()=>{
            this.can_tap = false;
            new cAnimation(0.15,()=>{},()=>{this.can_tap=true;})
        }
        
    }

    get center()
    {
        return this.pos;
    }
    get radius()
    {
        return this.size.y/2.5;
    }
}

class Eagle extends Entity{
    constructor(type)
    {
        super(eagle_sprite[type]);
        this.speed =  (200 + (Math.random()*200))* (type==0?1:-1);
        this.centerPivot();
        this.pos.x = type==0?-this.size.x:cav.width + this.size.x/2;
        this.update = ()=>
        {   
            this.pos.x += this.speed * dt;   

            if((this.speed<0 && this.pos.x < -this.size.x/2)||(this.speed>0 && this.pos.x > cav.width + this.size.x/2))
            {
                this.remove();
            }
            if(window.Physics.checkCollisionCircle(this,player_entity))
            {
                gameOver();
                playSound(images.GameOver);
                this.remove();
            }            
            
        }
    }
    get center()
    {
        return this.pos;
    }
    get radius()
    {
        return 30;
    }
}

function resetbabybird()
{
    if(babybirdloc==null)
    {
        let newbabybirdloc = Math.random()<0.5?0:1;
        let newposy = newbabybirdloc==0?117:1103;
        new cAnimation(0.5,(e)=>{
            baby_ent.pos.y = newposy + (baby_ent.size.y * (1-e.progress));
        },()=>{
            babybirdloc = newbabybirdloc;
        },null,(e)=>{if(currentGameState==gameStates.game){return e;}return 0;})
    }
    else
    {
        
        let tpy = babybirdloc==0?117:1103;
        babybirdloc=null;
        new cAnimation(1,(e)=>{
            baby_ent.pos.y = tpy + (e.progress*baby_ent.size.y) + Math.abs(Math.sin(e.progress*Math.PI*3)*10);
        },()=>{
            new cAnimation(1,()=>{},()=>{resetbabybird()});
        },null,(e)=>{if(currentGameState==gameStates.game){return e;}return 0;})
    }
}

function SpawnStuff()
{
    let t = new Eagle(Math.random()<0.5?0:1)
    t.pos.y = 117 + Math.random()*(1103 - 117);
    entitylist.push(t);
}
