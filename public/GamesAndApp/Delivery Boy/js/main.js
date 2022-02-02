var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 1;

NAME = "Delivery";

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

    board1: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/board1.png",
    board2: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/board2.png",
    bus: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/bus.png",
    bus2: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/bus1.png",
    bush: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/bush.png",
    coin_: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/coin.png",
    cone: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/cone.png",
    hill1: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/hill1.png",
    hill2: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/hill2.png",
    kite1: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/kite1.png",
    kite2: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/kite2.png",
    kite3: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/kite3.png",
    lamp: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/lamp.png",
    main_road: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/main_road.png",
    pit: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/pit.png",
    player: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/player.png",
    pole: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/pole.png",
    pole2: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/pole2.png",
    pole3: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/pole3.png",
    puddle: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/puddle.png",
    stree1: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/stree1.png",
    stree2: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/stree2.png",
    taxi: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/taxi.png",
    tree: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/tree.png",
    
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

    scroll_amt:0,
    scroll_speed:100,

    debug_mode: false,
    base_exp: 50,
    drop: 1,
}

//Entity List
var oldmousestate = false;



//player 
var player_entity;



var highScore = 0;
var totalScore = 0;


text_color = "#ffffff";
outline_color = "#000000";
score_color = "#ffffff";
button_color = "#6ba4f6";
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines = [
    "Hold to fly left",
    "or Right",
    "Score coins, Avoid Rocks!",
]

//customthings

var player_sprite;
var eagle_sprite=[];
var background_ent;
var baby_ent;

var lp = 0;
var last_platfrom = null;

var babybirdloc = null;

var prop_timer =0;
var prop_next =3;

var timer =0;
var nexttimer = 0;

var top_prop = [
    images.pole2,
    images.pole3,
    images.stree1,
    images.stree2,
]

var mid_prop = [
    images.pole,
    images.tree
]

var type0 = [
    
]

var type1 = [
    {
        s:images.cone,
        p:
        {
            x:0,
            y:16
        },
        si:
        {
            x:20,
            y:8
        }
    },
    {
        s:images.pit,
        p:
        {
            x:25,
            y:3
        },
        si:
        {
            x:60,
            y:20
        }
    },
]

var puddle = {

}


//init
function init() {  

    player_sprite = new SpriteAnimation(images.player,0,0,[0,1,2,3],62,44,10,1);
    
    top_prop.push(new SpriteAnimation(images.kite1,0,0,[0,1,2,3],108,174,5,1));
    top_prop.push(new SpriteAnimation(images.kite2,0,0,[0,1,2,3],296/4,110,8,1));
    top_prop.push(new SpriteAnimation(images.kite3,0,0,[0,1,2,3],448/4,174,5,1));

    type0.push(
        {
            s:new SpriteAnimation(images.taxi,0,0,[0,1,2,3],86,48,5,1),
            p:{
                x:0,y:0
            },
            si:{
                x:84,y:14
            }
        }
        );
    type0.push(
        {
            s:new SpriteAnimation(images.bus,0,0,[0,1,2,3],176,52,5,1),
            p:
            {
                x:13,
                y:40
            },
            si:
            {
                x:155,
                y:12
            }
        }
        );
    type0.push(
        {
            s:new SpriteAnimation(images.bus2,0,0,[0,1,2,3],126,48,5,1),
            p:
            {
                x:4,
                y:38
            },
            si:
            {
                x:120,
                y:10
            }
        }
        );

    top_prop.forEach(e=>{
        if(e instanceof SpriteAnimation)
        {
            e.updatetimer = 0;
            e.update = ()=>{
             
            if (e.play && !e.done && prop_timer != e.updatetimer) {
                e.updatetimer = prop_timer;
                e.currentframe += e.rate * dt * e.speed;
                e.currentframe_modded = e.currentframe % e.keyframes.length;
                }
            }
        }
    });     
    
    player_entity = new Player();
    //Engine.onMouseUp.push(player_entity.onMouseUp);

    entitylist.push(player_entity);
}
var main = () => {       
    
    prop_timer += dt;
    if(currentGameState != gameStates.pause)
    {
        game_properties.scroll_amt += dt * game_properties.scroll_speed;
        if(prop_timer < game_properties.scroll_amt)
        {
            prop_timer += 300;
            spawnprop();
        }        
    }    

    switch (currentGameState) {
        case gameStates.menu:
            game_properties.game_time += dt;

            
            break;

        case gameStates.game:
            timer += dt;
            game_properties.game_time += dt;
            
            if (timer > nexttimer) {
                if(Math.random()<0.5)
                {
                    entitylist.push(new Coin());
                }
                if(Math.random()<0.3)
                {
                    entitylist.push(new Puddle());
                }
                entitylist.push(new Obstacles(Math.floor(Math.random()*2)));
                nexttimer += 1 + Math.random()*1.5;
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

    if(currentGameState != gameStates.game && currentGameState != gameStates.pause)
    {  
        entitylist.forEach(e => {
            if(!e.prop)
            {
                return;
            }
            e.updateMain();
            window.draw(e);
        });        
    }

    drawscrollingbg();    
}
function resetgame() {
    game_properties = Object.assign({}, game_properties_initial);
    window.SH.resetScore();

    entitylist = entitylist.filter(e=>{
        if(e.prop)
        {
            return e;
        }
    });

    prop_timer=0;

    player_entity.reset();
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
function drawscrollingbg()
{
    let hill = window.resources.get(images.hill1);
    let hill2 = window.resources.get(images.hill2);
    let bush = window.resources.get(images.bush);
    let road = window.resources.get(images.main_road);

    
    let cx = -(game_properties.scroll_amt %cav.width);
    let cx2 = -(game_properties.scroll_amt*0.95 %cav.width);
    let cx3 = -(game_properties.scroll_amt*0.5 %cav.width);
    let cx4 = -(game_properties.scroll_amt*0.2 %cav.width);

    window.drawCall(
        ()=>{
            cxt.drawImage(bush,(cx2),542);
            cxt.drawImage(bush,(cx2)+cav.width,542);

            cxt.drawImage(road,cx,596);
            cxt.drawImage(road,cx+cav.width,596);
    },-0.1);

    window.drawCall(
        ()=>{           
            
            cxt.drawImage(hill,(cx4),346);
            cxt.drawImage(hill,(cx4)+cav.width,346);

            cxt.drawImage(hill2,(cx3),454);
            cxt.drawImage(hill2,(cx3)+cav.width,454);
    },-0.3);
    
}
class Props extends Entity
{
    constructor(sprite,speed,order)
    {  
        super(sprite);
        this.prop = true;    
        this.order=order;
        this.update = ()=>
        {
            this.pos.x += speed * dt;
            if(this.pos.x + this.size.x < 0)
            {
                this.remove();
            }
        }
    }
}
function spawnprop() 
{
    let index = Math.floor(Math.random()*3);

    let selected;

    switch(index)
    {
        case 0:
            selected = top_prop[Math.floor(Math.random()*top_prop.length)];
            selected = new Props(selected,-0.5 * game_properties.scroll_speed,-0.21);
            selected.pivot.y = selected.size.y;            
            selected.pos.x = cav.width;
            selected.pos.y = 535 + (Math.random()*45);
            break;
        case 1:
            selected = mid_prop[Math.floor(Math.random()*mid_prop.length)];
            selected = new Props(selected,-0.7 * game_properties.scroll_speed,-0.20);
            selected.pivot.y = selected.size.y;
            selected.pos.x = cav.width;
            selected.pos.y = 592;
            break;
        case 2:
            selected = images.lamp;
            selected =new Props(selected,-1.2 * game_properties.scroll_speed,1.6);
            selected.pivot.y = selected.size.y;
            selected.pos.x = cav.width;
            selected.pos.y = cav.height;
            break;
        default:
            break;
    }

    entitylist.push(selected);
}
class Player extends Entity
{
    constructor()
    {
        super(player_sprite) 
        this.collider = new Entity(null,41,4);
        this.pivot.y = this.size.y;
        this.pivot.x = this.size.x/2;
        this.issliding = false;
        
        this.update = ()=>{
            if(!this.issliding)
            {
                this.pos.y = MoveTowards(this.pos.y,mousePos[1],0.03);                
                this.pos.x = MoveTowards(this.pos.x,mousePos[0],0.03);
            }

            this.pos.y = clamp(this.pos.y,625,cav.height);

            this.collider.pos.x = this.pos.x - (this.pivot.x) + 20;
            this.collider.pos.y = this.pos.y - this.collider.size.y;
            this.order = 1 + (this.pos.y-625)/190;

            //window.drawCall(()=>{cxt.fillRect(this.collider.pos.x,this.collider.pos.y,this.collider.size.x,this.collider.size.y)},2);
        }
        this.reset = ()=>{
            this.pos.x = 0;
            this.pos.y = 645;
        }
    }
}
class Obstacles extends Entity
{
    constructor(type)
    {
        let selected = type==0?type0[Math.floor(Math.random()*type0.length)]:type1[Math.floor(Math.random()*type1.length)];
        super(selected.s);
        this.pivot.y = this.size.y;
        this.collider = new Entity(null,1,1);
        this.collider.size.x = selected.si.x;
        this.collider.size.y = selected.si.y;
        this.speed = game_properties.scroll_speed + (type==0?Math.random()*100 + 5:0);

        this.pos.x = cav.width;
        this.pos.y = 623 + (Math.random()*100);
        this.order = 1 + (this.pos.y - 623)/194;

        this.order = type==1?1:this.order;
        this.pivot.y = type==1?0:this.pivot.y;

        this.sprite.updatetimer =0;
        this.sprite.update = ()=>{
            if (this.sprite.play && !this.sprite.done && prop_timer != this.sprite.updatetimer) {
                this.sprite.updatetimer = prop_timer;
                this.sprite.currentframe += this.sprite.rate * dt * this.sprite.speed;
                this.sprite.currentframe_modded = this.sprite.currentframe % this.sprite.keyframes.length;
                }
            };
        

        this.update = ()=>{
            
            this.collider.pos.x = this.pos.x + selected.p.x;
            this.collider.pos.y = this.pos.y + (type==1?selected.p.y:-selected.si.y);

            this.pos.x -= this.speed*dt;
            if(this.pos.x + this.size.x <=0)
            {
                this.remove();
            }
            if(window.Physics.checkCollision(this.collider,player_entity.collider))
            {
                this.remove();
                gameOver();
                playSound(images.GameOver);
            }
            //window.drawCall(()=>{cxt.fillRect(this.collider.pos.x,this.collider.pos.y,this.collider.size.x,this.collider.size.y)},2);
        }
    }
}
class Coin extends Entity
{
    constructor()
    {
        super(new SpriteAnimation(images.coin_,0,0,[0,1,2,3],18,18,5,1));
        this.pos.y = 625 + (Math.random()*95);
        this.order = 1.01;
        this.pos.x = cav.width + Math.random()*50;
        this.centerPivot();
        this.update =()=> {
            this.pos.x -= game_properties.scroll_speed * dt; 
            if(this.pos.x + this.size.x <=0)
            {
                this.remove();
            }
            if(window.Physics.checkCollision(this,player_entity.collider))
            {
                this.remove();
                window.SH.addScore(10);
                playSound(images.coin);
            }
        }                
    }
}
class Puddle extends Entity
{
    constructor()
    {
        super(images.puddle);
        this.centerPivot();
        this.pos.x = cav.width + Math.random()*50;
        this.pos.y = 625 + (Math.random()*95);
        this.update = ()=>{
            this.pos.x -= game_properties.scroll_speed * dt;
            if(window.Physics.checkCollision(this,player_entity.collider) && !player_entity.issliding)
            {
                let oy = player_entity.pos.y;
                player_entity.issliding = true;
                new cAnimation(1.5,(e)=>{
                    player_entity.pos.x += 50 * dt;
                    player_entity.pos.y = oy + (Math.sin(e.progress*15*Math.PI)*5)*(1-e.progress);
                },()=>{player_entity.issliding=false;},null,(t)=>{if(currentGameState==gameStates.pause)return 0; else return t;});
            }
        }  
    }
}