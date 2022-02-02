var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");

var game_orientation = 1;

//resizing canvas
cav.width = game_orientation==0?720:1280;
cav.height = game_orientation==0?1280:720;

cavMain.width = game_orientation==0?720:1280;
cavMain.height = game_orientation==0?1280:720;



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3, 
    orientation:4, 
}



//game state initilization
var currentGameState;

//Object containing names of resources
var images = {
    Logo : "./assets/sprites/Title.png",
    Playbutton : "./assets/sprites/play.png",
    Pause : "./assets/sprites/pause.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    board : "./assets/sprites/board.png",    
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png", 
    help : "./assets/sprites/help.png",
    
    
    bullet :"./assets/sprites/bullet.png",
    enemy : "./assets/sprites/enemy.png",
    sniper : "./assets/sprites/sniper.png",
    p1 : "./assets/sprites/p1.png",
    p2 : "./assets/sprites/p2.png",
    blood : "./assets/sprites/animations/blood.png",
    hud : "./assets/sprites/hud.png",

    wind: "./assets/sound/wind.mp3",
    gun_shot : "./assets/sound/start.mp3",
    impact_enemy : "./assets/sound/i_1.ogg",
    impact : "./assets/sound/b_1.ogg",
 };


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


y.onload = () => {   
    let ratio = y.width/y.height;
    let nwidth = ratio * cavMain.height;

    window.resources.load(resources_paths,false);

    let counter =0;
    let timeoutcounter =0;
    let tempcxt = cavMain.getContext('2d');
    delay_interval = setInterval(() => {
        timeoutcounter += 10;
        if(counter>=2000 && resources.resourcesloadedcount == resources.resourcescount)
        {
            clearInterval(delay_interval);
            init();
        }   
        else
        {    
        tempcxt.fillStyle ="#FFFFFF"; 
        tempcxt.fillRect(0,0,cavMain.width,cavMain.height);
        tempcxt.drawImage(y,cavMain.width/2 - nwidth/2,0,nwidth,cavMain.height);
        tempcxt.fillStyle = "#ff0000";
        let delta =  (resources.resourcesloadedcount/resources.resourcescount)< counter/2000?(resources.resourcesloadedcount/resources.resourcescount):counter/2000;
        tempcxt.fillRect(0,cavMain.height-10, delta*cavMain.width,10);
        tempcxt.fillStyle = "#000000";
        tempcxt.font =  "BOLD 30px Roboto"
        tempcxt.fillText(Math.ceil( delta*100) + "%",cavMain.width*0.88,cavMain.height - 25);
        counter += counter<2000?10:0;                
        }
    }, 10);    
};

//game properties
var game_properties ={  
    game_time :0,
    Score : 0,
    kills :0,
    head_shots :0,
    bullet_health : 200,
    bullet_speed : 500,

    debug_mode : false,
}


var game_properties_initial = Object.assign({},this.game_properties);

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;
var previoustate;

//player 
var player_entity;
var mainviewport;
var sniper;





var fishsprites;
var enemy_sprites =[];

var timer = 0;
var nexttimer =2;

var next_obs = 0;

var text_color = "#000000";
var outline_color = "#ffffff";
var score_color = "#000000";


//mainmenu
function loadmainmenu(){

      
        let y = new Entity(images.Logo,0,0,true);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.85 - y2.size.y;
    
        y2.onclick = () => {       
            clearUI();
            //loadgameUI();
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true; 
        };    
        uiEntityList.push(y);
        uiEntityList.push(y2); 
      
      
}

function loadgameUI(){
    let y = new Button(images.Pause,70,70);
    y.pos.x = 35;
    y.pos.y = 20;

    y.onclick = () => {
        clearUI();
        loadpauseUI();
        resources.get(images.BG).pause();
        currentGameState = gameStates.pause;
    }
    uiEntityList.push(y);
}

function loadpauseUI() {

    let y2 = new Button(images.resume,0,0);
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,600,600,true);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        resources.get(images.BG).play();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
    uiEntityList.push(y3);
}

function gameOver() {      
    clearUI();
    currentGameState = gameStates.gameover;
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,600,600,true);
    let y2 = new Button(images.Playagain,0,0);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        resetgame();  
        help.timer = 0;  
        help.enabled = true;   
    }    
    uiEntityList.push(y2);
    uiEntityList.push(y);    
    uiEntityList.push(y3);     
}

function clearUI(){
    while(uiEntityList.length !=0)
    {
        uiEntityList.pop();
    }
}

function resetgame() {
    currentGameState = gameStates.game;
    game_properties = Object.assign({},game_properties_initial);

    entitylist =[];

    mainviewport.posx = 0;

    player_entity.pos = sniper.muzzle_pos();
    player_entity.done = true;
    player_entity.speedy =0;
    sniper.enabled = true;
    
    next_obs = cav.width + 500;
    
    entitylist.push(player_entity);
    entitylist.push(sniper);    
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    sniper = new Entity(images.sniper);
    sniper.update = ()=>{
        if(sniper.pos.x < mainviewport.posx -sniper.size.x)
        {
            this.enabled = false;
        }
    }
    sniper.muzzle_pos = ()=>{
        return {
            x: sniper.pos.x +439,
            y: sniper.pos.y +67,
        };
    }
    sniper.pos.y = 498;

    player_entity = new Player();
    player_entity.done = true;
    player_entity.pos = sniper.muzzle_pos();

    mainviewport.set_target(player_entity);
    mainviewport.lock_y = true;

    entitylist.push(player_entity); 
    entitylist.push(sniper); 

    next_obs = cav.width;

    entitylist.forEach((_ent)=>{
        _ent.init();
    })


    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;
    loadmainmenu();
    
    var helpAnimation = new Sprite(images.help,0,0); 
    help = new Entity(helpAnimation,0,0,true);
    help.order = 3;
    help.timer = 0;
    help.update = ()=> {
        if(help.timer>=3)
        {
            help.enabled=false;
        }
        help.timer += dt;
    }
    help.pos.x = cav.width/2 - help.size.x/3;
    help.pos.y = cav.height/2 - help.size.y/2;
    
    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;
    dt *= Engine.timeScale;
    

    checkOrientation();
    
    DrawBackground();

    switch(currentGameState)
    {     
         
        case gameStates.menu:  
            draw(player_entity);
            game_properties.game_time += dt;        
            break;
        case gameStates.game:
            mainviewport.update();  

            timer += dt;
            game_properties.game_time += dt; 
            if(!player_entity.done)
            {
            game_properties.bullet_health -= dt*5;
            }
            if(!resources.get(images.wind).paused){
                let progress =resources.get(images.wind).currentTime/resources.get(images.wind).duration;
                resources.get(images.wind).volume = progress<=0.5?1:Math.sin( Math.PI * progress );  
            }
            // game_properties.real_score += -game_properties.island_speed * dt;
            // game_properties.Score = Math.floor(game_properties.real_score/10);

            if(next_obs -player_entity.pos.x < cav.width)
            {
                let tobs = new Obstacle();
                tobs.pos.x = next_obs;
                tobs.spawn_enemy();
                entitylist.push(tobs);
                next_obs += cav.width * 0.3 + Math.random()*cav.width*0.2;
            }

            if(timer > nexttimer)
            {}            
            


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            drawCall(()=>{
                cxt.fillStyle = score_color;
                cxt.font = "70px GameFont";
                cxt.fillText(game_properties.Score,145,70);  
                cxt.fillText(game_properties.kills,825,70);
                cxt.fillText(game_properties.head_shots,1138,70);  
                
                cxt.fillStyle = "#660504"
                cxt.fillRect(368,27, (game_properties.bullet_health/200)*300,38);

                cxt.strokeStyle = "#000000";
                cxt.lineWidth = 4;
                cxt.strokeRect(368,27,300,38);
                cxt.textAlign = "start";
                cxt.drawImage(resources.get(images.hud),0,0,resources.get(images.hud).width,resources.get(images.hud).height);
                },2);
           
            

            help.updateMain();
            draw(help);
            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                draw(e);
            });

            drawCall(()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 550/2 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 550/2 + 70);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 
        
        game_properties.game_time += dt;  
        entitylist.forEach(e=>{
            //e.updateMain();
            if(!(e instanceof Player))
            {
                draw(e);  
            }            
        });

        drawCall(()=>
            {
            cxt.font = "70px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + 500/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 500/2 + 50 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 500/2 + 120);
            cxt.textAlign = "start"; 
            },2);

            drawCall(()=>{
                cxt.fillStyle = score_color;
                cxt.font = "70px GameFont";
                cxt.fillText(game_properties.Score,145,70);  
                cxt.fillText(game_properties.kills,825,70);
                cxt.fillText(game_properties.head_shots,1138,70);  
                
                cxt.fillStyle = "#660504"
                cxt.fillRect(368,27, (game_properties.bullet_health/200)*300,38);
    
                cxt.strokeStyle = "#000000";
                cxt.lineWidth = 4;
                cxt.strokeRect(368,27,300,38);
                cxt.textAlign = "start";
                cxt.drawImage(resources.get(images.hud),0,0,resources.get(images.hud).width,resources.get(images.hud).height);
                },0.9);

            break;
        case gameStates.orientation:
            drawCall(()=>{
            cxt.fillStyle = "#ffffff";
            cxt.fillRect(0,0,cav.width,cav.height);
            cxt.drawImage(resources.get(images.P_L),0,0,resources.get(images.P_L).width*2,resources.get(images.P_L).height/2);
            },11);
            break;
        default:         
        break;       
    }
    
    uiEntityList.forEach(e=>{
        draw(e);
    });

    entitylist= entitylist.filter(e=>{
        if(e.enabled)
        {
            return e;
        }
    })

    oldmousestate = keyState["mouse"];


    Rendering.renderDrawCalls();
    
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);

    keyStateOld = JSON.parse(JSON.stringify(keyState));
    
    requestAnimationFrame(main);  
};


class Player extends Entity{
    constructor()
    {
        super(images.bullet);
        this.angle = Math.PI*2;
        this.speedy = 0;
        this.yAcceleration = 10;
        this.target_angle =  Math.PI*2;
        this.update = ()=>
        {
           if(game_properties.bullet_health <=0)
           {
               gameOver();
           }

           
           

           if(!this.done)
            {
                if(this.pos.y==0 || this.pos.y == cav.height)
            {
               game_properties.bullet_health -= dt*100;
               
                this.speedy =0;
               

            }
                if(keyState["mouse"])
                {
                    this.speedy -= 10 * 20 * dt;
                    this.target_angle = Math.PI * 1.8;  
                }
                else
                {
                    this.speedy += 10 * 10 * dt;  
                    this.target_angle = Math.PI * 2.2; 
                }

                this.pos.y += this.speedy * dt;

                this.pos.x += game_properties.bullet_speed *dt;

                this.angle = Math.atan( this.speedy/game_properties.bullet_speed);
            

            this.pos.y = clamp( this.pos.y,0,cav.height);
            }
            
        }
        this.draw = (context)=>{
            if(!this.done)
            {
            context.imageSmoothingEnabled = !this.sprite.ispixel;
            context.save();
            context.globalAlpha = this.opacity;
            let screen_space ={x:this.pos.x - mainviewport.posx,
                                y:this.pos.y - mainviewport.posy}
            context.translate( screen_space.x,screen_space.y);
            context.rotate(this.angle);
            context.drawImage(this.sprite.image,0,-this.size.y/2,this.size.x,this.size.y); 
            context.translate(-screen_space.x,-screen_space.y );
            context.restore();
            }
        }
        this.sounds = ()=>{
            resources.get(images.wind).currentTime=0;
            resources.get(images.gun_shot).currentTime=0;
            resources.get(images.wind).play();
            resources.get(images.gun_shot).play();            
        }
    }

}

class Obstacle extends Entity{
    constructor()
    { 
        super(null, 32 + Math.random()*100 ,120 + Math.random()*160)
        this.pos.y = Math.random()>0.7?0:cav.height-this.size.y;
        this.update = ()=>
        {
            if(physics.checkCollision(player_entity,this))
            {
                game_properties.bullet_health -= 50*dt;  
                resources.get(images.impact_enemy).play();              
            }
            if(this.pos.x <= mainviewport.posx - this.size.x)
            {
                this.enabled = false;
            }
        }
        this.spawn_enemy = ()=>
        {
            if(Math.random()>0.6 && this.pos.y!=0)
            {
                let te =new Enemy();
                te.pos.x = this.pos.x + 30;
                te.pos.y = cav.height - te.size.y;
                te.init();
                entitylist.push(te);   
            }
        }
        this.draw = (context)=>{
            if(this.enabled && !this.done){
                if(this.opacity<1)
                {
                    context.save();
                    context.globalAlpha = this.opacity;
                }
                else if(this.opacity<=0)
                {
                    return;
                }
                context.fillStyle = "#000000";        
                context.fillRect(this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);                 
                if(this.opacity!=1)
                {
                    context.restore();
                }     
            }
        }
    } 
}

class Enemy extends Entity{
    constructor()
    {
        super(images.enemy)
        {
            this.head_box = new Entity(null,53,42)
            this.body_box = new Entity(null,150,148)
            this.dead = false;
            this.init =()=>{
                this.head_box.pos.x =this.pos.x + 187;
                this.head_box.pos.y =this.pos.y;
                this.body_box.pos.x =this.pos.x + 142;
                this.body_box.pos.y =this.pos.y + 42;
            }
            this.update = ()=>{
                if(this.pos.x <= mainviewport.posx - this.size.x)
                    {
                        this.enabled = false;
                    }
                if(!this.dead)
                {
                    
                    if(physics.checkCollision(player_entity,this.head_box))
                    {
                        this.dead=true;
                        game_properties.bullet_health -= 2;
                        game_properties.head_shots ++;
                        game_properties.kills ++;
                        game_properties.Score += 25;
                        resources.get(images.impact).currentTime =0;
                        resources.get(images.impact).play(); 
                        spawn_blood();
                    }
                    else if(physics.checkCollision(player_entity,this.body_box))
                    {
                        this.dead=true;
                        game_properties.bullet_health -= 5;
                        game_properties.kills ++;
                        game_properties.Score += 10;
                        resources.get(images.impact).currentTime =0;
                        resources.get(images.impact).play(); 
                        spawn_blood();
                    }
                }   
            }
        }
    }
}

class Blood extends Entity{
    constructor()
    {
        let t_b = new SpriteAnimation(images.blood,0,0,[0,1,2,3,4],100,100,6,1);
        t_b.loop = false;
        super(t_b);
        this.pos.x = player_entity.pos.x ;
        this.pos.y = player_entity.pos.y - this.size.y/2;
        this.update = ()=>{
            if(this.sprite.done)
            {
                this.enabled=false;                
            }
        }
    }
}





function DrawBackground()
{ 
    let p1 = resources.get(images.p1);
    let p2 = resources.get(images.p2);
    let b0 = resources.get(images.Background);

    let p1x = - Math.floor((mainviewport.posx/1.1) % p1.width);
    let p2x = - Math.floor((mainviewport.posx/1.5) % p2.width);

    drawCall(()=>{ 
         cxt.imageSmoothingEnabled = false;
         cxt.drawImage(b0,0,0,cav.width,cav.height);
         cxt.fillStyle = "#000000";
         
    },-2);  

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p1,p1x,mainviewport.height-p1.height,p1.width,p1.height);
        if(p1x + cav.width <= cav.width)
        {
            cxt.drawImage(p1,p1x+p1.width-1,mainviewport.height-p1.height,p1.width ,p1.height ); 
        } 
    },-0.5);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p2,p2x,mainviewport.height-p2.height/1.5,p2.width,p2.height);
        if(p2x + cav.width <= cav.width)
        {
            cxt.drawImage(p2,p2x+p2.width-1,mainviewport.height-p2.height/1.5,p2.width,p2.height); 
        } 
    },-0.6);
    drawCall(()=>{
    cxt.fillRect( 0, cav.height-40,cav.width,40);
    },-0.4); 
     
}

var spawn_blood = ()=>
{
    entitylist.push(new Blood());
}



function checkOrientation() {
    if(game_orientation == 0)
    {
        return;
    }
    
    if(window.innerWidth < window.innerHeight && currentGameState != gameStates.orientation){
        previoustate = currentGameState;
        currentGameState = gameStates.orientation;        
    }
    else if(currentGameState == gameStates.orientation && window.innerWidth > window.innerHeight)
    {
        currentGameState = previoustate;
        clearUI();
        switch(currentGameState)
        {
            case gameStates.menu:
                loadmainmenu();
                break;
            case gameStates.pause:
                loadpauseUI();
                break;
            case gameStates.game:
                loadgameUI();
                break;
            case gameStates.gameover:
                gameOver();
                break;
            default:
                loadgameUI();
                break;
        }      
    }
}
onGameVisibilityChangePause = ()=>{
}