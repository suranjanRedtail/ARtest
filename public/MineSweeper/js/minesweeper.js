var title = document.getElementById("Title");
var main = document.getElementById("main");
var result = document.getElementById("result");



var beststorediv;
var bestscore= localStorage.getItem("highscore")==null?Number.MAX_VALUE:parseInt(localStorage.getItem("highscore"));

var timerdiv;

var name;
var diffuculty;

var xgrid,ygrid,bomb;

var gridbomb = [];
var gridopened = [];
var barray =[];
var gridnearbombcount =[];
var playable = true;
var gridflag = [];

var gamestart= false;

var gametimer = 0;

var colorback="#333333";

var opengridcount =0; 

function winsound(){
    document.getElementById("WIN").currentTime =0;
    document.getElementById("WIN").volume=0.5;
    document.getElementById("WIN").play();
    
}

function losesound(){
    document.getElementById("LOSE").currentTime =0;
    document.getElementById("LOSE").volume=0.5;
    document.getElementById("LOSE").play();
    
}

function wowsound(){
    document.getElementById("WOW").currentTime =0;
    document.getElementById("WOW").volume=0.8;
    document.getElementById("WOW").play();
}

function stopsound(){
    document.getElementById("WIN").pause();
    document.getElementById("LOSE").pause();
    document.getElementById("WOW").pause();
}

var colors = ["black","wheat"," rgb(17, 200, 10)","red","yellow","orange","purple","purple"]
result.style.textAlign ="center";
Menu();

var flagcount;

var isplaying = false;



function Menu(){

    clearscreen(); 
       
    title.innerHTML = "<div class='title2'><h1 style='width:fit-content'>MINESWEEPER</h1></div></br>";
    main.innerHTML ="<div class='menu' id='menu'>";
    var menu = document.getElementById("menu");
    menu.innerHTML +="<br> <B>Name</B><br> <input id='nametext' class='inputfield'></br></br>";
    menu.innerHTML +="<B>Difficulty</B><br> ";
    menu.innerHTML +="<select id='difficulty' class='inputfield' onchange='detailschange(this.value)'><option value='0'>Easy</option><option value='1'>Medium</option><option value='2' style='color:red;' >HARD!!</option></select>"
    menu.innerHTML +="<br><br><div id='details' style='margin:auto;width:fit-content;height:fit-content;border-style:solid;padding:10px'>Grid: <br> Mines: </div>"
    menu.innerHTML += "<br><br> <br><button onclick='readygame()' class='Play'>PLAY</button><br><br><br> ";
    var temp = document.getElementById("nametext");
    temp.value = navigator.platform;
    detailschange(0);    
};

function clearscreen(){
    title.innerHTML ="";
    main.innerHTML="";
    result.innerHTML="";    
}

function detailschange(c){
    var details=document.getElementById("details");       
    switch(parseInt(c)){
        case(0):
        details.innerHTML = "Grid: 10 x 8 <br> Mines: 10 ";
        break;
        case(1):
        details.innerHTML = "Grid: 18 x 14 <br> Mines: 30 ";
        break;
        case(2):
        details.innerHTML = " <span style='color:red'> I CAN'T BELIEVE YOU EVEN DARED</span>";
        break;
        default:
            break;
    }

}

function readygame(){

    playbmg();

    name=document.getElementById('nametext').value;
    diffuculty = parseInt(document.getElementById('difficulty').value);
        
    
    if(parseInt(diffuculty)==2){
        if(confirm("ARE YOU SURE?")){
            makegame(diffuculty);
        }
    }
    else{
        makegame(diffuculty);
    }
}

function makegame(difficulty){    
    
    clearscreen();
    

    switch(difficulty){
        case(0): 
        xgrid=8;
        ygrid=10;
        bomb=10;
        break;
        case(1): 
        xgrid=14;
        ygrid=18;
        bomb=30;
        break;
        case(2): 
        xgrid=24;
        ygrid=24;
        bomb=100;
        break;
    }
   
    result.innerHTML = "";
    gametimer=0;
    gridbomb = []; 
    gridopened = [];
    barray =[];
    gridnearbombcount=[];
    gridflag = [];
    opengridcount = 0; 
    flagcount=0;
    gamestart = false;

    for(var i=0;i<xgrid*ygrid;i++){
        gridbomb[i]=false;
        gridopened[i]=false;
        gridflag[i] = false;
        gridnearbombcount[i]=0;
        var x = document.createElement('button');
        x.setAttribute("id",i);
        x.setAttribute("onclick","nodepress(this.id)");
        x.setAttribute("class","grid");  
        x.setAttribute("oncontextmenu","flag(this.id);return false; ")             
        barray.push(x);      
    } 
    
    title.innerHTML = "<div class='title2'><h1 style='width:fit-content'>MINESWEEPER</h1></div></br>";
    main.innerHTML += "<div style='display:flex;margin:auto;width:fit-content;'><div id='timer' class='timer' ></div><span style='padding:10px;'></span><div id='bestscore' class='timer' style='color:gold'></div></div><br>"
    
    var temp = bomb;

    while(temp > 0){
        var temp2 = Math.random() * (xgrid * ygrid);
        temp2 = Math.round(temp2);
        if(gridbomb[temp2]==false){
            gridbomb[temp2]=true;            
            if(temp2 ==0){
                gridnearbombcount[temp2+1]++;
                gridnearbombcount[temp2+xgrid]++;
                gridnearbombcount[temp2+xgrid+1]++;
            }
            else if(temp2 ==xgrid-1){
                gridnearbombcount[temp2-1]++;
                gridnearbombcount[temp2+xgrid]++;
                gridnearbombcount[temp2+xgrid-1]++;
            }
            else if(temp2== (xgrid*ygrid)-1){
                gridnearbombcount[temp2-1]++;
                gridnearbombcount[temp2-xgrid]++;
                gridnearbombcount[temp2-xgrid-1]++;
            }
            else if(temp2== (xgrid*ygrid)-xgrid){
                gridnearbombcount[temp2+1]++;
                gridnearbombcount[temp2-xgrid]++;
                gridnearbombcount[temp2-xgrid+1]++;
            }
            else if(temp2 % xgrid ==0){
                gridnearbombcount[temp2+1]++;
                gridnearbombcount[temp2-xgrid]++;
                gridnearbombcount[temp2+xgrid]++;
                gridnearbombcount[temp2-xgrid+1]++;
                gridnearbombcount[temp2+xgrid+1]++;                
            }
            else if((temp2+1) % xgrid ==0){
                gridnearbombcount[temp2-1]++;
                gridnearbombcount[temp2-xgrid]++;
                gridnearbombcount[temp2+xgrid]++;
                gridnearbombcount[temp2-xgrid-1]++;
                gridnearbombcount[temp2+xgrid-1]++;                
            }
            else if(temp2>(xgrid * (ygrid-1))){
                gridnearbombcount[temp2-1]++;
                gridnearbombcount[temp2+1]++;                
                gridnearbombcount[temp2-xgrid]++;
                gridnearbombcount[temp2-xgrid-1]++;
                gridnearbombcount[temp2-xgrid+1]++;                
            }
            else if(temp2<xgrid-1){
                gridnearbombcount[temp2-1]++;
                gridnearbombcount[temp2+1]++;                
                gridnearbombcount[temp2+xgrid]++;
                gridnearbombcount[temp2+xgrid-1]++;
                gridnearbombcount[temp2+xgrid+1]++;                
            }
            else{
                gridnearbombcount[temp2-1]++;
                gridnearbombcount[temp2+1]++; 
                gridnearbombcount[temp2+xgrid]++; 
                gridnearbombcount[temp2-xgrid]++;
                gridnearbombcount[temp2+xgrid-1]++;
                gridnearbombcount[temp2+xgrid+1]++;
                gridnearbombcount[temp2-xgrid-1]++;
                gridnearbombcount[temp2-xgrid+1]++;
            }            
            temp--;
        }                
    }

    main.innerHTML += "<div class='gameboard' id='gameboard'></div>";
    var gameboard = document.getElementById("gameboard");
    for(var i=0;i<xgrid*ygrid;i++){
        gameboard.appendChild(barray[i]);          
    } 

    var r = "auto";

    for(var i=1;i<xgrid;i++){
        r +=" auto";
    }

    timerdiv = document.getElementById("timer");
    bestscorediv = document.getElementById("bestscore");
    timerdiv.innerHTML="0.0";
    
    if(bestscore==Number.MAX_VALUE){
        bestscorediv.innerHTML="NaN";
    }
    else{
        bestscorediv.innerHTML=bestscore.toFixed(1);
    }

    gameboard.setAttribute("style","grid-template-columns:"+r); 
    
    result.innerHTML="<br><button onclick='Menu()'class='Play'>Main Menu</button> <span style='padding:10px;'></span><button class='Play' onclick='makegame();stopsound();'>Reset</button>";

    GridSize(40);

}

function nodepress(temp2){
    temp2 = parseInt(temp2);
    if(!gamestart){
        gamestart= true;
        starttimer();
    }

    if(gridopened[temp2] || gridflag[temp2]){return;}

    if(gridbomb[temp2]){
        showbombs();
        gameover();
    }
    else if(gridnearbombcount[temp2] ==0){
        zerocheck(temp2);
    }
    else{
        barray[temp2].style.background = colorback;
        if(gridnearbombcount[temp2] !=0){
        barray[temp2].innerHTML = gridnearbombcount[temp2];
        barray[temp2].style.color = colors[gridnearbombcount[temp2]];
        barray[temp2].setAttribute("onclick","");
        gridopened[temp2]=true;
        opengridcount++;
        }
    }
    wincheck();
}

function showbombs(){
    for(var i=0;i<xgrid*ygrid;i++){
        if(!gridbomb[i]){
            if(gridnearbombcount[i]!=0){
        barray[i].innerHTML=gridnearbombcount[i];
        barray[i].style.color = colors[gridnearbombcount[i]];        
            }
            barray[i].style.background = colorback;
        }
        else{
            barray[i].innerHTML="<img src='assets/bomb.jpg' height='100%' width='100%' style='align-self:center'>";
            barray[i].style.background = "red";
        }
    }
}
function gameover(){
    disablegame();
    losesound();
    result.innerHTML="<h1 class='win'>YOU LOST</h1> <button class='Play' onclick='Menu();stopsound();'>Main Menu</button> <span style='padding:10px;'></span> <button class='Play' onclick='makegame();stopsound();'>Reset</button> ";
}

function zerocheck(temp2){
    temp2 = parseInt(temp2);    
    if(gridopened[temp2] || gridflag[temp2] || barray[temp2]==null){
        return;
    }     
    else if(gridnearbombcount[temp2]!=0 ){
        barray[temp2].style.background = colorback;        
        barray[temp2].innerHTML = gridnearbombcount[temp2];
        barray[temp2].style.color = colors[gridnearbombcount[temp2]];
        barray[temp2].setAttribute("onclick","");
        gridopened[temp2]=true;
        opengridcount++;        
    }  
    else{
    gridopened[temp2]=true;
    barray[temp2].style.background = colorback;
    opengridcount++;
    barray[temp2].setAttribute("onclick","");

    if(temp2 ==0){
        zerocheck(temp2+1);
        zerocheck(temp2+xgrid);
        zerocheck(temp2+xgrid+1);
    }
    else if(temp2 ==xgrid-1){
        zerocheck(temp2-1);
        zerocheck(temp2+xgrid);
        zerocheck(temp2+xgrid-1);
    }
    else if(temp2== (xgrid*ygrid)-1){
        zerocheck(temp2-1);
        zerocheck(temp2-xgrid);
        zerocheck(temp2-xgrid-1);
    }
    else if(temp2== (xgrid*ygrid)-xgrid){
        zerocheck(temp2+1);
        zerocheck(temp2-xgrid);
        zerocheck(temp2-xgrid+1);
    }
    else if(temp2 % xgrid ==0){
        zerocheck(temp2+1);
        zerocheck(temp2-xgrid);
        zerocheck(temp2+xgrid);
        zerocheck(temp2-xgrid+1);
        zerocheck(temp2+xgrid+1);                
    }
    else if((temp2+1) % xgrid ==0){
        zerocheck(temp2-1);
        zerocheck(temp2-xgrid);
        zerocheck(temp2+xgrid);
        zerocheck(temp2-xgrid-1);
        zerocheck(temp2+xgrid-1);                
    }
    else if(temp2>(xgrid * (ygrid-1))){
        zerocheck(temp2-1);
        zerocheck(temp2+1);                
        zerocheck(temp2-xgrid);
        zerocheck(temp2-xgrid-1);
        zerocheck(temp2-xgrid+1);                
    }
    else if(temp2<xgrid-1){
        zerocheck(temp2-1);
        zerocheck(temp2+1);                
        zerocheck(temp2+xgrid);
        zerocheck(temp2+xgrid-1);
        zerocheck(temp2+xgrid+1);                
    }
    else{
        zerocheck(temp2-1);
        zerocheck(temp2+1);
        zerocheck(temp2+xgrid); 
        zerocheck(temp2-xgrid);
        zerocheck(temp2+xgrid-1);
        zerocheck(temp2+xgrid+1);
        zerocheck(temp2-xgrid-1);
        zerocheck(temp2-xgrid+1);
    }  
    
}  
wincheck();        

}

function flag(c){

    if(gridopened[c]){return;} 
    
    gridflag[c] = !gridflag[c]; 
      
    if(gridflag[c]){
        barray[c].innerHTML="<img src='assets/flag.png' width='100%' height='100%' style='background-color: transparent;'>";
        flagcount++;
    }
    else{
        barray[c].innerHTML="";
        flagcount--;
    }

}

function wincheck(){
    if(opengridcount ==  (xgrid * ygrid)-bomb){
        disablegame();
        
        if(gametimer/1000 <= bestscore){
            
            bestscore = gametimer/1000; 
            bestscorediv.innerHTML=bestscore.toFixed(1); 
            localStorage.setItem("highscore",bestscore.toFixed(1).toString());
            wowsound();          
        }   
        else{
            winsound();
        }             
        result.innerHTML=" <h1 class='win'>YOU WON</h1> <button onclick='Menu()'class='Play'>Main Menu</button> <span style='padding:10px;'></span> <button class='Play' onclick='makegame()'>Reset</button> ";
    }
}
function disablegame(){
    gamestart = false;    
    for(var i=0;i<xgrid*ygrid;i++){
        barray[i].setAttribute("onclick","return false;");
    }
}

function starttimer(){
    gametimer=0;   
}

function updatetime(){
    if(gamestart){
    gametimer +=50;
    timerdiv.innerHTML = (gametimer/1000).toFixed(1); 
    }
}

window.setInterval(updatetime,50);

function playbmg(){
    if(!isplaying){
        document.getElementById("bmg").play();
        document.getElementById("bmg").volume =0.5;
       isplaying=true;
    }
}

function GridSize(c){
    for(var i=0;i<xgrid*ygrid;i++){
    barray[i].style.width=c;
    barray[i].style.height=c;
    barray[i].style.fontSize = c*75/100;

    }

}









