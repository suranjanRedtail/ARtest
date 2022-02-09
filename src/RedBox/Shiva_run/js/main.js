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
    GameOver : "./assets/sound/game_over.wav",
    board : "./assets/sprites/board.png",    
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png",
    help : "./assets/sprites/help.png",

    p1 : "./assets/sprites/parallax-1.png",
    p2 : "./assets/sprites/parallax-2.png",
    p3 : "./assets/sprites/parallax-3.png",
    p4 : "./assets/sprites/parallax-4.png",
    p5 : "./assets/sprites/parallax-5.png",
    player : "./assets/sprites/player.png",
    monster : "./assets/sprites/monster.png",
    gap : "./assets/sprites/gap.png",
     
    BG : "./assets/sound/BG.mp3", 
    //tap_1 : "./assets/sound/bounce.wav",
    coin : "./assets/sound/coin.wav",
    jump_sfx : "./assets/sound/h2.wav",
    land_sfx : "./assets/sound/land.mp3",
    attack : "./assets/sound/W2.mp3"
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
    Score:0,
    game_time :0,
    enemy_speed : 300,
    Score : 0,
    real_score : 0,
    paralax_2_amt : 2,
    paralax_3_amt : 1.5,
    jump_height : 100,
    jump_length : 300,
    player_speed : 300,
    has_ran :0,
    slide_duration : 0.6,
    jump_duration : 1,
    min_obs_dist : 100,
    Obs_dist : 500,
        
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


var fishsprites;
var enemy_sprites =[];

var timer = 0;
var nexttimer =2;

var next_obs = 0;

var text_color = "#D8912C";
var outline_color = "#000000";
var score_color = "#FFDAB6";


//mainmenu
function loadmainmenu(){

      
        let y = new Entity(images.Logo,0,0,true);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.85 - y2.size.y;
    
        y2.onclick = () => {
            setTimeout(() => {
                resources.get(images.BG).play();
            }, 200);        
            clearUI();
            loadgameUI();
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
    resources.get(images.BG).pause();
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
        loadgameUI();
        resetgame();  
        resources.get(images.BG).play();    
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
   
    resources.get(images.BG).currentTime =0;

    player_entity.pos.x = cav.width*0.2 - player_entity.size.x/2;
    player_entity.issliding = false;
    player_entity.jump_timer = 0;
    player_entity.isfalling = false;
    player_entity.speedy = 0;
    player_entity.pos.y = 550;
    player_entity.timer =0;

    mainviewport.posx = 0;
    next_obs = player_entity.pos.x + cav.width*2;

    
    entitylist.push(player_entity);

    
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);


    for (let index = 0; index < 4; index++) {
        let t = new Sprite( images.obstacles,133 * index,0,133,133);
        //enemy_sprites.push(t);        
    }

    player_entity = new Player();
    player_entity.pos.x = cav.width*0.2 - player_entity.size.x/2;
    player_entity.pos.y = 550;

    entitylist.push(player_entity);
    next_obs = player_entity.pos.x + cav.width*2;  

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    mainviewport.set_target(player_entity);
    mainviewport.lock_y = true;

    Rendering.setContext(cxt);
    currentGameState = gameStates.menu;
    loadmainmenu();
    resources.get(images.BG).loop = true;
    resources.get(images.BG).oncanplay = () =>
    {
        try{
        resources.get(images.BG).play();
        }
        catch(e){}        
    };
    
    var helpAnimation = new Sprite(images.help,0,0); 
    helpAnimation.ispixel = true;
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
            game_properties.player_speed += dt * 3;
            //game_properties.Score = Math.floor(player_entity.pos.x/100);

            if(next_obs - player_entity.pos.x < cav.width)
            {
                entitylist.push(new Obstacle( Math.floor(Math.random()*1.99) ));
                entitylist[ entitylist.length-1].pos.x = next_obs;
                next_obs += game_properties.min_obs_dist + (Math.random() * game_properties.Obs_dist) + entitylist[ entitylist.length-1].size.x ;
            }


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = outline_color;             
                cxt.font = "bold 70px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,70);
                cxt.fillStyle = score_color;
                cxt.font = "bold 70px GameFont";
                cxt.fillText(game_properties.Score,cav.width-100,70);  
                cxt.textAlign = "start";  

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
            draw(e);
        });

        drawCall(()=>
            {
            cxt.font = "70px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + 550/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 550/2 + 50 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 550/2 + 120);
            cxt.textAlign = "start"; 
            },2);

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
        let player_sprite = new SpriteAnimation(images.player,0,0,[0,1,2],159,100,6,1);
        super(player_sprite);
        this.jump_sprite = new SpriteAnimation(images.player,0,0,[3,4,5],159,100,3,1);
        let slide_sprite = new SpriteAnimation(images.player,0,0,[7],159,100,1,1);
        this.jump_sprite.play = false;
        this.jump_length=400;
        this.jump_start = -5000;
        this.jump_height = 100;
        this.isjumping = false;
        this.issliding = false;
        this.jump_slide = false;
        this.slide_timer = 0;
        this.jump_timer = 0;
        this.isfalling = false;
        this.speedy =0;
        this.timer = 0;

        this.init = ()=>{
            this.sprite.currentframe = 0;
        }

        this.update = ()=>{
            this.timer +=dt;
            player_sprite.speed = game_properties.player_speed/game_properties_initial.player_speed;
            if(!this.isfalling)
            {
            this.pos.x += game_properties.player_speed * dt;
            }
            else if(this.isfalling)
            {
            this.pos.x += game_properties.player_speed/3 * dt;
            this.speedy += dt * 10 * 100;
            this.pos.y += this.speedy * dt;
            this.sprite.speed = 0;
            }

            if(this.issliding)
            {
                if(this.isjumping)
                {
                    //this.jump_start -= dt* game_properties.player_speed/2;
                    this.jump_timer -= dt;
                    this.jump_slide = true;
                    this.slide_timer += dt;
                }
                else if(this.jump_slide)
                {                    
                }
                else
                {
                    this.pos.x -= dt * game_properties.player_speed * 0.1;
                }
                this.pos.x -=dt * game_properties.player_speed * 0.1;
                this.sprite = slide_sprite;
                this.slide_timer -= dt;
                
                if(this.slide_timer <=0)
                {
                    this.issliding=false;
                    this.jump_slide = false;                    
                }
            } 
            //let jump_percent = (this.pos.x - this.jump_start)/this.jump_length;
            let jump_percent = 1 - (this.jump_timer/game_properties.jump_duration);
            if(jump_percent<1)
            {
                this.sprite = this.jump_sprite;
                this.jump_sprite.currentframe = this.jump_sprite.keyframes[jump_percent<=0.1?0:jump_percent<=0.6?1:2];
                this.pos.y = 550 - Math.sin(Math.PI * jump_percent)*this.jump_height;
                this.isjumping =true;
                this.jump_timer -= dt;
            }
            else
            {
                if(this.isjumping)
                {
                    resources.get(images.land_sfx).currentTime =0;
                    resources.get(images.land_sfx).play();
                    if(game_properties.player_speed>1000 && !this.issliding)
                    {
                    this.issliding = true;
                    this.slide_timer = game_properties.slide_duration/3;
                    }

                }
                if(!this.issliding)
                {
                this.sprite = player_sprite;
                }
                if(!this.isfalling)
                {
                this.pos.y = 550;
                }

                this.isjumping=false;
            }  
            if(player_entity.pos.y > mainviewport.posy+mainviewport.height)
            {
                resources.get(images.GameOver).currentTime =0;
                resources.get(images.GameOver).play();
                gameOver();
            }         
                       
        }
        this.draw = (context) =>{
            if(this.enabled && !this.done){
                if(this.ui)
                {
                this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);       
                }
                else{            
                    this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                }      
            }
            if(game_properties.debug_mode)
            {
            drawCircle( this.radius,this.center);
            }
        }
        this.jump = (amnt=game_properties.jump_height,length=game_properties.jump_length) =>{
            if(this.isjumping)
            {
                return;
            }
            this.issliding = false;
            this.jump_timer = game_properties.jump_duration;
            this.jump_start = this.pos.x;
            this.jump_height = amnt;
            this.jump_length = length;
            resources.get(images.jump_sfx).currentTime =0;
            resources.get(images.jump_sfx).play();

            this.isjumping = true;            
            
            
        }
        this.slide = (duration = game_properties.slide_duration)=>{
            if(!this.issliding)
            {
                resources.get(images.attack).currentTime =0;
                resources.get(images.attack).play();
            }
            this.slide_timer = duration;
            this.issliding = true;
        }
        Engine.onSwipeUp.push( ()=>{if(currentGameState==gameStates.game && !this.isfalling){ this.jump()}});   
        Engine.onSwipeDown.push( ()=>{if(currentGameState==gameStates.game){ this.slide()}});  
        Engine.onMouseUp.push( ()=>{if(currentGameState==gameStates.game && this.timer > 1){ this.slide()}});        
    }
    
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2.5
            ,y:this.pos.y + this.size.y/2
        };
    } 
    get radius()
    {
        return this.size.y/4.5;
    }

}

class Obstacle extends Entity{
    constructor(type=0)
    {   
        if(type==0)
        {
            super(images.gap);
        }
        else
        {
            super(images.monster);
        }
        this.type = type;
        this.sprite.ispixel = true;
        this.pos.x = mainviewport.posx + cav.width; 
        if(type==0)
        {
            this.pos.y = 625;
            this.size.x *= 1 +(Math.random()*1.5)
        }
        else
        {            
            this.size.x *= 1.5;
            this.size.y *= 1.5;
            this.pos.y = 500;
        }
        this.dying = false;
        this.order = -0.01;

        this.update = ()=>{
            if(this.dying)
            {
                this.opacity -= (1 / 0.2 ) * dt;
            }
            if(this.pos.x + this.size.x < mainviewport.posx || this.opacity<=0)
            {
                this.enabled = false;
            }
            if(!this.dying)
            {
                let dist = Math.sqrt( Math.pow (player_entity.center.x - this.center.x,2) + Math.pow (player_entity.center.y -  this.center.y,2));
                let distmax = this.radius + player_entity.radius;
                if(dist < distmax && currentGameState == gameStates.game)
            {   
                if(type ==0)
                {
                    return;
                }
                if( type ==1 && player_entity.issliding && !player_entity.isjumping){
                    this.dying = true;
                    game_properties.Score += 100;
                    resources.get(images.coin).currentTime =0;
                    resources.get(images.coin).play();
                }
                else
                {
                resources.get(images.GameOver).currentTime =0;
                resources.get(images.GameOver).play();
                gameOver();
                }                
            }
            }
            let overlap_length = physics.checkOverlapX_Length(this,player_entity);
            if( this.type == 0 && overlap_length>102)
            {
                player_entity.isfalling = true;
                
            }

            if(game_properties.debug_mode)
            {
                drawCall( ()=>
                {            
                    drawCircle( this.radius,this.center); 
                }
                ,this.order);
            }   
        }
    }
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2
            ,y:this.pos.y + this.size.y/4
        };
    } 
    get radius()
    {
        return this.size.y/2.5;
    }
}




function DrawBackground()
{        
    let p1 = resources.get(images.p1);
    let p2 = resources.get(images.p2);
    let p3 = resources.get(images.p3);
    let p4 = resources.get(images.p4);
    let p5 = resources.get(images.p5);
    let b0 = resources.get(images.Background);

    
    let p1x = - Math.floor(mainviewport.posx % cav.width); 
    let p2x = - Math.floor((mainviewport.posx/1.1) % cav.width);
    let p3x = - Math.floor((mainviewport.posx/1.5) % cav.width);
    let p4x = - Math.floor((mainviewport.posx/2) % cav.width);
    let p5x = - Math.floor((mainviewport.posx/2.5) % cav.width);

    drawCall(()=>{ 
         cxt.imageSmoothingEnabled = false;
         cxt.drawImage(b0,0,0,b0.width,b0.height);
    },-2);

    

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p1,p1x,625-mainviewport.posy,p1.width,p1.height);
        if(p1x + cav.width <= cav.width)
        {
            cxt.drawImage(p1,p1x+cav.width-1,625-mainviewport.posy,p1.width ,p1.height ); 
        } 
    },-0.5);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p2,p2x,376-mainviewport.posy,p2.width,p2.height);
        if(p2x + cav.width <= cav.width)
        {
            cxt.drawImage(p2,p2x+cav.width-1,376-mainviewport.posy,p2.width,p2.height); 
        } 
    },-0.6);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p3,p3x,236,p3.width,p3.height);
        if(p3x + cav.width <= cav.width)
        {
            cxt.drawImage(p3,p3x+cav.width-1,236,p3.width,p3.height); 
        } 
    },-0.7);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p4,p4x,308,p4.width,p4.height);
        if(p4x + cav.width <= cav.width)
        {
            cxt.drawImage(p4,p4x+cav.width-1,308,p4.width,p4.height); 
        } 
    },-0.8);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p5,p5x,202,p5.width,p5.height);
        if(p5x + cav.width <= cav.width)
        {
            cxt.drawImage(p5,p5x+cav.width-1,202,p5.width,p5.height); 
        } 
    },-0.9);
    
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