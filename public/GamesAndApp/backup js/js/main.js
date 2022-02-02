var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

var NAME ="Momo Up";

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
    Logo : "./assets/sprites/Title.png",
    Playbutton : "./assets/sprites/play.png",
    Pause : "./assets/sprites/pause.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    whitedrop : "./assets/sprites/backdrop_w.png",
    board : "./assets/sprites/board.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png",
    help : "./assets/sprites/help.png",
    game_over_text : "./assets/sprites/gameover_text.png",
    pause_text : "./assets/sprites/pause_text.png",
    music_btn_on : "./assets/sprites/music_on.png",
    effects_btn_on : "./assets/sprites/sound_on.png",
    music_btn_off : "./assets/sprites/music_off.png",
    effects_btn_off : "./assets/sprites/sound_off.png",
    home_btn :"./assets/sprites/home.png",

    momo_sprite :"./assets/sprites/momo.png",
    momo_bhado : "./assets/sprites/bhado.png",
    Plate :"./assets/sprites/plate.png",
    
    
    ding : "./assets/sound/ding.wav",
    BG : "./assets/sound/BG.mp3",
    GameOver : "./assets/sound/game_over.wav",
    coin : "./assets/sound/coin.wav",
};

music_group = [
    images.BG,    
];

effects_group = [
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
    drop : 1,
}

//Entity List
var entitylist = [];
var oldmousestate = false;

var player_sprites =[]; 
var plate;

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

function gameOver() {        
    window.SH.submitScore();    
    currentGameState = gameStates.gameover;  
    Engine.switch_UI("gameover");      
}

function init()
{
    score_init();
    playSound(music_group[0],true);
    SetOrientation();
    window.SH.init();

    prepareButton(images.music_btn_off);
    prepareButton(images.music_btn_on);
    prepareButton(images.effects_btn_off);
    prepareButton(images.effects_btn_on);
    prepareButton(images.home_btn);

    mainviewport = new ViewPort(0,0,cav.width,cav.height);
    
    player_sprites.push( new SpriteAnimation(images.momo_sprite,0,0,[0,1,2],window.resources.get(images.momo_sprite).width/3,window.resources.get(images.momo_sprite).height,1,1));
    player_sprites.push( new SpriteAnimation(images.momo_sprite,0,0,[0,1],window.resources.get(images.momo_sprite).width/3,window.resources.get(images.momo_sprite).height,2,1));
    player_sprites[0].play = false;
    player_sprites[1].loop = true;
    player_sprites[1].play = true;


    player_entity = new Player();
    plate = new Entity(images.Plate);
    plate.size.x = plate.size.x/1.5;
    plate.size.y = plate.size.y/1.5;
    plate.pos.x = mainviewport.posx + mainviewport.width/2 - plate.size.x/2;
    plate.pos.y = mainviewport.ymax - plate.size.y*1.5;
    player_entity.pos.x = mainviewport.posx + mainviewport.width/2 - player_entity.size.x/2;
    player_entity.pos.y = plate.pos.y - player_entity.size.y/1.5;

    plate.store_pos =()=>{
        plate.pos_origin = Object.assign({},plate.pos);
    }

    plate.reset =()=>{
        plate.pos = Object.assign({},plate.pos_origin);
    }

    plate.store_pos();
    player_entity.store_pos();

    Engine.onMouseUp.push(player_entity.onMouseup);

    entitylist.push(plate);
    entitylist.push(player_entity);

    entitylist.forEach((_ent)=>{
        _ent.init();
    })

    
    
    window.Rendering.setContext(cxt);

    currentGameState = gameStates.menu;
    init_UIs();
    Engine.switch_UI("home");
    
    adjustwrapper();
    window.addEventListener("resize",adjustwrapper);

    last_time = Date.now();

    game_properties_initial= Object.assign({},this.game_properties);
    if(Engine.backgroundMode==0)
    {
        DrawBackground();
    }
    main();
}

var main = () =>{   

    Engine.updatefunction();    
   
    switch(currentGameState)
    {     
         
        case gameStates.menu:              
            game_properties.game_time += dt;        
            break;

            case gameStates.game:            
            timer += dt;
            game_properties.game_time += dt; 
            
            
            if(!last_platform)
            {
                let y = new platform(player_entity.pos.y - 200);
                entitylist.push(y);
                y.basespeed = 10*game_properties.unit_scale;
                last_platform = y;
            }
            else if(Math.abs(last_platform.pos.y - player_entity.pos.y)< mainviewport.height)
            {
                let y = new platform(last_platform.pos.y - game_properties.platform_min - (Math.random()*game_properties.platform_rand));
                entitylist.push(y);
                last_platform = y;
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

    window.Rendering.renderDrawCalls();
    
    keyStateOld = Object.assign({},keyState);

    requestAnimationFrame(main);  
}

function resetgame() {    
    game_properties = Object.assign({},game_properties_initial);
    SH.resetScore();

    plate.reset();
    player_entity.reset();
    
    last_platform = null;
    

    entitylist =[];  

    entitylist.push(plate);
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

class Player extends Entity{
    constructor()
    {
        super(player_sprites[1]);
        this.speed = {x:0,y:0};
        this.started = false;
        this.lastY =0;
        this.jump_frame_cd = 0;
        this.jump_ = false;
        this.click_count =0;
        this.charge =0;
        this.order = 0.01;

        this.currentPlatform = null;
        this.currentPlatformOffset ={x:0,y:0};

        this.landed=true;


        this.collider_params = {
            pos:{x:52,y:38},
            size:{x:24,y:112},
        }


        this.store_pos =()=>{
            this.pos_origin = Object.assign({},this.pos);
        }

        this.reset =()=>{
            this.started = false;
            this.landed = true;
            this.charge =0;
            this.click_count =0;
            this.speed.y =0;
            this.speed.x=0;
            this.currentPlatform=null;
            this.sprite = player_sprites[1];
            this.pos = Object.assign({},this.pos_origin);
        }

        this.update=()=>{
            if(!this.landed)
            {      
                if(this.jump_frame_cd<0 && this.jump_)
                {
                    this.speed.y = -0.75 * game_properties.player_jump_speed * game_properties.unit_scale;
                    this.jump_ = false;
                }

                if(!this.jump_)       
                {   
                    this.speed.y += dt * game_properties.unit_scale * game_properties.gravity;

                    if(this.speed.y <-50)
                    {
                        this.sprite.currentframe = 2;                    
                    }
                    else
                    {
                        this.sprite.currentframe = 0;
                        this.speed.y += dt * game_properties.unit_scale * game_properties.gravity;
                    }                    
                }                
            }
            else
            {                
                if(keyState["mouse"])
                {
                    if(this.click_count<=0)
                    {
                        this.sprite.currentframe = 1;
                    }
                }
                if(this.currentPlatform)
                {
                    this.pos.x = this.currentPlatform.pos.x + this.currentPlatformOffset.x;
                    this.pos.y = this.currentPlatform.pos.y + this.currentPlatformOffset.y;
                }
            }
            
            if(mainviewport.posy + mainviewport.height/2 > this.pos.y+this.size.y/2)
            {
                mainviewport.posy = this.pos.y+this.size.y/2 - mainviewport.height/2;
            }

            if(this.pos.y > mainviewport.ymax)
            {
                gameOver();
            }

            this.lastY = this.pos.y;

            this.pos.x += this.speed.x * dt;
            this.pos.y += this.speed.y * dt;

            if(this.pos.x > mainviewport.xmax)
            {
                this.pos.x = mainviewport.posx - this.size.x;
            }
            if(this.pos.x < mainviewport.posx-this.size.x)
            {
                this.pos.x = mainviewport.xmax;
            }

            this.jump_frame_cd -= dt;
        }

        this.onMouseup =()=>{
            if(currentGameState==gameStates.game)
            {
                if(this.click_count<=0 && this.landed)
                {                        
                    this.jump();
                }
                this.click_count--;
            }
        }

        this.jump=()=>
        {
            this.charge = this.charge<0.2?0.2:this.charge;
            this.landed = false;
            this.speed.y = 0;
            this.speed.x=0;
            this.sprite = player_sprites[0];
            this.sprite.currentframe = 1;
            this.jump_frame_cd = 0.1;
            this.jump_ = true;
        }

        this.start = ()=>
        {
            this.jump();
            this.started = true;
        }

        this.land =(platform)=>
        {
            this.charge =0;
            this.currentPlatform = platform;
            this.currentPlatformOffset.x = (platform.pos.x+platform.size.x/2)-(this.size.x/2)-platform.pos.x;
            this.currentPlatformOffset.y = -this.size.y+20;
            this.sprite = player_sprites[1];
            this.sprite.currentframe = 1;
            this.landed = true;
            this.speed = {x:0,y:0};
        }
    }
    get collider(){
        return { 
            pos:{
                x:this.pos.x+this.collider_params.pos.x,
                y:this.pos.y+this.collider_params.pos.y
            },
            size:this.collider_params.size,
            lastY:this.lastY+this.collider_params.pos.y,
    }
    }

    get screenPos(){
        return {x:this.pos.x-mainviewport.posx,
        y:this.pos.y-mainviewport.posy};
    }
}

class platform extends Entity{
    constructor(y)
    {
        super(images.momo_bhado);
        this.basespeed = clamp((Math.random()*40),2,40);
        this.basespeed *= game_properties.unit_scale;
        this.size.x = this.size.x/1.5;
        this.size.y = this.size.y/1.5;
        this.pos.x = mainviewport.posx + (Math.random()*(mainviewport.width-this.size.x));
        this.pos.y = y;
        this.direction = 1;
        this.landed = false;

        this.update=()=>
        {
            if((this.pos.x < mainviewport.posx && this.direction<0) || (this.pos.x > mainviewport.xmax-this.size.x && this.direction>0))
            {
                this.direction *= -1;
            }
            
            this.checkCollisionWithPlayer();

            this.pos.x += this.basespeed * this.direction*dt;

            if(this.pos.y > mainviewport.ymax)
            {
                this.remove();
            }
        }

        this.checkCollisionWithPlayer=()=>
        {
            if(this.pos.x < player_entity.collider.pos.x + player_entity.collider.size.x && this.pos.x + this.size.x > player_entity.collider.pos.x)
            {
                if(player_entity.collider.pos.y + player_entity.collider.size.y > this.pos.y+5 && player_entity.collider.lastY+ player_entity.collider.size.y < this.pos.y+5)
                {
                    player_entity.land(this);
                    if(!this.landed)
                    {
                    window.SH.addScore(10);
                    window.resources.get(images.coin).stereo( (player_entity.pos.x*2/cav.width)-1);
                    playSound(images.coin);
                    this.landed = true;
                    }
                    
                }
            }
        }

    }
}







