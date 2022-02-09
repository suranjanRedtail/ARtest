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

text_color = "#ffebc0";

const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,    
}

const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFD300"];
//game state initilization
var currentGameState;

//Object containing names of resources
var images = {    
    Background : "./assets/sprites/BG.png",
    Logo : "./assets/sprites/Logo.png",
    Playbutton : "./assets/sprites/playbutton.png",
    Pause : "./assets/sprites/pausebutton.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    woosh_1 : "./assets/sound/W1.mp3",
    woosh_2 : "./assets/sound/W2.mp3",
    Bounce : "./assets/sound/Bounce.wav",
    GameOver : "./assets/sound/game_over.wav",
    BG : "./assets/sound/BG.mp3",
    Help_animation : "./assets/sprites/animations/512_512.png",    
};


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


var delay_interval;

y.onload = () => {
    
    cavMain.getContext('2d').drawImage(y,0,0,cavMain.width,cavMain.height);

    //window.resources.addcallback(init);
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
}

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
//Player Entity
var Player_Block; 
var BL;
var help;

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    Player_Block = new Player(100,100); 

    Player_Block.pos.y = 250;
    Player_Block.pos.x = cav.width/2 - Player_Block.size.x/2;

    BL = new BoundryLines();
    BL.init();

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;

    loadmainmenu();

    resources.get(images.BG).loop = true;
    resources.get(images.BG).oncanplay = resources.get(images.BG).play();

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

//mainmenu
function loadmainmenu(){

    let y = new Entity(images.Logo,640,210);
    let y2 = new Button(images.Playbutton,300,96);

    y.pos.x=40;
    y.pos.y=277;    

    y2.pos.x=231;
    y2.pos.y=950;

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

    let y = new Button(images.resume,300,96);
    let y2 = new Entity(images.blackdrop,cav.width,cav.height);
    y.order = 2;
    y2.order = 1;

    y.pos.x=210;
    y.pos.y=950;

    y.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
}

function gameOver() {    
    resources.get(images.GameOver).play();
    clearUI();
    currentGameState = gameStates.gameover;
    let y2 = new Button(images.Playagain,300,96);

    y2.pos.x=231;
    y2.pos.y=950;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        resetgame();  
        resources.get(images.BG).play();    
        help.timer = 0;  
        help.enabled = true;   
    }
    
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
    Player_Block.pos.x = cav.width/2 - Player_Block.size.x/2;
    Player_Block.velocity = 500;
    Player_Block.pos.y = 200;
    game_properties.Score = 0;
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;

    DrawBackground();

    uiEntityList.forEach(e=>{
        draw(e);
    });

    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:
            drawCall(()=>{
            cxt.font = "bold 70px GameFont";
            cxt.fillStyle = text_color; 
            cxt.textAlign = "center"; 
            cxt.fillText(game_properties.Score,cav.width-35-70,80);  
            },2);
            cxt.textAlign = "start"; 

            Player_Block.update();
            BL.draw(cxt);
            draw(Player_Block);

            help.updateMain();
            draw(help);

            break;
        case gameStates.pause:

            drawCall(()=>
            {
            cxt.font = "bold 50px GameFont";            
            cxt.fillStyle = text_color; 
            cxt.textAlign = "center"; 
            cxt.fillText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 70px GameFont";
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2); 
            },2);
            cxt.textAlign = "start"; 
            
            draw(help);
            BL.draw(cxt);
            draw(Player_Block);
            break;
        case gameStates.gameover: 
        drawCall(()=>
            {
            cxt.font = "bold 50px GameFont";            
            cxt.fillStyle = text_color; 
            cxt.textAlign = "center"; 
            cxt.fillText("YOUR SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 70px GameFont";
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2); 
            },2); 
            cxt.textAlign = "start";          
            break;
        default:         
        break;       
    }
    
    Rendering.renderDrawCalls();
    
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);

    requestAnimationFrame(main);  
};

class Player extends Entity{
    constructor(sizeX,sizeY)
    {
        super(null,sizeX,sizeY);
        this.degrees = 0;
        this.velocity = 500;
        this.isrotating = false;
        this.rotationSpeed = 9; 
        this.RotationState = 0;
        this.targetDegree = 0;
        this.P0 ={x:0,y:0};
        this.P1={x:0,y:0};
        this.P2={x:0,y:0};
        this.P3={x:0,y:0};
        
        this.update = () => {
            this.velocity += Math.sign(this.velocity) * 5 * dt;
            this.updatevertices();
            if( Math.floor(this.degrees) != this.targetDegree)
            {
                this.degrees += this.rotationSpeed;
                this.degrees %= 360;
                this.isrotating = true;
            }
            else
            {
                this.isrotating = false;
            }

            this.pos.y += dt * this.velocity;

            let RS2C = this.RotationState%4;
            RS2C = RS2C ==0?0:(4-RS2C);

           
            if(Math.floor(this.P0.y) <BL.width/2 || Math.floor(this.P1.y) <BL.width/2 || Math.floor(this.P2.y) <BL.width/2 || Math.floor(this.P3.y) <BL.width/2)
            { 
                if(!this.isrotating && RS2C == BL.topcode){
                    this.velocity *= -1;
                    BL.changeTop();
                    game_properties.Score++;
                    resources.get(images.Bounce).play();
                }
                else if(this.velocity <0)
                {
                    gameOver();
                }
            } 
            if(Math.floor(this.P0.y)>cav.height - (BL.width/2)|| Math.floor(this.P1.y) >cav.height - (BL.width/2)|| Math.floor(this.P2.y)>cav.height - (BL.width/2)|| Math.floor(this.P3.y) >cav.height - (BL.width/2))
            {                                
                RS2C +=2;
                RS2C %=4;                
                if(!this.isrotating && RS2C == BL.bottomcode){
                    this.velocity *= -1;
                    BL.changeBottom();
                    game_properties.Score++;
                    resources.get(images.Bounce).play();
                }
                else if(this.velocity >0)
                {                    
                    gameOver();
                }
            }
        }
        this.rotate = () => {
            if(!this.isrotating)
            {
            this.targetDegree =  Math.floor(this.degrees) + 90;
            this.targetDegree %= 360;
            this.RotationState += 1;
            this.RotationState = this.RotationState % 4;
            this.isrotating = true;
            let TA = [resources.get(images.woosh_1),resources.get(images.woosh_2)];
            let randroll = Math.floor(Math.random() * 2);
            TA[randroll].pause();
            TA[randroll].currentTime = 0;
            TA[randroll].play();
            }
        }
        this.updatevertices = () => {
            this.P0 = rotatePoint(this.pos,{x:this.pos.x+this.size.x/2,y:this.pos.y+this.size.y/2},this.degrees);
            this.P1 = rotatePoint({x:this.pos.x+this.size.x,y:this.pos.y},{x:this.pos.x+this.size.x/2,y:this.pos.y+this.size.y/2},this.degrees);
            this.P2 = rotatePoint({x:this.pos.x+this.size.x,y:this.pos.y+this.size.y},{x:this.pos.x+this.size.x/2,y:this.pos.y+this.size.y/2},this.degrees);
            this.P3 = rotatePoint({x:this.pos.x,y:this.pos.y+this.size.y},{x:this.pos.x+this.size.x/2,y:this.pos.y+this.size.y/2},this.degrees);
        }
        this.draw = (context)=> {                  
            
            context.beginPath();
            context.lineWidth = 7;
            context.lineCap = "round";
            context.strokeStyle = colors[0];
            context.moveTo(this.P0.x,this.P0.y);
            context.lineTo(this.P1.x,this.P1.y);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.strokeStyle = colors[1];
            context.moveTo(this.P1.x,this.P1.y);
            context.lineTo(this.P2.x,this.P2.y);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.strokeStyle = colors[2];
            context.moveTo(this.P2.x,this.P2.y);
            context.lineTo(this.P3.x,this.P3.y);
            context.stroke();
            context.closePath();

            context.beginPath();
            context.strokeStyle = colors[3];
            context.moveTo(this.P3.x,this.P3.y);
            context.lineTo(this.P0.x,this.P0.y);
            context.stroke();
            context.closePath();
        };            
    }
}

function rotatePoint(point, center, angle){

    angle = (angle ) * (Math.PI/180);

    var rotatedX = Math.cos(angle) * (point.x - center.x) - Math.sin(angle) * (point.y-center.y) + center.x;

    var rotatedY = Math.sin(angle) * (point.x - center.x) + Math.cos(angle) * (point.y - center.y) + center.y;

    return {x:rotatedX,y:rotatedY};
    
}

function DrawBackground()
{
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
}


function BoundryLines()
{    
    this.topcode=0;
    this.bottomcode=0;
    this.width = 20;

    this.changeTop = () => {
        let tcolor = 0 + this.topcode;
        while(tcolor == this.topcode)
        {
        tcolor = Math.random() * 4;
        tcolor = Math.floor(tcolor-0.00001);
        }        
        this.topcode = tcolor;
    }
    this.changeBottom = () => {
        let tcolor = 0 + this.bottomcode;
        while(tcolor == this.bottomcode)
        {
        tcolor = Math.random() * 4;
        tcolor = Math.floor(tcolor-0.00001);
        }        
        this.bottomcode = tcolor;
    }
    this.draw = (context) => {
        context.beginPath();
        context.lineWidth = this.width;
        context.lineCap = "round";
        context.moveTo(0,5);
        context.lineTo(cav.width,5);
        context.strokeStyle = colors[this.topcode];
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(0,cav.height-5);
        context.lineTo(cav.width,cav.height-5);
        context.strokeStyle = colors[this.bottomcode];
        context.stroke();
        
    }
    this.init = () => {
        this.changeTop();
        this.changeBottom();
    }
}

document.addEventListener("visibilitychange", function() {
    if(document.hidden && currentGameState== gameStates.game)
    {
        currentGameState = gameStates.pause;
        loadpauseUI()
    } 
});
