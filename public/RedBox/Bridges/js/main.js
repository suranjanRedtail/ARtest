var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");


//resizing canvas
cav.width = 1280;
cav.height = 720;

cavMain.width = 1280;
cavMain.height = 720;



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3, 
    orientation:4, 
}

var text_color = "#ffffff";
var pause_text_color = "#213919";

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

    clouds : "./assets/sprites/clouds.png",
    p1 : "./assets/sprites/paralex-1.png",
    p2 : "./assets/sprites/paralex-2.png",
    player :"./assets/sprites/player.png",
    ground :"./assets/sprites/ground.png",
    bridge :"./assets/sprites/bridge.png",
    tap_1 : "./assets/sound/bounce.wav",   
    coin : "./assets/sound/coin.wav",      
    BG : "./assets/sound/BG.mp3", 
    fire : "./assets/sprites/animations/firefirefire2.png",
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
    bridgespeed : 500,
    fire_speed :100, 
    time_scale : 1,
}

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
var fire_entity;
var groundmanager;
var gamemanager;
var clouds;

var timer = 0;
var nexttimer =2;
var groundposy = (cav.height/2) + 182;



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
    resources.get(images.GameOver).currentTime =0;
    resources.get(images.GameOver).play();
    currentGameState = gameStates.gameover;
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
    game_properties ={  
        Score:0,
        game_time :0,
        bridgespeed : 500,
        fire_speed :100,  
        time_scale : 1,      
    }
    fire_entity.pos.x = -fire_entity.size.x;
    entitylist = [];
    groundmanager.groundlist = [];
    mainviewport.posx = 0;
    clouds.reset();
    entitylist.push(player_entity);
    entitylist.push(fire_entity);
    entitylist.push(clouds);
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);
    let fanim = new SpriteAnimation(images.fire,0,0,[0,1,2],349,720,6,1);
    fire_entity = new Entity(fanim);
    player_entity = new Player();
    player_entity.pos.x = cav.width*0.3;
    player_entity.targetposx = cav.width*0.3;;
    
    clouds = new Clouds();

    fire_entity.pos.x = -fire_entity.size.x;

    fire_entity.update = () => {
        fire_entity.pos.x += game_properties.fire_speed * dt; 
        if(player_entity.pos.x - fire_entity.pos.x - fire_entity.size.x > (cav.width * 0.6))
        {
            fire_entity.pos.x =  -fire_entity.size.x + player_entity.pos.x - cav.width * 0.6;
        }
        else if(player_entity.pos.x + 300  - fire_entity.pos.x - fire_entity.size.x < 0 && currentGameState == gameStates.game)
        {
            gameOver();
        }            
    }

    fire_entity.draw =(context)=> {
        context.fillStyle = "#b82720";
        if(fire_entity.pos.x-mainviewport.posx > 0)
        {
            context.fillRect(0,0,fire_entity.pos.x -mainviewport.posx + 50,cav.height);
        }
        fire_entity.sprite.draw(context,fire_entity.pos.x- mainviewport.posx,fire_entity.pos.y- mainviewport.posy,fire_entity.size.x,fire_entity.size.y);
    }

    fire_entity.order = 0.01;

    
    
    groundmanager = new Groundmanager();
    gamemanager = new Gamemanager();

    entitylist.push(player_entity);
    entitylist.push(fire_entity);
    entitylist.push(clouds);

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
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
    dt *= game_properties.time_scale;

    checkOrientation();
    
    DrawBackground();
    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:
            groundmanager.update();
            mainviewport.update();

            game_properties.fire_speed += 1 * dt;
           

            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = text_color;             
                cxt.font = "bold 60px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,95);
                cxt.fillStyle = pause_text_color;
                cxt.font = "bold 60px GameFont";
                cxt.fillText(game_properties.Score,cav.width-100,95);  
                cxt.textAlign = "start";  
                },2);
            

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
            cxt.font = "60px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 );
            cxt.font = "60px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 70);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 

        entitylist.forEach(e=>{
            if(! (e instanceof Player) ){
            e.updateMain();
            draw(e);
            }
        });

        drawCall(()=>
            {
            cxt.font = "60px GameFont";            
            cxt.fillStyle = pause_text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "60px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 50 );
            cxt.font = "60px GameFont";            
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

function DrawBackground()
{
        
    let p1 = resources.get(images.p1);
    let p2 = resources.get(images.p2);
    let p1x = - Math.floor(mainviewport.posx % p1.width); 
    let p2x = - Math.floor((mainviewport.posx/1.4) % p2.width);

    
    drawCall(()=>{ cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height)},-1.9);
    

    drawCall(
        ()=>{
        cxt.drawImage(resources.get(images.p1),p1x,cav.height - p1.height,p1.width,p1.height);
        if(p1x + p1.width <= cav.width)
        {
        cxt.drawImage(resources.get(images.p1),p1x+p1.width-1,cav.height - p1.height,p1.width,p1.height); 
        } 
    },-1);

    drawCall(
        ()=>{
            cxt.drawImage(resources.get(images.p2),p2x,cav.height - p2.height - 50,p2.width,p2.height);
            if(p2x + p2.width <= cav.width)
            {
            cxt.drawImage(resources.get(images.p2),p2x+p2.width-1,cav.height - p2.height - 50,p2.width,p2.height); 
            }
        }
        ,-1.9);
    
}

class Player extends Entity{
    constructor()
    {
        let ts = new SpriteAnimation(images.player,0,0,[0,1,2,3],245,200,6,1);
        
        super(ts);
        this.sprites = [ts];
        this.sprites.push(new Sprite(images.player,245*4,0,245,200));
        this.targetposx = this.pos.x;
        this.size.x = 183;
        this.size.y = 150;
        this.pos.y = groundposy - this.size.y;
        
        this.state = "waiting";

        this.update =()=> {
            let delta = this.targetposx-this.pos.x;
            if(Math.abs(delta)>2 && delta>0)
            {
                this.pos.x += Math.sign(delta) *  game_properties.fire_speed * 2 *dt;//Math.max( game_properties.fire_speed * 2 *dt , 0.1 * Math.abs(delta));
                this.sprite = this.sprites[0];
                this.state = "moving";
                //this.sprite = player_sprites[1];
            }
            else
            {
                this.sprite = this.sprites[1];
                if(this.state == "moving")
                {
                    gamemanager.readyclick();
                    resources.get(images.coin).currentTime =0;
                    resources.get(images.coin).play();
                    game_properties.Score++;
                    game_properties.fire_speed -= 2;
                }
                this.pos.x = this.targetposx;
                this.state = "waiting";
                //this.sprite = player_sprites[0];
            }
        }
        this.settargetlocation = (ground) =>{
            this.targetposx = ground.pos.x + ground.size.x - this.size.x;
        }
    }
    
}

class Ground extends Entity{
    constructor(width)
    {
        let tempsprite = new Sprite(images.bridge,0,0,width,0);        
        super(tempsprite); 
        this.nextspacing =0;
        this.pos.y = groundposy;
        this.update = ()=>{
            if(this.pos.x < mainviewport.posx-this.size.x)
            {
                this.enabled=false;
            }
        }  
        this.draw = (context)=>{
            if(this.enabled && !this.done){    
                let temp = resources.get(images.ground);
                context.drawImage(temp,this.pos.x+ (this.size.x/2) - mainviewport.posx - (temp.width/2),this.pos.y- mainviewport.posy,temp.width,temp.height);       
                this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);                     
            }
        } 
    }
}

class Bridge extends Entity{
    constructor()
    {
        super(images.bridge);
        this.currentlength = Math.random() * this.sprite.width;
        this.maxlength = this.sprite.width;
        this.angle = -Math.PI/2;
        this.targetangle =-Math.PI/2;
        this.maxspeed = Math.PI*1.5;
        this.opacity = 1;
        this.state = "waitingclick";
        this.dir =1;
        this.order = -0.01

        this.update = () => {
            
            switch(this.state)
            {
                case "waitingclick":  
                    if(currentGameState ==  gameStates.game)
                    {                  
                    this.currentlength += this.dir * game_properties.bridgespeed * dt;
                    }
                    if(this.currentlength < 0) 
                    {
                        this.currentlength =0;
                        this.dir *= -1; 
                    }
                    if(this.currentlength > this.maxlength)
                    {
                        this.currentlength = this.maxlength;
                        this.dir *= -1; 
                    }
                    break;
                case "dying":
                    this.opacity -= 1 * dt;
                    break;
                case "rotating":
                    let deltaAngle = this.targetangle-this.angle;
                    if(Math.abs(deltaAngle)>0.02 && Math.sign(deltaAngle)>0)
                    {
                        this.angle += Math.sign(deltaAngle) *this.maxspeed *dt;
                        //this.sprite = player_sprites[1];
                    }
                    else
                    {
                        this.angle = this.targetangle;
                        this.state = "done";
                        gamemanager.checksuccess();
                        //this.sprite = player_sprites[0];
                    }
                    break;
                case "done":
                    break;
                default:
                    break;
            }
        

            this.size.x = this.currentlength;
            

            if(this.pos.x < mainviewport.posx-this.size.x || this.opacity <= 0)
            {
                this.opacity =0;
                this.enabled=false;
            }

        }
        this.draw = (context) => {
            context.imageSmoothingEnabled = !this.sprite.ispixel;
            context.save();
            context.globalAlpha = this.opacity;
            context.translate(this.pos.x - mainviewport.posx ,this.pos.y - mainviewport.posy);
            context.rotate(this.angle);
            context.drawImage(this.sprite.image,0,0,this.size.x,this.size.y); 
            context.translate(-this.pos.x + mainviewport.posx,-this.pos.y + mainviewport.posy );
            context.restore();
        }
    }
}

class Groundmanager {
    constructor()
    {
        this.groundlist = [];
        this.maxspacing = resources.get(images.bridge).width-200;
        this.minspacing = 100;
        this.maxwidth = resources.get(images.bridge).width;
        this.minwidth = resources.get(images.bridge).width * 0.5;

        this.update = ()=> {
            if(this.groundlist.length == 0)
            {                
                let twidth = this.minwidth + Math.random()*( this.maxwidth-this.minwidth);
                let tg = new Ground(  twidth);
                tg.pos.x = cav.width*0.3;
                player_entity.pos.x = tg.pos.x + tg.size.x - player_entity.size.x;
                player_entity.targetposx = tg.pos.x + tg.size.x - player_entity.size.x;
                mainviewport.set_target(player_entity);
                this.groundlist.push(tg);
                entitylist.push(tg);
                gamemanager.init();
            }

            while(true)
            {                
                let lastgroundposx = this.groundlist[this.groundlist.length-1].pos.x + this.groundlist[this.groundlist.length-1].size.x;
                if( lastgroundposx < mainviewport.posx+mainviewport.width)
                {
                    let twidth = this.minwidth + Math.random()*( this.maxwidth-this.minwidth);
                    let tspacing = this.minspacing + Math.random()*this.maxspacing;
                    this.groundlist[this.groundlist.length-1].nextspacing = tspacing;
                    let tg = new Ground(twidth);
                    tg.pos.x = lastgroundposx + tspacing;
                    this.groundlist.push(tg);
                    entitylist.push(tg);
                }
                else
                {
                    break;
                }
            }

            this.groundlist = this.groundlist.filter(e=>{
                if(e.enabled)
                {
                    return e;
                }
            })
        }

    }
}

class Gamemanager {
    constructor()
    {
        this.currentground = null;
        this.currentbridge =null;
        this.init = ()=>{
            this.currentground = groundmanager.groundlist[0];  
            player_entity.targetposx = player_entity.pos.x;     
            this.readyclick();                          
        }

        this.dropbridge =()=>{
            if(this.currentbridge.state == "waitingclick")
            {
            resources.get(images.tap_1).currentTime =0;
            resources.get(images.tap_1).play();
            this.currentbridge.targetangle = 0;
            this.currentbridge.state = "rotating";
            }
        }
        this.checksuccess = ()=>{
            
            if(this.currentbridge.currentlength >= this.currentground.nextspacing)
            {
                this.currentbridge.currentlength =this.currentground.nextspacing;
                this.currentground = groundmanager.groundlist[ groundmanager.groundlist.indexOf(this.currentground)+1];
                
                player_entity.settargetlocation(this.currentground);
                game_properties.bridgespeed += game_properties.bridgespeed>1000?0:10;
            }
            else
            {
                this.currentbridge.state = "dying";
                this.readyclick();
            }
        }
        this.makenewbridge = ()=>{
            this.currentbridge = new Bridge();
            this.currentbridge.pos.x = this.currentground.pos.x + this.currentground.size.x;
            this.currentbridge.pos.y = this.currentground.pos.y;
            this.currentbridge.maxlength = this.currentground.nextspacing>0?this.currentground.nextspacing * 1.2 : this.currentbridge.maxlength;
            game_properties.bridgespeed = this.currentbridge.maxlength * 3;
            entitylist.push(this.currentbridge);
        }
        this.readyclick = ()=>{ 
            this.makenewbridge();           
            this.currentbridge.state = "waitingclick";
        }
    }
}

class Clouds extends Entity{
    constructor()
    {
        super(images.clouds);
        this.basespeed = 10;
        this.speedx = 20; 
        this.order = -1.5;
        this.update = () => {
            this.pos.x += this.speedx * dt;
            if(this.pos.x < mainviewport.posx - this.size.x)
            {
                this.reset();
            }
        }
        this.reset = () =>
        {
            this.speedx = this.basespeed * (0.5 + (Math.random()*0.8))
            this.speedx *= Math.random()>0.5? -1:1;
            this.pos.x = mainviewport.posx + mainviewport.width;
            this.pos.y = Math.random()* this.size.y;
        }
    }
}

function checkOrientation() {
    
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