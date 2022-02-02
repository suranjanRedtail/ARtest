var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 1;

NAME = "Rato";

const gameStates = {
    menu: 0,
    game: 1,
    gameover: 2,
    pause: 3,
    orientation: 4,
}

var last_platform;

//Object containing names of resources
var images = {

    //ui stuff
    Logo: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/Title.png",
    Playbutton: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/play.png",
    Pause: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/pause.png",
    Playagain: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/playagain.png",
    resume: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/resume.png",
    blackdrop: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/backdrop.png",
    whitedrop: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/backdrop_w.png",
    board: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/board.png",
    Background: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/bg.png",
    P_L: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/P_L.png",
    game_over_text: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/gameover_text.png",
    music_btn_on: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/music_on.png",
    effects_btn_on: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/sound_on.png",
    music_btn_off: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/music_off.png",
    effects_btn_off: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/sound_off.png",
    howto: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/how_to.png",

    //game stuff here

    apple: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/apple.png",
    platfrom: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/platform.png",
    jump: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/jmp.png",
    run: (gamesandapp ? actual_game_path : ".") + "/assets/sprites/run.png",

    //music stuff    
    BG: (gamesandapp ? actual_game_path : ".") + "/assets/sound/BG.mp3",
    GameOver: (gamesandapp ? actual_game_path : ".") + "/assets/sound/Gameover.mp3",
    coin: (gamesandapp ? actual_game_path : ".") + "/assets/sound/coin.wav",
    pop: (gamesandapp ? actual_game_path : ".") + "/assets/sound/pop1.ogg"
};

music_group = [
    images.BG,
];

effects_group = [
    images.coin,
    images.GameOver,
    images.pop
]

//game properties
game_properties = {
    game_time: 0,
    Enemy_speed: 150,
    life: 10,
    unit_scale: 10,
    gravity: 200,

    Score: 0,

    ball_speed: 300,
    bubble_speed: 7,


    debug_mode: false,
    base_exp: 50,
    drop: 1,
}

//Entity List
var oldmousestate = false;

var player_sprites = [];
var plate;

//player 
var player_entity;



var highScore = 0;
var totalScore = 0;

var timer = 0;
var nexttimer = 0.1;

text_color = "#fee845";
outline_color = "#000000";
score_color = "#ffffff";
button_color = "#009706";
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines = [
    "Hold to fly left",
    "or Right",
    "Score coins, Avoid Rocks!",
]

//customthings

var player_sprites = [];
var platfrom_sprite;
var apple_sprite;

var lp = 0;
var last_platfrom = null;


//init
function init() {
    player_sprites.push(new SpriteAnimation(images.run, 0, 0, getArrayFromRange(0, 14), 168.25, 100, 24, 1));
    player_sprites[0].loop = true;
    player_sprites[0].play = true;
    player_sprites.push(new SpriteAnimation(images.jump, 0, 0, getArrayFromRange(0, 2), 168.25, 100, 24, 0));
    platfrom_sprite = new Sprite(images.platfrom, 0, 0, 0, 0);
    apple_sprite = new Sprite(images.apple, 0, 0, 0, 0);

    player_entity = new Player();
    player_entity.reset();
    lp = player_entity.pos.x;
    Engine.onMouseUp.push(player_entity.onMouseUp);
    mainviewport.set_target(player_entity);
    mainviewport.lock_y = true;
    entitylist.push(player_entity);
    Engine.backgroundMode = 1;
}

var main = () => {

    switch (currentGameState) {
        case gameStates.menu:
            game_properties.game_time += dt;
            break;

        case gameStates.game:
            timer += dt;
            game_properties.game_time += dt;

            spawnPlatfrom();
            if (timer > nexttimer) {
                //SpawnStuff();
                nexttimer += 0.5 * (Math.random() + 1);
            }

            entitylist.forEach(e => {
                e.updateMain();
                window.draw(e);
            });
            mainviewport.update();



            break;
        case gameStates.pause:

            entitylist.forEach(e => {
                window.draw(e);
            });
            break;
        case gameStates.gameover:

            game_properties.game_time += dt;

            mainviewport.update();

            entitylist.forEach(e => {
                //e.updateMain();
                //window.draw(e);                        
            });

            break;

        case gameStates.orientation:
            window.drawCall(() => {
                cxt.fillStyle = "#ffffff";
                cxt.fillRect(0, 0, cav.width, cav.height);
                cxt.drawImage(window.resources.get(images.P_L), Math.floor((cavMain.width / 2) - (window.resources.get(images.P_L).width / 2)), 0, window.resources.get(images.P_L).width, window.resources.get(images.P_L).height);
            }, 11);
            break;
        default:
            break;
    }
}

function resetgame() {
    game_properties = Object.assign({}, game_properties_initial);
    window.SH.resetScore();

    entitylist = [];



    player_entity.reset();
    entitylist.push(player_entity);
    lp = player_entity.pos.x;
    last_platform = null;

    mainviewport.posx = 0;
    mainviewport.posy = 0;
    mainviewport.update();
}

DrawBackground = function () {
    let b0 = window.resources.get(images.Background);
    let off = -1 * (timer * 200) % b0.width;
    window.drawCall(
        () => {
            bxt.clearRect(0, 0, b0.width, b0.height);
            bxt.drawImage(b0, off, 0, b0.width, b0.height);
            bxt.drawImage(b0, off + b0.width, 0, b0.width, b0.height);
        }, -2);
}

class Player extends Entity {
    constructor() {
        super(player_sprites[0]);
        this.speedx = 350;
        this.speedy = 0;
        this.isgrounded = false;
        this.injump = false;
        this.centerPivot();

        this.lasty = 0;

        this.collider = new Entity(null, 62, 15);

        this.timer = 0;


        this.pos.x = cav.width / 4;
        this.pos.y = cav.height / 2 - 100;

        this.jump_spd = -500;

        this.reset = () => {
            this.pos.x = cav.width / 4;
            this.pos.y = cav.height / 2 - 100;
            this.speedy = 0;
            this.isgrounded = false;
            this.injump = false;
        }

        this.update = () => {
            this.lasty = this.pos.y;

            this.pos.x += this.speedx * dt;
            this.pos.y += this.speedy * dt;

            this.collider.pos.x = this.pos.x - this.pivot.x + 65;
            this.collider.pos.y = this.pos.y - this.pivot.y + 85;

            if (this.pos.y - this.pivot.y > cav.height) {
                gameOver();
                playSound(images.GameOver);
            }

            if (!this.isgrounded) {
                this.speedy += dt * (this.speedy > -4 ? 18 : 9) * 100;
            }

            let tground = false;


            entitylist.forEach(e => {
                if (e instanceof Platfrom) {
                    if (window.Physics.checkCollision(this.collider, e)) {
                        if (e.pos.y > this.pos.y + 20 && this.pos.y - this.lasty > 0) {
                            this.pos.y = e.pos.y - this.pivot.y;
                            tground = true;
                            this.speedy = 1;
                        }
                    }
                }
                else if (e instanceof Apple) {
                    if (window.Physics.checkCollision(this, e)) {
                        window.SH.addScore(10);
                        playSound(images.coin);
                        e.remove();
                    }
                }
            })


            if (!this.isgrounded && tground) {
                this.injump = false;
                this.isgrounded = tground;
                console.log(this.pos.x - this.timer);
            }
            this.isgrounded = tground;

            if (!this.isgrounded) {
                if (this.sprite != player_sprites[1]) this.sprite = player_sprites[1];
                let cf = Math.floor(((this.speedy + (this.jump_spd * -1)) / (this.jump_spd * -2)) * 3)
                cf = clamp(cf, 0, 2);

                this.sprite.currentframe = cf;
            }
            else {
                if (this.sprite != player_sprites[0]) {
                    this.sprite = player_sprites[0];
                    this.sprite.currentframe = 0;
                }
            }
        }

        this.jump = () => {
            if (this.isgrounded) {
                this.speedy = this.jump_spd;
                this.isgrounded = false;
                this.injump = true;
                this.timer = this.pos.x;
            }
        }

        this.onMouseUp = () => {
            if (currentGameState == gameStates.game) {
                this.jump();
            }
        }
    }
}

class Platfrom extends Entity {
    constructor() {
        super(platfrom_sprite);
        this.update = () => {
            if (this.pos.x < mainviewport.posx - this.size.x) {
                this.remove();
            }
        }
    }
}

class Apple extends Entity {
    constructor() {
        super(apple_sprite);
        this.oy = 0;
        this.centerPivot();
        this.update = () => {

            this.pos.y = this.oy + Math.sin(timer) * 30;
            if (this.pos.x < mainviewport.posx - this.size.x) {
                this.remove();
            }
        }
    }
}

function spawnPlatfrom() {
    if (lp - player_entity.pos.x < cav.width) {
        if (lp - player_entity.pos.x < cav.width / 2) {
            t = new Platfrom();
            t.pos.y = cav.height / 2;
            t.pos.x = lp;
            lp = lp + t.size.x;
            entitylist.push(t);
            last_platform = t;
        }
        else {
            let dir = 0;
            if (last_platform.pos.y < 200) {
                dir = 1;
            }
            else if (last_platform.pos.y > cav.height - 200) {
                dir = 2;
            }
            let ny = 0;
            dir = dir == 0 ? (Math.random() < 0.5 ? 1 : 2) : dir;
            switch (dir) {
                case 1:
                    ny = last_platform.pos.y + (Math.random() * 500);
                    break;
                case 2:
                    ny = last_platform.pos.y - (Math.random() * 100);
                    break;
            }
            ny = clamp(ny, 200, cav.height - 40);
            console.log(ny, last_platform, dir);
            t = new Platfrom();
            t.pos.y = ny;
            let xroll = Math.random() * 450;
            xroll = clamp(xroll, 0, 300);

            t.pos.x = lp + 10 + xroll;
            lp = t.pos.x + t.size.x;
            entitylist.push(t);
            last_platform = t;
            if (Math.random() < 0.15) {
                let ta = new Apple();
                ta.pos.x = t.pos.x + t.size.x / 2;
                ta.oy = ta.pos.y = t.pos.y - 40;
                entitylist.push(ta);
            }
        }
    }
}

