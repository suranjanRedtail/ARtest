var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");


//resizing canvas
cav.width = 720;
cav.height = 1280;

cavMain.width = 720;
cavMain.height = 1280;



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,  
}

var text_color = "#ffffff";
var pause_text_color = "#275d6d";

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
    Background : "./assets/sprites/BG.png", 

    temple : "./assets/sprites/temple.png",
    c1 :"./assets/sprites/taxi-1.png",
    c2 :"./assets/sprites/taxi-2.png",
    tree : "./assets/sprites/tree.png",
    player :"./assets/sprites/animations/84_123.png",
    tap_1 : "./assets/sound/bounce.wav",   
    h1 : "./assets/sound/horn_1.mp3"  ,
    h2 : "./assets/sound/horn_2.mp3",
    t1 : "./assets/sound/T1.mp3",  
    lines :"./assets/sprites/lines.png",    
    BG : "./assets/sound/BG.mp3", 
};


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


y.onload = () => {    
    cavMain.getContext('2d').drawImage(y,0,0,cavMain.width,cavMain.height);

    //window.resources.addcallback(init);
    window.resources.load(resources_paths,false);

    let counter =0;
    let tempcxt = cavMain.getContext('2d');
    delay_interval = setInterval(() => {
        if(counter>=2000 && resources.resourcesloadedcount == resources.resourcescount)
        {
            clearInterval(delay_interval);
            init();
        }   
        else
        {     
        tempcxt.drawImage(y,0,0,cavMain.width,cavMain.height);
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
    background_speed :300,
    car_speed :2000,
    tscore :0,
}

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;

//player 
var player_entity;
var planes = [20,625];
var carlanes = [187,437];
var obstaclesColliderDimention= [135,86];
var obstaclesSprites;
var carSprites;

var timer = 0;
var nexttimer =2;

var lastobs;
var nextobs; 

var bgpos = 0;


//mainmenu
function loadmainmenu(){

      
        let y = new Entity(images.Logo,0,0);
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
    let y = new Entity(images.blackdrop,cav.width,cav.height);
    let y3 = new Entity(images.board,0,0);
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
    let y = new Entity(images.blackdrop,cav.width,cav.height);
    let y3 = new Entity(images.board,0,0);
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
        background_speed :300,
        car_speed :2000,
        tscore :0,
    }
    entitylist = [];
    lastobs =null;
    player_entity.pos.x = planes[0];
    player_entity.targetlane = 0;
    entitylist.push(player_entity);
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;

    obstaclesSprites = [
        new Sprite(resources.get(images.tree),0,0,0,0),
        new Sprite(resources.get(images.temple),0,0,0,0)
    ]

    carSprites = [
        new Sprite(resources.get(images.c1),0,0,0,0),
        new Sprite(resources.get(images.c2),0,0,0,0),
    ]

    player_entity = new Player();
    
    entitylist.push(player_entity);

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
    help = new Entity(helpAnimation,0,0);
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

    
    drawCall(DrawBackground,-2);

    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:
            timer += dt;
            game_properties.game_time +=dt;
            game_properties.background_speed += 5 * dt;
            game_properties.tscore += dt;
            game_properties.Score = Math.floor(game_properties.tscore);
            if(timer > nexttimer)
            {
                timer =0;
                tcar = new Cars(Math.floor(Math.random()*1.9999), Math.floor(Math.random()*1.9999));
                entitylist.push(tcar);
                nexttimer = 1 + Math.random()* 3;
            }

            spawnobs();

            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = text_color;             
                cxt.font = "bold 80px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,95);
                cxt.fillStyle = pause_text_color;
                cxt.font = "bold 80px GameFont";
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
            cxt.font = "90px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 );
            cxt.font = "90px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 100);
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
            cxt.font = "90px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 - 100);
            cxt.font = "80px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 50 );
            cxt.font = "80px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 150);
            cxt.textAlign = "start"; 
            },2);

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
    let lines = resources.get(images.lines);
    let  b1posy = bgpos;
    if(currentGameState == gameStates.game)
    {
    bgpos += game_properties.background_speed * dt;
    }
    if(bgpos > cav.height)
    {
        bgpos=0;
    }
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
    cxt.drawImage(lines,cav.width/2 - lines.width/2,bgpos,lines.width,cav.height);
    cxt.drawImage(lines,cav.width/2 - lines.width/2,bgpos - cav.height ,lines.width,cav.height);
}

class Player extends Entity{
    constructor()
    {
        let player_anim = new SpriteAnimation(images.player,0,0,[0,1],84,123,2,1);
        super(player_anim,0,0);
        this.pos.x = planes[0];
        this.pos.y = cav.height * 0.8;
        this.collider = new Entity(null,84,49);
        this.collider.pos = this.pos;
        this.currentlane = 0;
        this.targetlane = 0;
        this.playerAnimationSpeed = 1;
        this.update = () => {
            this.playerAnimationSpeed = game_properties.background_speed/100;
            this.sprite.speed = this.playerAnimationSpeed;
            if( this.currentlane != this.targetlane)
            {
                
                let delta = planes[this.targetlane] - this.pos.x;
                if(Math.abs(delta)>1)
                {
                    delta =  Math.min( Math.abs(delta* 0.2), dt * 720) * Math.sign(delta);
                    this.pos.x +=delta;
                    this.sprite.speed = this.playerAnimationSpeed * (2 + ( Math.abs(delta)/ (dt * 720)));
                } 
                else
                {
                    this.pos.x += delta;
                    this.currentlane = this.targetlane;
                }
            }
        }
        this.switchlanes = () => {
            resources.get(images.tap_1).currentTime =0;
            resources.get(images.tap_1).play();
            this.currentlane = 3;
            this.targetlane++;
            this.targetlane %= 2;
        }
    }
}

class Obstacles extends Entity{
    constructor(type)
    {
        super( obstaclesSprites[type],0,0);
        this.collider = new Entity( null,this.size.x, obstaclesColliderDimention[type]);
        this.collider.pos = this.pos;
        this.pos.y = -this.size.y;
        this.update = () => {

            this.pos.y += game_properties.background_speed * dt;

            if(this.pos.y > cav.height)
            {
                this.enabled = false;
            }
            if(physics.checkCollision(this.collider,player_entity.collider) && currentGameState == gameStates.game)
            {
                gameOver();
            }
        }
    }
}

class Cars extends Entity{
    constructor(type,lane,dir=0)
    {           
        super( carSprites[type],0,0);
        this.pos.x = carlanes[lane];
        this.pos.y = lane==1? -this.size.y - 1000 :cav.height + 1000;
        dir = lane==1?1:-1;
        this.collider = new Entity( null,this.size.x,162);
        this.collider.pos = this.pos;
        this.speed = (game_properties.car_speed)*( 0.5 + Math.random()*0.5) * dir;

        if(Math.random() > 0)
        {
         honkhonk(type);
        }

        this.update = () => {

            this.pos.y += this.speed * dt;

            if((this.pos.y > cav.height && dir >0) || (this.pos.y < -this.size.y && dir < 0))
            {
                this.enabled = false;
            }
            if(physics.checkCollision(this.collider,player_entity.collider) && currentGameState == gameStates.game)
            {
                gameOver();
            }
        }
    }
}

function spawnobs()
{
    if( lastobs == null)
    {
        tobs = new Obstacles( Math.floor(Math.random()*1.9999));
        tobs.pos.x = Math.random()>0.5? 602:0;
        entitylist.push(tobs);
        nextobs = 100 +  Math.random()*300;
        lastobs = tobs;
    }else if( nextobs - lastobs.pos.y <0 )
    {
        tobs = new Obstacles( Math.floor(Math.random()*1.9999));
        tobs.pos.x = Math.random()>0.5? 602:0;
        entitylist.push(tobs);
        nextobs = 100 +  Math.random()*300;
        lastobs = tobs;
    }
}

function honkhonk(type) {
    let TA = [resources.get(images.h1).cloneNode(false),resources.get(images.h2).cloneNode(false)];
    let randroll = type;
    TA[randroll].currentTime = 0;
    TA[randroll].play();
}




