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



    var text_color = "#efdabb";
    var pause_text_color = "#6f1924";

//game state initilization
var currentGameState;

//Object containing names of resources
var images = {    
    
    Logo : "./assets/sprites/Logo.png",
    Playbutton : "./assets/sprites/playbutton.png",
    Pause : "./assets/sprites/pausebutton.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    GameOver : "./assets/sound/game_over.wav",
    
    Help_animation : "./assets/sprites/animations/512_512.png", 
           
    w1 : "./assets/sound/W1.mp3", 
    w2 : "./assets/sound/W2.mp3",
    coin : "./assets/sound/coin.wav",
    player : "./assets/sprites/animations/500_500_archer.png",
    monsters : "./assets/sprites/animations/140_170.png",
    Boss : "./assets/sprites/animations/140_170_2.png",
    smoke : "./assets/sprites/animations/500_500.png",
    monk : "./assets/sprites/monks.png",
    arrow : "./assets/sprites/arrow_final.png",  
    t1 : "./assets/sound/T1.mp3",  
    board : "./assets/sprites/board.png",
    Background : "./assets/sprites/BG.png",
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
    monks_count : 14,
    starty : 0.1,
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
var monksmanager;
var timer =0;
var nexttimer = 0;
var arrowscale;


//mainmenu
function loadmainmenu(){

      
        let y = new Entity(images.Logo,0,0);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.75 - y2.size.y;
    
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
    y2.pos.y=cav.height * 0.75 - y2.size.y;

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
    entitylist.forEach(e=> {
        if(e instanceof Monster)
        {
            e.die();
        }
    });
    
    clearUI();
    currentGameState = gameStates.gameover;
    let y = new Entity(images.blackdrop,cav.width,cav.height);
    let y3 = new Entity(images.board,0,0);
    let y2 = new Button(images.Playagain,0,0);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.75 - y2.size.y;

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
        monks_count : 14,
        starty : 0.1,
    }
    entitylist = [];
    monksmanager.initmonks();  
    entitylist.push(player_entity);
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    PS = [  
        new SpriteAnimation(images.player,0,0,[0],500,500,1,1),
        new SpriteAnimation(images.player,0,0,[0],500,500,1,1),
        new SpriteAnimation(images.player,0,0,[0,1,1,2,3,3,4,4,0],500,500,15,1),
    ]
    PS[2].loop = false;
    
    player_entity = new Player(PS,200,200);
    arrow_scale = 500/player_entity.size.x;

    player_entity.pos = {
        x:cav.width - player_entity.size.x,
        y:cav.height/2
    }
    player_entity.targetposy = player_entity.pos.y;

    monksmanager = new MonksManager();
    monksmanager.initmonks();    
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

    
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);

    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:
            timer += dt;
            if(timer > nexttimer)
            {
                spawnmonsters();
                timer =0;
                nexttimer = 0.1 + Math.random()* 2;
            }

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
            cxt.font = "100px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 );
            cxt.font = "100px GameFont";            
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
            cxt.font = "120px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 - 100);
            cxt.font = "100px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 50 );
            cxt.font = "100px GameFont";            
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
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
}

class Player extends Entity{
    constructor(Spritearray,sizex,sizey){
        super(Spritearray[0],sizex,sizey);
        this.animations = Spritearray;
        this.speed = 1;
        this.targetposy = this.pos.y;
        this.state ="idle";
        this.canshoot = false;
        this.hasshot = false;


        this.shoot =() => {
            if(this.canshoot)
            {
                this.canshoot = false;                         
                let tarrow = new Arrow( 1500, this.pos.x - (118/2) , this.pos.y + this.size.y/2 );
                entitylist.push(tarrow);
                let TA = [resources.get(images.w1).cloneNode(false),resources.get(images.w2).cloneNode(false)];
                let randroll = Math.floor(Math.random() * 2);
                TA[randroll].pause();
                TA[randroll].currentTime = 0;
                TA[randroll].play();
            }
        }

        this.update = () => {

            
            let delta = this.targetposy - this.pos.y;
            if(Math.abs(delta)>1)
            {
                this.pos.y += Math.sign(delta)*   Math.abs(delta) * 0.1 ;
                if(Math.abs(delta)>50)
                {
                this.state ="moving";
                this.sprite = this.animations[1];
                }
            }
            else
            {
                this.pos.y = this.targetposy;                
            }

            if(player_entity.state == "moving" && delta <=50)
            {
                this.state = "idle";
                this.sprite = this.animations[0];                
            }

            if(this.state == "idle" && this.canshoot)
            {
                this.sprite = this.animations[2];
                this.sprite.currentframe = 0;
                this.sprite.done = false;
                this.state = "attacking";
            }

            if(this.state == "attacking")
            {            
            let spriteframe = Math.floor(this.sprite.currentframe_modded);

            if( spriteframe == 4)
            {
                if(!this.hasshot){
                this.hasshot = true;
                this.shoot();
                }
            }
            else if(this.sprite.done){               
                this.state = "idle";
                this.sprite = this.animations[0];
                if(keyState["mouse"])
                {
                this.canshoot = true;
                }
            }
            else
            {
                this.hasshot = false;
            }
            }
        }
    }
}

class Arrow extends Entity{
    constructor(speed,posx,posy){
        
        let arrow_size_x = resources.get(images.arrow).width / arrow_scale;
        let arrow_size_y = resources.get(images.arrow).height / arrow_scale;;
        super(images.arrow, arrow_size_x,arrow_size_y);
        this.streak = 0;
        this.pos.x = posx;
        this.pos.y = posy;
        this.speed = speed;  
        this.order = -0.1;     
        

        this.update = () => {
            this.speed -= 0.01 * this.speed;
            
            if(this.pos.x  < - this.size.x)
            {
                this.enabled = false;
            }
            else
            {
                this.pos.x -= this.speed * dt;
            }
        }
        
    }
}

class Monster extends Entity{
    constructor(){
        let ma = new SpriteAnimation(images.monsters,0,0,[0,1,2,3,4],140,170,12,1);
        let size = 100 + Math.random()*100;
        super(ma, size,size);
        this.pos.x = 121 + Math.random() * (392 - this.size.x);
        this.pos.y = cav.height + this.size.y;
        let speedroll1 = -(200 + Math.random()*500);
        let speedroll2 = -(200 + Math.random()*500);
        this.speed = Math.max(speedroll1,speedroll2);
        this.state = "moving";    
        this.sprite.speed = this.speed/-350;   
        

        this.update = () => {
            this.speed -= this.speed * 0.001;
            if(this.state == "moving")
            {
                if(this.pos.y  < (cav.height * game_properties.starty) - this.size.y/2)
                {
                    resources.get(images.GameOver).currentTime =0;
                    resources.get(images.GameOver).play();
                    this.die();
                    monksmanager.removemonk(this.pos.x - this.size.x/2);
                }
                else
                {
                    this.pos.y += this.speed * dt;
                }

                entitylist.forEach(e=>{
                    if(e instanceof Arrow)
                    {
                        if(physics.checkCollision(this,e))
                        {
                            
                            let tcoin = resources.get(images.coin).cloneNode(false);
                            tcoin.currentTime = 0;
                            tcoin.play();
                            game_properties.Score += (e.streak+1) * 2;
                            this.die();
                            e.streak++;
                            e.speed *= 0.9;  
                        }
                    }
                })
                
            }
            else if(this.sprite.done)
            {
                this.enabled = false;
            }
        }
        this.die = ()=>{
            this.state = "dying";
            this.size.x = this.size.y;
            this.sprite = new SpriteAnimation(images.smoke,0,0,[0,1,2,3,4,5,6,7,8,9,10,11,12,13],500,500,24,1);
            this.sprite.loop = false;
        }
        
    }
}

class Boss extends Monster{
    constructor(){
        let ma = new SpriteAnimation(images.Boss,0,0,[0,1,2,3,4],140,170,8,1);
        super();
        this.sprite = ma;
        this.size = {x:300,y:300};
        this.pos.x = 121 + Math.random() * (392 - this.size.x);
        this.pos.y = cav.height + this.size.y;
        this.speed = -100;
        this.state = "moving";
        this.hp = 5;  
        this.order = 0.5;     
        

        this.update = () => {
            if(this.state == "moving")
            {
                if(this.pos.y  < (cav.height * game_properties.starty) - this.size.y/2)
                {
                    resources.get(images.GameOver).currentTime =0;
                    resources.get(images.GameOver).play();
                    this.die();
                    monksmanager.removemonk(this.pos.x - this.size.x/2);
                }
                else
                {
                    this.pos.y += this.speed * dt;
                }

                entitylist.forEach(e=>{
                    if(e instanceof Arrow)
                    {
                        if(physics.checkCollision(this,e))
                        {                            
                            this.hp -=1; 
                            let tcoin = resources.get(images.t1);
                            tcoin.currentTime = 0;
                            tcoin.play();                             
                            if(this.hp<=0)
                            {
                                game_properties.Score += (e.streak+1) * 20;                                
                                tcoin.currentTime = 0; 
                                this.die(); 
                                e.streak++; 
                                e.speed *= 0.9;                            
                            }              
                            else
                            {                                                             
                                e.enabled = false;
                            }            
                            
                        }
                    }
                })
                
            }
            else if(this.sprite.done)
            {
                this.enabled = false;
            }
        }
        this.die = ()=>{
            this.state = "dying";
            this.sprite = new SpriteAnimation(images.smoke,0,0,[0,1,2,3,4,5,6,7,8,9,10,11,12,13],500,500,24,1);
            this.sprite.loop = false;
        }
        
    }
}

class Monk extends Entity{
    constructor(){        
        super(images.monk,0,0);
        this.targetposx = this.pos.x;
        this.targetposy = this.pos.y;
        this.dead = false;
        
        this.update = () => {
            if(!this.dead){
            let dx = this.targetposx - this.pos.x;
            let dy = this.targetposy - this.pos.y;
            if(Math.abs(dx)>1)
            {
                this.pos.x +=  Math.sign(dx)*   Math.min(Math.abs(dx) * 0.05,50*dt) ;
            }
            else
            {
                this.pos.x = this.targetposx;                
            }
            if(Math.abs(dy)>1)
            {
                this.pos.y +=  Math.sign(dy)*   Math.min(Math.abs(dy) * 0.05,50*dt) ;
            }
            else
            {
                this.pos.y = this.targetposy;                
            }
        }
        else
        {
            this.pos.y -= 50 * dt;
        }

        if(this.pos.y < - this.size.y)
        {
            this.enabled = false;
        }

        };
        
    }
}

class MonksManager {
    constructor(){
        this.monkslist = [];
        this.monksleft = 0;
        this.draw = ()=>{};
        this.width =390;
        this.start = 120;
        this.starty =0;

        this.initmonks = (amount = game_properties.monks_count) => {
            this.monkslist = [];
            this.starty = cav.height* game_properties.starty - resources.get(images.monk).height/2; 
            this.monksleft = amount;
            console.log(amount);
            if(amount<=0)
            {
                return 0;
            }
            let monkwidth = resources.get(images.monk).width;
            let perrow = Math.floor(this.width/monkwidth); 
            if(amount > perrow)
            {                
                for (let index = 0; index < amount; index++) {
                        let tm = new Monk();
                        tm.pos.x = 121 + ((index%perrow) * 53);
                        tm.pos.y = this.starty +  (Math.floor(index/perrow) * -53); 
                        tm.order = index * -0.01;
                        tm.targetposx = tm.pos.x;
                        tm.targetposy = tm.pos.y;
                        this.monkslist.push(tm);        
                }
            }
            else
            {
                let spacing = (this.width - (amount * monkwidth))/2;
                for (let index = 0; index < amount; index++) {
                    let tm = new Monk();
                    tm.pos.x = 121 + spacing + ((index%perrow) * 53);
                    tm.targetposx = tm.pos.x;                    
                    tm.pos.y = this.starty;
                    tm.targetposy = tm.pos.y;
                    tm.order = index * -0.01;
                    this.monkslist.push(tm);        
                } 
            }            
            entitylist = entitylist.concat(this.monkslist);
        }        
    
    this.removemonk = (x=0)=>{
        
            this.monksleft--;
            if(this.monksleft <=0)
            {
                gameOver();
                this.monkslist[0].dead=true;
                return;
            }
            let monkwidth = resources.get(images.monk).width;
            let perrow = Math.floor(this.width/monkwidth);

            x = Math.floor(x / monkwidth);
            x = Math.max(x,0);
            if(x >= this.monkslist.length){ x= this.monksleft-1;}
            
            this.monkslist[x].dead = true;
            this.monkslist.splice(x,1);         

            if(this.monksleft > perrow)
            {
            let tmk = this.monkslist.splice(perrow-1,1);
            this.monkslist.unshift(tmk[0]);
                for (let index = 0; index < this.monkslist.length; index++) {
                    let tm = this.monkslist[index];
                    tm.targetposx = 121 + ((index%perrow) * 53);
                    tm.targetposy = this.starty +  (Math.floor(index/perrow) * -53); 
                    tm.order = index * -0.01;       
                }
            }
            else
            {
                let spacing = (this.width - (this.monksleft * monkwidth))/2; 
                for (let index = 0; index < this.monkslist.length; index++) {
                let tm = this.monkslist[index];  
                tm.targetposx = 121 + spacing + ((index%perrow) * 53);
                tm.targetposy = this.starty;
                tm.order = index * -0.01; 
                }
            }
        }
    }
}

function spawnmonsters (){
    if(Math.random() < 0.95)
    {
    entitylist.push( new Monster());
    }
    else
    {
    entitylist.push(new Boss());
    }
}



