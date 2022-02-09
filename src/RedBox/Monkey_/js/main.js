var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
cavMain.autofocus = true;
var cxt = cav.getContext("2d");


//resizing canvas
cav.width = 720;
cav.height = 1280;

cavMain.width = 720;
cavMain.height = 1280;


const gameStates ={
     
}


//game state initilization
var currentGameState;

//Object containing names of resources
var images = {    
        tileset : "./assets/sprites/tileset.png",
};


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let splash = document.createElement("img");
splash.src = "./assets/sprites/Splash.png";

var delay_interval;

splash.onload = () => {    
    window.resources.load(resources_paths);

    let counter =0;
    let tempcxt = cavMain.getContext('2d');

    delay_interval = setInterval(() => {
        if(counter>=game_properties.splash_time*1000 && resources.resourcesloadedcount == resources.resourcescount)
        {
            clearInterval(delay_interval);
            init();
        }   
        else
        {             

        tempcxt.fillStyle = "#ff0000";
        let loadpercent = resources.resourcesloadedcount/resources.resourcescount;
        let visible_loadpercent =  (loadpercent) < counter/game_properties.splash_time*1000?(loadpercent):counter/game_properties.splash_time*1000;

        tempcxt.fillRect(0,cavMain.height-10, visible_loadpercent*cavMain.width,10);
        tempcxt.fillStyle = "#000000";
        tempcxt.font =  "BOLD 30px Roboto"
        tempcxt.fillText(Math.ceil( visible_loadpercent*100) + "%",cavMain.width*0.88,cavMain.height - 25);

        counter += counter<game_properties.splash_time*1000?10:0;
        }
    }, 10);
    
};




//game properties
var game_properties ={  
   splash_time : 0.01, 
}

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];

var maintile;
var mainviewport;

//Player Entity



//Initilization function
function init()
{    
    let g=[];
    g.push( new Sprite(images.tileset,0,0,16,16));
    g.push( new Sprite(images.tileset,0,128,16,16));
    g.push( new Sprite(images.tileset,16,128,16,16));
    g.push( new Sprite(images.tileset,0,144,16,16));
    g.push( new Sprite(images.tileset,16,144,16,16));
    g.push( new Sprite(images.tileset,384,16,16,16));

    let tilemap = [
        0,0,0,0,0,864,865,866,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,897,898,899,289,0,58,58,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,6,6,322,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,381,382,383,0,2,91,2,2,2,2,0,0,274,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,
        0,0,303,304,305,0,58,58,58,58,58,58,58,273,307,275,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,348,378,378,378,349,350,58,58,58,58,58,273,306,307,308,341,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1
    ]

    maintile = new TilemapV2(resources.get(images.tileset),tilemap,50,7,16);
    //maintile = new Tilemap(g,tilemap,11,8,16);
    maintile.tiledisplaysize = 32;

    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    uiEntityList = onhoverlist;
   
    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    Rendering.setContext(cxt);

    loadmainmenu();

    

    cxt.imageSmoothingEnabled = false;

    main();
}

//mainmenu
function loadmainmenu(){
  
}

function loadgameUI(){
    
}

function loadpauseUI() {

    
}

function gameOver() {    
    
}

function clearUI(){
    while(uiEntityList.length !=0)
    {
        uiEntityList.pop();
    }
}

function resetgame() {
   
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;

    //DrawBackground();

    uiEntityList.forEach(e=>{
        draw(e);
    });

    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:

            break;
        case gameStates.pause:

            break;
        case gameStates.gameover: 
       
            break;
        default:         
        break;       
    }

    cxt.fillStyle = "#049CD8";
    cxt.fillRect(0,0,cav.width,cav.height);

    //mainviewport.zoomValue = 1 + Math.sin(Date.now() * 0.01) * 0.5;

    if(keyState["mouse"] || keyState["d"])
    {
    
    mainviewport.posx += 1 * mainviewport.zoomValue ;

    }
    if(keyState["a"])
    {
        mainviewport.posx -= 1 * mainviewport.zoomValue ;
    }

    if(keyState["w"])
    {
        mainviewport.posy -= 1 * mainviewport.zoomValue ;
    }
    if(keyState["s"])
    {
        mainviewport.posy += 1 * mainviewport.zoomValue ;  
    }
    if(keyState["q"])
    {
        mainviewport.zoomValue -= 0.01;    
    }
    if(keyState["e"])
    {
        mainviewport.zoomValue += 0.01;     
    }


    drawCall(maintile.draw,2);

    Rendering.renderDrawCalls();    
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);
    requestAnimationFrame(main);  
};

class ViewPort {
    constructor(posx,posy,width,height)
    {
        this.posx= posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.zoomValue = 1;
    }
}

class Tilemap {
    constructor(tiles,tilemap,width,height,tilesize)
    {
        this.tiles = tiles;
        this.tilemap = tilemap;
        this.width = width;
        this.height = height;
        this.tilesize = tilesize;
        this.tiledisplaysize = tilesize;

        this.gettilelocation= (posx,posy)=>{
            let xpos = Math.floor(posx/this.width);
            let ypox = Math.floor(posy/this.height);
    
            if(xpos>= 0 && xpos< width && ypos>= 0 && ypos< this.height )
            {
                return ((ypos * width) + xpos);
            }
            else
            {
                return null;
            }
        }
        this.draw = (context,viewport = mainviewport) => {            
            let scaledtilesize = this.tiledisplaysize/(1/viewport.zoomValue);
            let xmin =Math.floor(viewport.posx/scaledtilesize);
            let ymin =Math.floor(viewport.posy/scaledtilesize);
            let xmax =Math.ceil((viewport.posx + viewport.width) /scaledtilesize);
            let ymax =Math.ceil((viewport.posy + viewport.height) /scaledtilesize);

            for(let i=xmin;i<xmax;i++)
            {
                for(let j=ymin;j<ymax;j++)
                {
                    if(j>=0 && j< this.height&& i>=0 && i< this.width)
                    {
                    let tileindex = this.tilemap[(j*this.width)+i];

                    
                    if(tileindex!=0 && tileindex < tiles.length)
                    {
                        this.tiles[tileindex-1].draw(context,i*scaledtilesize - viewport.posx,j*scaledtilesize - viewport.posy,scaledtilesize,scaledtilesize);                         
                    }
                }
                }
            }
        }

    }    
    
}

class TilemapV2 {
    constructor(tileset,tilemap,width,height,tilesize)
    {
        this.tileset = tileset;
        this.tilemap = tilemap;
        this.width = width;
        this.height = height;
        this.tilesize = tilesize;
        this.tiledisplaysize = tilesize;

        this.gettilelocation= (posx,posy)=>{
            let xpos = Math.floor(posx/this.width);
            let ypox = Math.floor(posy/this.height);
    
            if(xpos>= 0 && xpos< width && ypos>= 0 && ypos< this.height )
            {
                return ((ypos * width) + xpos);
            }
            else
            {
                return null;
            }
        }
        this.draw = (context,viewport = mainviewport) => {
            
            let scaledtilesize = this.tiledisplaysize/(1/viewport.zoomValue);
            let xmin =Math.floor(viewport.posx/scaledtilesize);
            let ymin =Math.floor(viewport.posy/scaledtilesize);
            let xmax =Math.ceil((viewport.posx + viewport.width) /scaledtilesize);
            let ymax =Math.ceil((viewport.posy + viewport.height) /scaledtilesize);          
            
            for(let i=xmin;i<xmax;i++)
            {
                for(let j=ymin;j<ymax;j++)
                {  
                    
                    
                    if(j>=0 && j< this.height&& i>=0 && i< this.width )
                    {
                    let tileindex =  this.tilemap[(j*this.width)+i%this.width];    
                    if(tileindex!=0)
                    {        
                        tileindex--;    
                        let tilexcount = (this.tileset.width/this.tilesize);

                        cxt.drawImage(this.tileset, Math.floor(tileindex % tilexcount) * this.tilesize,Math.floor(tileindex/tilexcount) * this.tilesize,this.tilesize,this.tilesize
                        ,Math.round(i*scaledtilesize) - viewport.posx,Math.round(j*scaledtilesize)- viewport.posy,Math.round(scaledtilesize),Math.round(scaledtilesize))
                    }
                    }
                }
                
            }
        }

    }    
    
}

