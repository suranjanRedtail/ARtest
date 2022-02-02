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
    
    granny : "./assets/sprites/granny.png",
    cars : "./assets/sprites/cars.png",
    fences : "./assets/sprites/fences.png",
    fences_front : "./assets/sprites/fences_front.png",
    mountains : "./assets/sprites/mountains.png",
    hills : "./assets/sprites/hills.png",
    lake : "./assets/sprites/lake.png",
    road : "./assets/sprites/road.png",
    tree : './assets/sprites/tree.png',
    plant : "./assets/sprites/plant.png",

    BG : "./assets/sound/BG.mp3", 
    h1 : "./assets/sound/horn_1.mp3",
    h2 : "./assets/sound/horn_2.mp3",
    GameOver : "./assets/sound/game_over.wav",
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
    
    //address bar hide hack
    window.scrollTo(0,1);

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
    real_score : 0,
    player_speed : 200,
    Enemy_speed : 100,

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
var tree , plant;

var car_animations;
var granny_animation;
var props;

var timer = 0;
var nexttimer =2;

var next_obs = 0;

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
            clearUI();
            loadgameUI();
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true; 
            setTimeout( ()=>{resources.get(images.BG).currentTime=0;
                resources.get(images.BG).play();},50);
            
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
        player_entity.pause_flag=true;

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
        loadgameUI(); 
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
    player_entity.posTrue = {x:0,y:0};
    player_entity.posOffset = {x:42,y:420};    
    
    next_obs = cav.width + 500;
    
    entitylist.push(player_entity);    
}

//Initilization function
function init()
{
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    car_animations = 
    [
        new SpriteAnimation(images.cars,0,158*0,[0,1,2],350,158,6,1),
        new SpriteAnimation(images.cars,0,158*1,[0,1,2],350,158,6,1),
        new SpriteAnimation(images.cars,0,158*2,[0,1,2],350,158,6,1),
    ];

    props = [
        new Sprite(images.tree),
        new Sprite(images.plant),
    ];

    car_animations.forEach(e=>{
        e.ispixel = true;
    })

    granny_animation = new SpriteAnimation(images.granny,0,0,[0,1,2],141,104,6,1);
    granny_animation.ispixel = true;

    player_entity = new Player();
    tree = new Prop(0);
    plant = new Prop(1);
    tree.reset();
    plant.reset();

    // mainviewport.set_target(player_entity);
    // mainviewport.lock_y = true;
    mainviewport.update_fns.push( 
        ()=>
        {
            mainviewport.posx += game_properties.player_speed*dt;
        }
    )

    entitylist.push(player_entity); 
    entitylist.push(tree);
    entitylist.push(plant);

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
            game_properties.game_time += dt;        
            break;
        case gameStates.game:
           

            timer += dt;
            game_properties.game_time += dt; 
            
            game_properties.real_score += game_properties.player_speed * dt;
            game_properties.Score = Math.floor(game_properties.real_score/10);
            game_properties.player_speed += 10 * dt;
            game_properties.Enemy_speed += 10 * dt;

            if(next_obs-player_entity.pos.x < cav.width)
            {
                entitylist.push(new Enemy());
                next_obs +=  entitylist[entitylist.length-1].size.x + cav.width * 0.3 + Math.random()*cav.width*0.2;
            }

            if(timer > nexttimer)
            {}            
            


            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });            
            mainviewport.update(); 

            drawCall(()=>{
                cxt.textAlign = "end";
                cxt.strokeStyle = outline_color;             
                cxt.font = "bold 70px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-60,95);
                cxt.fillStyle = score_color;
                cxt.font = "bold 70px GameFont";
                cxt.fillText(game_properties.Score,cav.width-60,95);  
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

        mainviewport.update();  

        entitylist.forEach(e=>{
            //e.updateMain();
            draw(e);  
                        
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
        super(granny_animation);
        this.target_location_y = 0;
        this.pos.x = 0;
        this.pos.y = 0;
        this.posTrue = Object.assign({},this.pos);
        this.posOffset = {x:50,y:425};
        this.posOffset_Target = {x:42,y:425};
        this.speed = 500;
        this.y_caps = [280,565];
        this.pause_flag = false;
        this.collider = new Entity(null,1,1);
        this.collider.size.x = 89;
        this.collider.size.y = 64;

        this.update = ()=>{
            this.sprite.speed = game_properties.player_speed/200;
            this.order = 1-(this.y_caps[1] - this.pos.y)/(this.y_caps[1]-this.y_caps[0]); 
            this.order *= 0.2;
            if(!this.pause_flag)
            {
                this.posOffset_Target = {
                    x : mousePos[0]- this.size.x/2,
                    y : mousePos[1] - this.size.y/2 ,
                }
            }
            this.posTrue.x += game_properties.player_speed * dt;            
            
            // let offsetDeltaX = this.posOffset_Target.x - this.posOffset.x;
            let offsetDeltaY = this.posOffset_Target.y - this.posOffset.y;

            // if(Math.abs(offsetDeltaX)>1)
            // {
            //     this.posOffset.x +=  Math.sign(offsetDeltaX) * this.speed * dt;
            //     if(  Math.sign(this.posOffset_Target.x-this.posOffset.x) != Math.sign(offsetDeltaX))
            //     {
            //         this.posOffset.x = this.posOffset_Target.x;
            //     }
            // }
            // else
            // {
            //     this.posOffset.x = this.posOffset_Target.x;
            // }
            if(Math.abs(offsetDeltaY)>1)
            {
                this.posOffset.y +=  Math.sign(offsetDeltaY) * this.speed * dt;
                if(  Math.sign( this.posOffset_Target.y-this.posOffset.y ) != Math.sign(offsetDeltaY))
                {
                    this.posOffset.y = this.posOffset_Target.y;
                }
            }
            else
            {
                this.posOffset.y = this.posOffset_Target.y;
            }

            this.posOffset.y = clamp(this.posOffset.y,this.y_caps[0],this.y_caps[1]);

            this.pos.x = this.posTrue.x + this.posOffset.x;
            this.pos.y = this.posTrue.y + this.posOffset.y;
            this.collider.pos.x = this.pos.x + 46;
            this.collider.pos.y = this.pos.y + 64;
        }
    }

}

class Enemy extends Entity{
    constructor()
    { 
        super( car_animations[Math.floor(Math.random()*3)] );
        this.y_caps=[274,237];
        this.pos.y = this.y_caps[0] + (Math.random()*this.y_caps[1]);
        this.pos.x = next_obs;
        this.y_maxOverlap = 52;
        
        this.speed = 50;
        this.update = () =>{
            this.pos.x -= game_properties.Enemy_speed * dt;
            if( this.pos.x - mainviewport.posx < -this.size.x )
            {
                this.enabled =  false;
            }

            let offsetDeltaY = player_entity.pos.y - this.pos.y;
            if(Math.abs(offsetDeltaY)>1)
            {
                this.pos.y +=  Math.sign(offsetDeltaY) * this.speed * dt;
                if(  Math.sign( player_entity.pos.y - this.pos.y ) != Math.sign(offsetDeltaY))
                {
                    this.pos.y = player_entity.pos.y;
                }
            }
            else
            {
                this.pos.y = player_entity.pos.y;
            }

            this.pos.y = clamp(this.pos.y,this.y_caps[0],this.y_caps[0]+this.y_caps[1]);

            if( Physics.checkCollision(this,player_entity.collider) && currentGameState == gameStates.game)
            {
                let ydiff = player_entity.pos.y - this.pos.y;
                if(ydiff >= 0 && ydiff <= this.y_maxOverlap)
                {
                    gameOver();
                    resources.get(images.GameOver).currentTime = 0;
                    resources.get(images.GameOver).play();
                }
            }
            this.order = 1-(this.y_caps[0]+this.y_caps[1] - this.pos.y)/this.y_caps[1]; 
            this.order *= 0.2;
        }
    } 
}

class Prop extends Entity{
    constructor(type)
    {
        super( props[type] )
        {
            this.pos.y = type==0? 163:431;
            this.order = type==0?-0.6:0.6; 
            this.update = ()=>{
                if(this.pos.x -mainviewport.posx < -this.size.x )
                {
                    this.reset();
                }
                if(type==1)
                {
                    this.pos.x -= game_properties.Enemy_speed * 0.5 * dt;
                }
            }
            this.reset = ()=>{
                this.pos.x =  mainviewport.posx + mainviewport.width*(Math.random() + 1.5);
            }
        }
    }
}

function DrawBackground()
{     
    let p1 = resources.get(images.mountains);
    let p2 = resources.get(images.hills);
    let p3 = resources.get(images.lake);
    let p4 = resources.get(images.road);
    let p5 = resources.get(images.fences);
    let p6 = resources.get(images.fences_front);

    let p1x = - Math.floor((mainviewport.posx/2) % p1.width);
    let p2x = - Math.floor((mainviewport.posx/1.8) % p2.width);
    let p3x = - Math.floor((mainviewport.posx/1.2) % p3.width);
    let p4x = - Math.floor((mainviewport.posx/1) % p4.width);
    let p5x = - Math.floor((mainviewport.posx+200/1) % p5.width);
    let p6x = - Math.floor((mainviewport.posx/1) % p6.width);

    let b0 = resources.get(images.Background);
    let b0x = - Math.floor((mainviewport.posx/3) % cav.width);

    drawCall(
        ()=>{ 
            cxt.imageSmoothingEnabled = false;
            cxt.drawImage(b0,b0x,0,b0.width,b0.height);
            if(b0x + cav.width <= cav.width)
            {
                cxt.drawImage(b0,b0x+b0.width-1,0,b0.width ,b0.height ); 
            }      
    },-2);  

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p1,p1x,78,p1.width,p1.height);
        if(p1x + cav.width <= cav.width)
        {
            cxt.drawImage(p1,p1x+p1.width-1,78,p1.width ,p1.height ); 
        } 
    },-1.9);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p2,p2x,144,p2.width,p2.height);
        if(p2x + cav.width <= cav.width)
        {
            cxt.drawImage(p2,p2x+p2.width-1,144,p2.width,p2.height); 
        } 
    },-1.8);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p3,p3x,188,p3.width,p3.height);
        if(p3x + cav.width <= cav.width)
        {
            cxt.drawImage(p3,p3x+p3.width-1,188,p3.width,p3.height); 
        } 
    },-1.7);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p4,p4x,240,p4.width,p4.height);
        if(p4x + cav.width <= cav.width)
        {
            cxt.drawImage(p4,p4x+p4.width-1,240,p4.width,p4.height); 
        } 
    },-1);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p5,p5x,299,p5.width,p5.height);
        if(p5x + cav.width <= cav.width)
        {
            cxt.drawImage(p5,p5x+p5.width-1,299,p5.width,p5.height); 
        } 
    },-0.5);

    drawCall(
        ()=>{
        cxt.imageSmoothingEnabled = false;
        cxt.drawImage(p6,p6x,577,p6.width,p6.height);
        if(p6x + cav.width <= cav.width)
        {
            cxt.drawImage(p6,p6x+p6.width-1,577,p6.width,p6.height); 
        } 
    },0.5);   
     
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