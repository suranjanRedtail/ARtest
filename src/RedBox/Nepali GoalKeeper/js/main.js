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

const colors = [
    "#296A7A",
    "#649933",
    "#417A29",
    "#2CB57A",
    "#2D69B2",
    "#AF622E",
    "#AA2FAD",
    "#6D2F8E",
    "#3091CE",
    "#6227D6",
    "#C6A105",
    "#DB7F23",
    "#C43535",
    "#DD1F83",
    "#798A2E"];

    var text_color = "#098d89";
    var pause_text_color = "#098d89";

//game state initilization
var currentGameState;

//Object containing names of resources
var images = {    
    P_L : "./assets/sprites/P_L.png",
    Background : "./assets/sprites/BG.png",
    Background2 : "./assets/sprites/BG2.png",
    Logo : "./assets/sprites/Logo.png",
    Playbutton : "./assets/sprites/playbutton.png",
    Pause : "./assets/sprites/pausebutton.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    Help_animation : "./assets/sprites/animations/512_512.png",
    post : "./assets/sprites/post.png",
    gloves : "./assets/sprites/g.png",
    ball : "./assets/sprites/ball.png",
    lines : "./assets/sprites/lines.png", 
    BG : "./assets/sound/bg.mp3",
    GO : "./assets/sound/gameover.mp3",
    t1 : "./assets/sound/T1.wav",
    t2 : "./assets/sound/T2.wav",
};

var sounds = [images.t1,images.t2];

let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";

var delay_interval;

y.onload = () => {   
    let ratio = y.width/y.height;
    let nwidth = ratio * cavMain.height;

    window.resources.load(resources_paths);

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
    lives: 3,
}

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;
var post;
var lines;
var gamescreen;

//player 
var player_entity;
var previoustate;
var ballsprite;
var timer=0;
var nexttimer=0;

//mainmenu
function loadmainmenu(){
    let y = new Entity(images.Logo,0,0);
    let y2 = new Button(images.Playbutton,405,159);

    y.ratio = y.size.x / y.size.y;
    y.size.y = 300;
    y.size.x = y.ratio * 300;
    y.pos.x= cav.width/2 - y.size.x/2;
    y.pos.y=75;    

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.9 - y2.size.y;

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

    let y = new Button(images.resume,405,159);    
    y.order = 2;
    let y2 = new Entity(images.blackdrop,cav.width,cav.height);
    y2.order = 1;

    y.pos.x=cav.width/2 - y.size.x/2;
    y.pos.y=cav.height * 0.9 - y.size.y;

    y.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
}

function gameOver() {    
    clearUI();
    currentGameState = gameStates.gameover;
    let y = new Button(images.Playagain,405,159);
    y.pos.x=cav.width/2 - y.size.x/2;
    y.pos.y=cav.height * 0.9 - y.size.y;

    let y2 = new Entity(images.blackdrop,cav.width,cav.height);
    y2.order = 1;

    

    y.onclick = () => {
        clearUI();
        loadgameUI();
        resetgame();   
        help.timer = 0;  
        help.enabled = true;  

    }    
    uiEntityList.push(y);  
    uiEntityList.push(y2);     
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
    }     
    entitylist = [];  
    entitylist.push(post);
    entitylist.push(lines);
    entitylist.push(player_entity);
    resources.get(images.BG).play();   
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    ballsprite = document.createElement('canvas');
    ballsprite.width = resources.get(images.ball).width;
    ballsprite.height = resources.get(images.ball).height;

    post = new Entity(images.post,0,0);
    post.ratio = post.sprite.height/post.sprite.width;
    post.size.x = 1000;
    post.order = 2;
    post.size.y = post.ratio * post.size.x;
    post.pos.x = cav.width/2 - post.size.x/2;
    post.pos.y = 590;
    gamescreen = new Entity(null,cav.width,cav.height);
    lines = new Entity(images.lines,0,0);
    lines.ratio = lines.sprite.height/lines.sprite.width;
    lines.size.x = 2800;
    lines.size.y = lines.ratio * lines.size.x;
    lines.pos.x = cav.width/2 - lines.size.x/2;
    lines.pos.y = post.pos.y - lines.size.y + 20;
    
    

    player_entity = new Player(images.gloves);
    player_entity.pos.y = 450;
    player_entity.size = {x:125,y:125};
    entitylist.push(lines);
    entitylist.push(post);
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
    
    var helpAnimation = new SpriteAnimation(images.Help_animation,0,0,[0,1,2,1,5,0,0,0],500,500,2,1.2); 
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
   
    if(window.innerWidth < window.innerHeight && currentGameState != gameStates.orientation){
        previoustate = currentGameState;
        currentGameState = gameStates.orientation;        
    }
    else if(currentGameState == gameStates.orientation && window.innerWidth > window.innerHeight)
    {
        currentGameState = previoustate;
        loadgameUI();        
    }

    switch(currentGameState)
    {        
        case gameStates.menu:
            drawCall(()=>{
                cxt.drawImage(resources.get(images.Background2),0,0,cav.width,cav.height);
            },-0.5);        
        break;
        case gameStates.game:
            timer +=dt;
            if(timer > nexttimer)
            {
               spawnball();
               nexttimer = 0.5 + Math.random()*1; 
               timer = 0;
            }

            entitylist.forEach(e=>{
                e.updateMain(); 
                draw(e);              
            });
            
            
            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = "#ffffff";             
                cxt.font = "bold 80px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-35-100,95);
                cxt.fillStyle = text_color;
                cxt.font = "bold 80px GameFont";
                cxt.fillText(game_properties.Score,cav.width-35-100,95);  
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
            cxt.font = "bold 70px GameFont";            
            cxt.fillStyle = pause_text_color; 
            cxt.strokeStyle = "#ffffff";
            cxt.textAlign = "center"; 
            cxt.lineWidth = 8;
            cxt.strokeText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.fillText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px GameFont";
            cxt.strokeText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.textAlign = "start"; 
            },2);
            
            
            draw(help);

            break;
        case gameStates.gameover: 

        entitylist.forEach(e=>{
            e.updateMain();
            draw(e);
        });

        drawCall(()=>
            {
            cxt.font = "bold 70px GameFont";            
            cxt.fillStyle = pause_text_color; 
            cxt.strokeStyle = "#ffffff";
            cxt.textAlign = "center"; 
            cxt.lineWidth = 8;
            cxt.strokeText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.fillText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px GameFont";
            cxt.strokeText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2);
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
    
    entitylist = entitylist.filter(e=>{
        if(e.enabled)
        {
            return e;
        }
    })

    uiEntityList.forEach(e=>{
        draw(e);
    });

    oldmousestate = keyState["mouse"];
        
    drawCall(DrawBackground,-1);
    Rendering.renderDrawCalls();    
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);

    keyStateOld = JSON.parse(JSON.stringify(keyState));
    
    requestAnimationFrame(main);  
};

function DrawBackground()
{
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
}




class Player extends Entity{
    constructor (sprite){               
        super(sprite,0,0);
        this.targetposx = cav.width/2 - this.size.x/2;
        this.prevposx = this.pos.x;
        this.update = () => {
            this.prevposx = this.pos.x;
            let d = -this.pos.x + this.targetposx;  
            if( Math.abs(d)>1)
            {
                this.pos.x += d * 0.3;
            }   
            else
            {
                this.pos.x = this.targetposx;
            } 

        };
    }
}

class Ball extends Entity {
    constructor(sx,sy)
    {              
        super(null,1,1);
        this.size = {x:100,y:100};
        this.rotation = 0;
        this.rotationspeed = Math.PI*2;
        this.pos.x = cav.width/2;
        this.speed = [sx,sy];
        this.bounched = false; 
        this.sp = [0,0];  
        this.ep = [0,0];  
        this.update = () => {
            this.rotation += this.rotationspeed * dt;
            this.pos.x += this.speed[0] * dt;
            this.pos.y += this.speed[1] * dt;  
            let dist = Math.sqrt(Math.pow((this.pos.x - player_entity.pos.x+ this.size.x/2 -player_entity.size.x/2),2)+Math.pow((this.pos.y - player_entity.pos.y+ this.size.y/2 -player_entity.size.y/2),2));
            
            if( !this.bounched && dist <= this.size.x && currentGameState == gameStates.game){
                let dir = this.pos.x - player_entity.pos.x + this.size.x/2 -player_entity.size.x/2;
                if(Math.abs(dir) > 40){
                dir = Math.sign(dir);
                this.speed[0] = Math.abs(this.speed[0])*dir + (Math.abs(player_entity.prevposx - player_entity.pos.x)*5*dir);
                this.rotationspeed *= dir;
                this.rotationspeed += dir*10*(Math.abs(player_entity.prevposx - player_entity.pos.x))*Math.PI/180;
                }
                else
                {
                    this.rotationspeed *= 1.2; 
                }
                this.speed[1] *= -1.2;
                this.bounched = true;
                game_properties.Score++;
                resources.get(sounds[ Math.floor(Math.random()*1.99)]).currentTime =0;
                resources.get(sounds[ Math.floor(Math.random()*1.99)]).play();
            }
            if(physics.checkCollision(this,post) && !this.bounched && currentGameState == gameStates.game)
            {
                gameOver();
                resources.get(images.GO).currentTime = 0;
                resources.get(images.GO).play(); 
                resources.get(images.BG).pause();
            }
            if(!physics.checkCollision(this,gamescreen) && this.bounched)
            {
                this.enabled = false;
            }
        };

        this.draw = (context) => {
            if(this.enabled && !this.done){                
                    let tc = ballsprite.getContext('2d');;
                    let ti = resources.get(images.ball);
                    tc.clearRect(0,0,ballsprite.width,ballsprite.height);
                    tc.save();
                    tc.translate(ballsprite.width/2,ballsprite.height/2);
                    tc.rotate(this.rotation);
                    tc.drawImage(ti,-ti.width/2,-ti.width/2);
                    tc.restore();
                    context.drawImage(ballsprite,this.pos.x,this.pos.y,this.size.x,this.size.y);                                   
            }
        }
        
    }
}

var spawnball = () => {
    let sx = (post.pos.x+50) + (Math.random()*post.size.x-50);
    let sy = -300;

    let gx = (post.pos.x+200) + (Math.random()*(post.size.x-400));
    let gy = post.pos.y;

    let vx = gx-sx;
    let vy = gy-sy;

    let vm = Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2));
    vx/=vm;
    vy/=vm;
    
    let randroll = 500 + Math.random() * 800;
    let tb = new Ball( vx * randroll,vy*randroll);
    tb.pos.x = sx;
    tb.pos.y = sy;
    tb.sp = [sx,sy];
    tb.ep = [gx,gy];
    ;
    entitylist.push(tb);
}

document.addEventListener("visibilitychange", function() {
    if(document.hidden && currentGameState== gameStates.game)
    {
        currentGameState = gameStates.pause;
        loadpauseUI()
    } 
});

