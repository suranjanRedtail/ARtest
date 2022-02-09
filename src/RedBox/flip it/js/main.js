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
    board : "./assets/sprites/board.png",    
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png", 
    help : "./assets/sprites/help.png",
    
    card_back : "./assets/sprites/back.png",
    flower : "./assets/sprites/flower.png",
    fox : "./assets/sprites/fox.png",
    heart: "./assets/sprites/heart.png",
    island : "./assets/sprites/island.png",
    nepal : "./assets/sprites/nepal.png",
    rabbit : "./assets/sprites/rabbit.png",
    teapot : "./assets/sprites/teapot.png",

    BG : "./assets/sound/BG.mp3", 
    GameOver : "./assets/sound/passturn.wav",
    coin : "./assets/sound/coin.wav",
    draw : "./assets/sound/draw.wav",
    playcard : "./assets/sound/playcard.wav",
    error : "./assets/sound/error.wav",
    passturn : "./assets/sound/Passturn.wav",
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
    Timer : 100,
    Level : 1,

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

var gameManager;

var back_Sprite;

var Cards = [
    images.flower,
    images.fox,
    images.heart,
    images.island,
    images.nepal,
    images.rabbit,
    images.teapot
];

var CardSprites =[];

const cardStates ={   
    anim:0,
    covered:1,
    flipped:2,
    matched:3, 
    raised:4,
    dead:5,
}

const card_size = [270,374];
const card_size_small = [180,250];
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
            clearUI();
            loadgameUI();
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true; 
            gameManager.init();
            setTimeout( ()=>{
                resources.get(images.BG).currentTime=0;
                resources.get(images.BG).loop = true;
                if(resources.get(images.BG).paused)
                {
                    resources.get(images.BG).play();
                }
                resources.get(images.BG).volume =0.5;
            },500);
            
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
    gameManager.reset();   
}

//Initilization function
function init()
{
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    back_Sprite = new Sprite(images.card_back,0,0,0,0);
    gameManager = new GameManager();

    Cards.forEach(element => {
        CardSprites.push(new Sprite(element,0,0,0,0));
    });

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
            game_properties.Timer -= dt;

            if(game_properties.Timer<=0)
            {
                game_properties.Timer=0;
                gameOver();                
                playSound(images.GameOver);
            }

            if(timer > nexttimer)
            {
                
            }            

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
                cxt.strokeText(Math.floor(game_properties.Timer),cav.width-cav.width/2 +60/2,95);
                cxt.fillStyle = score_color;
                cxt.font = "bold 70px GameFont";
                cxt.fillText(game_properties.Score,cav.width-60,95);  
                cxt.fillText(Math.floor(game_properties.Timer),cav.width-cav.width/2 +60/2,95);
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

    Engine.onClick= Engine.onClick.filter(e=>{
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
    let b0 = resources.get(images.Background);
    
    drawCall(
        ()=>{ 
            cxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2); 
     
}

class Card extends Entity
{
    constructor()
    {
        super(null,1,1);
        this.ID =0;
        this.pos ={x:cav.width/2-this.size.x/2,y:-this.size.y*2};
        this.sprite = back_Sprite;
        this.cardFront = null;
        this.state = cardStates.anim;
        this.targetPos = {x:0,y:0};
        
        this.update = ()=>{
            if(this.state == cardStates.anim)
            {
                let c=0;
                let del = this.targetPos.x - this.pos.x;
                if( Math.abs(del)>1)
                {
                    this.pos.x = this.pos.x + del * 0.2;
                }
                else
                {
                    this.pos.x = this.targetPos.x;
                    c++;
                }
                del = this.targetPos.y - this.pos.y;
                if( Math.abs(del)>1)
                {
                    this.pos.y = this.pos.y + del * 0.2;
                }
                else
                {
                    this.pos.y = this.targetPos.y;
                    c++;
                }
                if(c==2)
                {
                    this.state=cardStates.covered;
                }
            }
            else if(this.state == cardStates.dead)
            {                
                this.opacity -= 1 * dt;
                if(this.opacity<=0)
                {
                    this.enabled=false;
                }
            }
        }

        this.setMatched = ()=>{
            this.state = cardStates.dead;
            this.pos.y = this.targetPos.y;
            this.sprite = this.cardFront;
        }

        this.setCovered = ()=>{
            this.state = cardStates.covered;
            this.pos.y = this.targetPos.y;
            this.sprite = back_Sprite;
        }

        this.setFlipped = ()=>{
            this.state = cardStates.flipped;
            this.sprite = this.cardFront;
        }

        this.setSize =(size="small")=>
        {
            if(size=="small")
            {
                this.size.x =card_size_small[0];
                this.size.y =card_size_small[1];
            }
            else
            {
                this.size.x =card_size[0];
                this.size.y =card_size[1];
            }
        }
        Engine.onClick.push(this);

        this.onClick = ()=>{    
            if(!gameManager.isready)
            {
                return;
            }        
            if(Physics.checkCollisionPoint(this,{x:mousePos[0],y:mousePos[1]}))
            {            
                if(this.state==cardStates.covered)
                {
                    console.log(this.id , this.state);
                    this.pos.y = this.targetPos.y - 10;
                    this.state = cardStates.raised;

                    playSound(images.playcard);
                }
            }
        }

        Engine.onMouseUp.push( ()=>{
            if(!gameManager.isready)
            {
                return;
            }
            this.pos.y = this.targetPos.y;
            if(Physics.checkCollisionPoint(this,{x:mousePos[0],y:mousePos[1]}) && this.state == cardStates.raised)
            {                
                this.state = cardStates.flipped;
                this.sprite = this.cardFront;
                gameManager.checkFlip(this);
                playSound(images.draw);
            }
            else if(this.state == cardStates.raised)
            {
                console.log("unflipping ",this.id , this.state);
                this.state=cardStates.covered;
            }
            
        });

    }
}

class GameManager 
{
    constructor()
    {
        this.cardList=[];
        this.current_Flipped=null;
        this.cardCount =0;
        this.isready=true;
        this.cardCol =[];
        this.level = 1;

        this.init =(mode=[3,4])=>{

            entitylist.push(new Level(game_properties.Level));

            this.cardCount=0;
            this.cardCol = [];
            let cardcoltemp = [];
            for (let index = 0; index < 6; index++) {
                while(true)
                {
                    let ti =  Math.floor(Math.random()*Cards.length);
                    if(cardcoltemp.indexOf(ti)<0)
                    {
                        cardcoltemp.push(ti);
                        break;
                    }   
                }                           
            }
            cardcoltemp.forEach(e=>{
                this.cardCol.push({
                    id: e,
                    count: 2,
                })
            });            

            let spacingX = (cav.width- mode[0]*card_size_small[0])/(mode[0]+1);
            let spacingY = (cav.height- mode[1]*card_size_small[1])/(mode[1]+1);
            let int;  
            let it = {i:0,j:0}   
            int = setInterval(() => {                
                let newCard = new Card();
                newCard.setSize();
                newCard.targetPos.x = (spacingX*(it.j+1)) + card_size_small[0]*it.j;
                newCard.targetPos.y = (spacingY*(it.i+1)) + card_size_small[1]*it.i;   
                this.cardCount++;
                
                newCard.ID = this.pickID();
                newCard.cardFront = CardSprites[newCard.ID];

                entitylist.push(newCard);
                this.cardList.push(newCard);
                playSound(images.playcard);
                it.j++;
                if(it.j>=3)
                {
                    it.i++;
                    it.j=0;
                    if(it.i>=4)
                    {
                        clearInterval(int);
                    }              
                }
                console.log(it);
            }, 100);            
        }

        this.reset =()=>{

            game_properties.Level++;
            

            this.cardList.forEach(element => {
                element.state = cardStates.dead;
            });
            this.cardList=[];
            this.current_Flipped=null;
            this.init();
        }

        this.checkFlip=(card)=>{
            if(this.isready)
            {
                this.isready = false;
                if(this.current_Flipped)
                {
                    setTimeout(() => {
                
                        if(this.current_Flipped.ID == card.ID)
                        {
                            this.current_Flipped.setMatched();
                            card.setMatched();
                            
                            this.current_Flipped = null;
                            
                            this.cardCount -= 2;
                            if(this.cardCount<=0 && currentGameState==gameStates.game)
                            {
                                this.reset();
                                playSound(images.passturn);
                                game_properties.Timer += 5;
                            }

                            playSound(images.coin);
                            game_properties.Score+=50;

                        }
                        else
                        {
                            this.current_Flipped.setCovered();
                            card.setCovered();
                            this.current_Flipped = null;
                            playSound(images.error);
                        }
                        this.isready=true;                        
                    },1000);
                }
                else
                {
                    this.current_Flipped = card;
                    this.isready=true;
                }            
            }
        }

        this.pickID =()=>{
            while(true)
            {
                let index = Math.floor(Math.random()*this.cardCol.length);
                if(this.cardCol[index].count>0)
                {
                    this.cardCol[index].count--;
                    return this.cardCol[index].id;
                }
            }
        }
    }
}

class Level extends Entity {
    constructor(level)
    {
        super(null,1,1)
        this.fontSize = 140;
        this.Text = "Level "+level;
        this.time = 1;
        this.order = 0.2;

        this.pos.x = cav.width/2;
        this.pos.y = 516 + this.fontSize/1.5;

        this.update = ()=>{
            this.time -= dt;
            if(this.time <0)
            {
            this.opacity -= 2 * dt;
            }
            if(this.opacity <= 0)
            {
                this.enabled = false;
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
                
                context.fillStyle = "#ffbb00";
                context.strokeStyle = "#000000";
                context.textAlign = "center";
                context.font = this.fontSize+"px GameFont"; 
                context.lineWidth = 10;    
                context.strokeText(this.Text,this.pos.x,this.pos.y);       
                context.fillText(this.Text,this.pos.x,this.pos.y);                

                if(this.opacity!=1)
                {
                    context.restore();
                }     
            }
        }

    }
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