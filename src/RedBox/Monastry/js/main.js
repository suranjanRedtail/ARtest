var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");

var game_orientation = 0;

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

    circle : "./assets/sprites/circle.png",
    monastry : "./assets/sprites/monastry.png",
    obstacles : "./assets/sprites/obstacles.png",
    shield : "./assets/sprites/shield.png",

    coin : "./assets/sound/coin.wav",      
    BG : "./assets/sound/BG.mp3", 
    tap_1 : "./assets/sound/bounce.wav", 
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
var lasthill = null;

//player 
var player_entity;
var mainviewport;


var fishsprites;
var enemy_sprites =[];

var timer = 0;
var nexttimer =2;

var text_color = "#cde6d1";
var outline_color = "#254c5b";
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
            game_properties.enemy_speed += dt * 1;

            if(timer>nexttimer)
            {
                entitylist.push(new Balls());
                nexttimer = 1 + Math.random()* 2;
                timer = 0;
            }


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            drawCall(()=>{
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
        super(images.circle);
        this.shield = new Sprite(images.shield);
        this.monastry = new Sprite(images.monastry);
        this.pos.x = cav.width/2 - this.size.x/2;
        this.pos.y = cav.height/2 - this.size.y/2;

        this.shield_radius = this.size.x * 0.45;
        this.shield_angle = 1;
        
        this.angle = -Math.PI/2;
        this.targetangle =-Math.PI/2;
        
        this.maxspeed = Math.PI*3;
        this.opacity = 1;
        this.target_point = {x: cav.width/2 , y : 0};
        this.shield_pos = this.pos;

        this.update = () => {

            if(keyState["mouse"])
            {
                this.loadtarget_point = {
                    x: mousePos[0],
                    y : mousePos[1]
                } 
            }

            this.targetangle = this.getanglefrompos(this.target_point);

            let temptargetangle = this.angle < Math.PI?this.targetangle - Math.PI*2:this.targetangle + Math.PI*2;
            let deltaAngle = this.targetangle - this.angle;
            let deltaAngle2 = temptargetangle - this.angle;

            deltaAngle = Math.abs( deltaAngle) <= Math.abs(deltaAngle2) ? deltaAngle :deltaAngle2;

            if(Math.abs(deltaAngle)>=0 && this.angle != this.targetangle)
            {
                this.angle += Math.sign(deltaAngle) * this.maxspeed *dt;
            }
            if( this.maxspeed * dt >  Math.abs(deltaAngle) )
            {
                this.angle = this.targetangle;        
            }

            this.shield_pos = this.getposfromangle(this.angle);

        }

        this.draw = (context) => {
            context.imageSmoothingEnabled = !this.sprite.ispixel;
            if(this.enabled && !this.done){
                if(this.ui)
                {
                this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);       
                }
                else{            
                    this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                }      
            }
            
            this.monastry.draw(context, this.center.x - this.monastry.width/2 , this.center.y - this.monastry.height/2 , this.monastry.width, this.monastry.height);

            context.save();
            context.globalAlpha = this.opacity;
            context.translate(this.shield_pos.x ,this.shield_pos.y);
            context.rotate(this.angle + Math.PI/2);
            if(currentGameState != gameStates.menu)
            {
            context.drawImage(this.shield.image,-this.shield.width/2,-this.shield.height/2,this.shield.width,this.shield.height); 
            }
            context.restore();

            if(game_properties.debug_mode)
            {
            drawcircle(this.radius,this.center);
            drawcircle(3,this.shield_pos);
            drawcircle(5,this.getposfromangle((this.angle - this.shield_angle) ,false));
            drawcircle(5,this.getposfromangle((this.angle + this.shield_angle) ,false));
            }
        }
        

        this.getanglefrompos= (pos)=>
        {
            let temp = {x:0,y:0};
            temp.x = pos.x - this.center.x;
            temp.y = pos.y - this.center.y;

            let angle = Math.atan(temp.y/temp.x);
            if(temp.x < 0)
            {
                angle += Math.PI;
            }
            if(angle < 0)
            {
                angle += Math.PI * 2;
            }
            
            return angle;
        }

        this.getposfromangle= (angle,mode = true,radius = this.radius) =>
        {
            let temp = {x:0,y:0};

            temp.x = this.center.x + (this.shield_radius * Math.cos(angle));
            temp.y = this.center.y + (this.shield_radius * Math.sin(angle));
            if(!mode)
            {
                temp.x = this.center.x + (radius * Math.cos(angle));
                temp.y = this.center.y + (radius * Math.sin(angle));
            }
            return temp;
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
        return this.size.x/2;
    }

}

class Balls extends Entity{
    constructor()
    {
        super( enemy_sprites[Math.floor( Math.random()*4)])
        this.size.x /= 2;
        this.size.y /= 2;
        let random_angle_roll = Math.random() * Math.PI * 2;
       
        this.pos = player_entity.getposfromangle(random_angle_roll,false, cav.height/2);
        

        this.dx = cav.width/2 - this.pos.x;
        this.dy = cav.height/2 - this.pos.y;
        this.random_roll = (0.5 * (1 + Math.random()));
        let dmag = Math.sqrt( Math.pow(this.dx,2) + Math.pow(this.dy,2) );
        this.dx /= dmag;
        this.dy /= dmag;

        this.update = ()=> {
            this.pos.x += this.dx * game_properties.enemy_speed * this.random_roll * dt;
            this.pos.y += this.dy * game_properties.enemy_speed * this.random_roll * dt;

            let dist = Math.sqrt(  Math.pow (player_entity.center.x - this.center.x,2) + Math.pow (player_entity.center.y -  this.center.y,2));
            
            let distmax = this.radius + player_entity.radius;

            if(dist < distmax)
            {
                this.enabled = false;
                let a1 = this.angle;
                let a2 = player_entity.angle;
                let dt1 = a1>a2?a1-a2:a2-a1;
                dt1 = Math.min(dt1, (Math.PI*2) - dt1);                

                if( dt1 <= player_entity.shield_angle  && currentGameState == gameStates.game)
                {
                    resources.get(images.coin).currentTime =0;
                    resources.get(images.coin).play();
                    game_properties.Score += 10;
                }
                else
                {
                    resources.get(images.GameOver).currentTime =0;
                    resources.get(images.GameOver).play();
                    gameOver();
                }
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
    get center()
    {
        return {x:this.pos.x + this.size.x/2 ,y:this.pos.y + this.size.y/2};
    } 
    get radius()
    {
        return this.size.y/2;
    }
    get angle()
    {
        let angle = Math.atan(-this.dy/-this.dx);
        if(-this.dx < 0)
            {
                angle += Math.PI;
            }
            if(angle < 0)
            {
                angle += Math.PI * 2;
            }
        return angle;
    }
}


function DrawBackground()
{   
    
    drawCall(
        ()=>{
        cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);           
    },-2);
    
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