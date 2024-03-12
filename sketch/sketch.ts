
const _bocchiFaces = {
    normal: p5.Image.prototype,
    shock: p5.Image.prototype,
    xi: p5.Image.prototype
};
var fnt: p5.Font;

var current_bocchi_face: p5.Image;
var hitbox: Rect;

var game: Game;
var gameOver: boolean = false;

/**
 * Key is the score the player needs to reach, value is [ticks, loss amount]
 */
const difficultyDictionary = {
    "0":   [60, 1],
    "50":  [50, 2],
    "100": [40, 4],
    "150": [30, 8],
    "200": [20, 12],
    "250": [10, 14]
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function preload() {
    _bocchiFaces.normal = loadImage('assets/bocchi.png');
    _bocchiFaces.shock  = loadImage('assets/bocchi_Dx.png');
    _bocchiFaces.xi     = loadImage('assets/bocchi_x.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    hitbox = new Rect({x: 180, y: 220, w: 230, h: 210})
    .fillColor(null)
    .outlineColor(null)
    .mouseHover((self)=>{
        if (self.isPressed) return;
        current_bocchi_face = _bocchiFaces.xi;
    })
    .mouseHoverRelease((self)=>{
        if (self.isPressed) return;
        current_bocchi_face = _bocchiFaces.normal;
    })
    .mouseDown((self)=>{
        current_bocchi_face = _bocchiFaces.shock;
        if (game.timer.playbackState == TimerPlaybackStates.STOPPED && !gameOver)
            game.start();
        else if (game.timer.playbackState == TimerPlaybackStates.PLAY) {
            game.timer.tick = game.timer.maxTime;
            game.score++;
        }
        // console.log("hitbox clicked!");
    })
    .mouseUp((self)=>{
        if (Rect.CollidePointRect({x:mouseX,y:mouseY}, self.toRectCon()))
        current_bocchi_face = _bocchiFaces.xi;
        else
            current_bocchi_face = _bocchiFaces.normal;
            // console.log("hitbox release!");
        }
    )
    current_bocchi_face = _bocchiFaces.normal;
    game = new Game();
}
function draw() {
    background(37);
    image(current_bocchi_face, 20, 20);
    hitbox.render();

    game.render();
    calculateDifficulty();
    
}

function calculateDifficulty() {
    for (let [k,v] of Object.entries(difficultyDictionary)) {
        if (game.highScore >= parseInt(k)) {
            game.setDifficultyTick(v[0]);
            game.lossAmount = v[1] || 1;
        }
    }
}
