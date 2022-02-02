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

    player : "./assets/sprites/animations/player_180_124.png",
    player_jump : "./assets/sprites/animations/jump.png",
    p1 : "./assets/sprites/p1.png",
    p2 : "./assets/sprites/p2.png",
    p3 : "./assets/sprites/p3.png",
    flag : "./assets/sprites/animations/14_34.png",
    stones : "./assets/sprites/stones.png",
     
    BG : "./assets/sound/BG.mp3", 
    tap_1 : "./assets/sound/bounce.wav",
    running_loop : "./assets/sound/horse_loop.mp3",
    jump_sfx : "./assets/sound/jump.mp3",
    land_sfx : "./assets/sound/land.mp3",
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
        //tempcxt.drawImage(y,cavMain.width/2 - nwidth/2,0,nwidth,cavMain.height);
        tempcxt.fillStyle = "#ff0000";
        let delta =  (resources.resourcesloadedcount/resources.resourcescount)< counter/2000?(resources.resourcesloadedcount/resources.resourcescount):counter/2000;
        tempcxt.fillRect(0,cavMain.height-10, delta*cavMain.width,10);
        tempcxt.fillStyle = "#000000";
        tempcxt.font =  "BOLD 30px Roboto"
        //tempcxt.fillText(Math.ceil( delta*100) + "%",cavMain.width*0.88,cavMain.height - 25);
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
    jump_height : 180,
    jump_length : 500,
    player_speed : 500,
        
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
var flag=null;

//player 
var player_entity;
var mainviewport;


var fishsprites;
var enemy_sprites =[];

var timer = 0;
var nexttimer =2;

var text_color = "#ffffff";
var outline_color = "#000000";
var score_color = "#ffffff";


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
        resources.get(images.running_loop).volume = 0;
        currentGameState = gameStates.pause;
    }
    uiEntityList.push(y);
}

function loadpauseUI() {

    let y2 = new Button(images.resume,0,0);
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,0,0,true);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
    uiEntityList.push(y3);
}

function gameOver() {      
    clearUI();
    currentGameState = gameStates.gameover;
    resources.get(images.running_loop).volume = 0;
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,0,0,true);
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
    game_properties = Object.assign({},this.game_properties_initial);

    entitylist =[];
    flag.pos.x = cav.width/2;

    entitylist.push(player_entity);
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);
    

    for (let index = 0; index < 4; index++) {
        let t = new Sprite( images.obstacles,133 * index,0,133,133);
        enemy_sprites.push(t);        
    }

    player_entity = new Player();
    player_entity.pos.x = mainviewport.posx + mainviewport.width*0.2 - player_entity.size.x/2;
    player_entity.pos.y = 400;
    flag = new Flag();

    console.log(player_entity.pos);
    console.log(mainviewport.posx);
    resources.get(images.running_loop).loop = true;

    entitylist.push(player_entity);
    entitylist.push(flag);

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    mainviewport.set_target(player_entity);

    Rendering.setContext(cxt);
    currentGameState = gameStates.game;
    //loadmainmenu();
    resources.get(images.BG).loop = true;
    resources.get(images.BG).oncanplay = () =>
    {
        try{
        resources.get(images.BG).play();
        }
        catch(e){}        
    };
    
    var helpAnimation = new SpriteAnimation(images.Help_animation,0,0,[0,1,0],500,500,2,1); 
    helpAnimation.loop = true;
    help = new Entity(helpAnimation,0,0,true);
    help.order = 3;
    help.timer = 0;
    help.update = ()=> {
        if(help.timer>=2.2)
        {
            help.enabled=false;
        }
        help.timer += dt;
    }
    help.pos.x = cav.width/2 - help.size.x/2;
    help.pos.y = cav.height/2 - help.size.y/2;
    main();
    
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;
    if(dt> 0.1)
    {
        dt = 0.016
    }

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
            game_properties.player_speed += dt * 2;
            game_properties.real_score += dt;
            game_properties.Score = Math.floor(game_properties.real_score);

            if(timer>nexttimer)
            {
                //entitylist.push(new Obstacle());
                timer = 0;
                nexttimer = 1 + Math.random()*4;
                
            }


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            /*drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = outline_color;             
                cxt.font = "bold 100px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,95);
                cxt.fillStyle = score_color;
                cxt.font = "bold 100px GameFont";
                cxt.fillText(game_properties.Score,cav.width-100,95);  
                cxt.textAlign = "start";  

                },2);
            */
           

            help.updateMain();
            draw(help);
            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                draw(e);
            })

            drawCall(()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "100px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 );
            cxt.font = "100px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 70);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 
        game_properties.game_time += dt;  
        entitylist.forEach(e=>{
            if(! (e instanceof Player) ){
            e.updateMain();
            draw(e);
            }
        });

        drawCall(()=>
            {
            cxt.font = "100px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "100px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 50 );
            cxt.font = "100px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 120);
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
        let player_sprite = new SpriteAnimation(images.player,0,0,getArrayFromRange(0,13),180,127,20,1);
        player_sprite.ispixel = true;
        super(player_sprite);
        this.jump_sprite = new SpriteAnimation(images.player_jump,0,0,getArrayFromRange(0,3),180,127,20,1);
        this.jump_sprite.play = false;
        this.jump_sprite.ispixel = true;
        this.size.x = 300;
        this.size.y = 212;
        this.jump_length=400;
        this.jump_start = -5000;
        this.jump_height = 100;
        this.isjumping = false;

        this.update = ()=>{
            console.log(player_entity.pos);
            
            this.pos.x += game_properties.player_speed * dt;
            console.log(player_entity.pos);
            if(!this.isjumping)
            {
                if(resources.get(images.running_loop).volume == 0)
                {    
                    //resources.get(images.running_loop).currentTime =0;               
                    //resources.get(images.running_loop).volume = 1;
                }
                if(resources.get(images.running_loop).paused)
                {
                    //resources.get(images.running_loop).play(); 
                }
            }

            let jump_percent = (this.pos.x - this.jump_start)/this.jump_length;
            if(jump_percent<1)
            {
                this.sprite = this.jump_sprite;
                this.jump_sprite.currentframe = this.jump_sprite.keyframes[ Math.floor( jump_percent * this.jump_sprite.keyframes.length) ];
                this.pos.y = 400 - Math.sin(Math.PI * jump_percent)*this.jump_height;
                this.isjumping =true;
            }
            else
            {
                if(this.isjumping)
                {
                    resources.get(images.land_sfx).currentTime =0;
                    resources.get(images.land_sfx).play();
                }
                this.sprite = player_sprite;
                this.isjumping=false;
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
            drawcircle( this.radius,this.center);
            }
        }
        this.jump = (amnt=200,length=400) =>{
            if(this.isjumping)
            {
                return;
            }
            this.jump_start = this.pos.x;
            this.jump_height = amnt;
            this.jump_length = length;
            resources.get(images.jump_sfx).currentTime =0;
            resources.get(images.jump_sfx).play();

            this.isjumping = true;            
            resources.get(images.running_loop).volume = 0;
            
        }
        
    }
    
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2
            ,y:this.pos.y + this.size.y/2
        };
    } 
    get radius()
    {
        return this.size.y/2.5;
    }

}

class Obstacle extends Entity{
    constructor()
    {
        super(images.stones)
        {
            this.pos.x = mainviewport.posx + cav.width;            
            let size_roll= 2 + Math.random()*0.5;
            this.size.x *= size_roll;
            this.size.y *= size_roll;
            this.pos.y = 400 + player_entity.size.y - this.size.y;

            this.update = ()=>{
                if(this.pos.x + this.size.x < mainviewport.posx )
                {
                    this.enabled = false;
                }
                let dist = Math.sqrt(  Math.pow (player_entity.center.x - this.center.x,2) + Math.pow (player_entity.center.y -  this.center.y,2));
            
                let distmax = this.radius + player_entity.radius;

                if(dist < distmax && currentGameState == gameStates.game)
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
                drawcircle( this.radius,this.center);
                }
            }

        }
    }
    get center()
    {
        return {
            x:this.pos.x + this.size.x/2
            ,y:this.pos.y + this.size.y/2
        };
    } 
    get radius()
    {
        return this.size.y/2;
    }
}
class Flag extends Entity{
    constructor()
    {
        let f_image = new SpriteAnimation(images.flag,0,0,[0,1,2,3],13,34,6,1);
        f_image.ispixel = true;
        super(f_image)
        this.order = -0.1;
        this.size.x *= 4;
        this.size.y *= 4;
        this.pos.x = mainviewport.posx + mainviewport.width;
        this.pos.y = 400  + player_entity.size.y*0.5 -  this.size.y;
        this.update = () => {
            if(this.pos.x + this.size.x < mainviewport.posx)
            {
                this.pos.x = mainviewport.posx + mainviewport.width + 100 +Math.random()*1280*2;
            }
        }
    }
}



function DrawBackground()
{
        
    let p1 = resources.get(images.p1);
    let p2 = resources.get(images.p2);
    let p3 = resources.get(images.p3);
    let p1x = - Math.floor(mainviewport.posx % cav.width); 
    let p2x = - Math.floor((mainviewport.posx/game_properties.paralax_2_amt) % cav.width);
    let p3x = - Math.floor((mainviewport.posx/game_properties.paralax_3_amt) % cav.width);

    
    drawCall(()=>{ 
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
    },-2);
    

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p1,p1x,0-mainviewport.posy,cav.width,cav.height);
        if(p1x + cav.width <= cav.width)
        {
            cxt.drawImage(p1,p1x+cav.width-1,0-mainviewport.posy,cav.width,cav.height); 
        } 
    },-1);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p3,p3x,-20-mainviewport.posy/4,cav.width,cav.height);
        if(p3x + cav.width <= cav.width)
        {
            cxt.drawImage(p3,p3x+cav.width-1,-20-mainviewport.posy/4,cav.width,cav.height); 
        } 
    },-1.5);

    drawCall(
        ()=>{
            cxt.imageSmoothingEnabled = false;
            cxt.drawImage(p2,p2x,0,cav.width,cav.height);
            if(p2x + cav.width <= cav.width)
            {
            cxt.drawImage(p2,p2x+cav.width-1,0,cav.width,cav.height); 
            }
        }
        ,-1.9);
    
}

function drawcircle(radius,center)
{
    cxt.beginPath();
    cxt.arc(center.x - mainviewport.posx,center.y-mainviewport.posy,radius,0,Math.PI*2);
    cxt.strokeStyle ="#FF0000";
    cxt.lineWidth = 5;
    cxt.stroke();
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