class Rect {
    constructor({ x, y, w, h }) {
        this.saved_outline_color = null;
        this.saved_fill_color = null;
        this._mouseIsPressed = false;
        this._mouseWasPressed = false;
        this._mouseIsInside = false;
        this._mouseWasInside = false;
        this._mouseHover = () => { };
        this._mouseHoverRelease = () => { };
        this._mousePressed = () => { };
        this._mouseDown = () => { };
        this._mouseUp = () => { };
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.outline_color = null;
        this.fill_color = 'green';
    }
    static CollidePointRect(pt, rect) {
        return (pt.x >= rect.x &&
            pt.y >= rect.y &&
            pt.x <= rect.x + rect.w &&
            pt.y <= rect.y + rect.h);
    }
    static CollideRects(r1, r2) {
        return (r1.x + r1.w >= r2.x &&
            r1.x <= r2.x + r2.w &&
            r1.y + r1.h >= r2.y &&
            r1.y <= r2.y + r2.h);
    }
    get isPressed() { return this._mouseIsPressed; }
    toRectCon() {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
    }
    render() {
        this.update();
        if (!this.outline_color)
            noStroke();
        else {
            strokeWeight(2);
            stroke(this.outline_color);
        }
        if (!this.fill_color)
            noFill();
        else {
            fill(this.fill_color);
        }
        rect(this.x, this.y, this.w, this.h);
    }
    update() {
        this._mouseIsInside = Rect.CollidePointRect({ x: mouseX, y: mouseY }, this.toRectCon());
        this._mouseIsPressed = (this._mouseWasPressed || (this._mouseIsInside && !this._mouseWasPressed)) && mouseIsPressed;
        if (this._mouseIsInside && !this._mouseWasInside)
            this._mouseHover(this);
        else if (!this._mouseIsInside && this._mouseWasInside)
            this._mouseHoverRelease(this);
        if (this._mouseIsInside && this._mouseIsPressed && !this._mouseWasPressed) {
            this._mouseDown(this);
        }
        if (this._mouseIsPressed) {
            this._mousePressed(this);
        }
        if (!this._mouseIsPressed && this._mouseWasPressed) {
            this._mouseUp(this);
        }
        this._lateUpdate();
    }
    _lateUpdate() {
        this._mouseWasInside = this._mouseIsInside;
        this._mouseWasPressed = this._mouseIsPressed;
    }
    mouseHover(callback = () => { }) {
        if (typeof callback != 'function')
            this._mouseHover = () => { };
        else
            this._mouseHover = callback;
        return this;
    }
    mouseHoverRelease(callback = () => { }) {
        if (typeof callback != 'function')
            this._mouseHoverRelease = () => { };
        else
            this._mouseHoverRelease = callback;
        return this;
    }
    mousePressed(callback = () => { }) {
        if (typeof callback != 'function')
            this._mousePressed = () => { };
        else
            this._mousePressed = callback;
        return this;
    }
    mouseDown(callback = () => { }) {
        if (typeof callback != 'function')
            this._mouseDown = () => { };
        else
            this._mouseDown = callback;
        return this;
    }
    mouseUp(callback = () => { }) {
        if (typeof callback != 'function')
            this._mouseUp = () => { };
        else
            this._mouseUp = callback;
        return this;
    }
    fillColor(value) {
        this.fill_color = value;
        return this;
    }
    outlineColor(value) {
        this.outline_color = value;
        return this;
    }
    saveColor(option = 'both') {
        if (option == "fill" || option == "both")
            this.saved_fill_color = this.fill_color;
        if (option == "outline" || option == "both")
            this.saved_outline_color = this.outline_color;
        return this;
    }
    loadColor(option = 'both') {
        if (option == "fill" || option == "both")
            this.fill_color = this.saved_fill_color;
        if (option == "outline" || option == "both")
            this.outline_color = this.saved_outline_color;
        return this;
    }
}
class Game {
    constructor(difficulty = 60) {
        this.lossAmount = 1;
        let buffer = [0x00];
        this._highScore = 1;
        this._score = 1;
        this.timer = new IntervalTimer(difficulty, this.update, { game: this });
        this.lossAmount = 1;
        this.display = (self) => {
            return "Click on bocchi to start the game";
        };
    }
    get highScore() { return this._highScore; }
    setDifficultyTick(t) {
        let tick = this.timer.tick;
        this.timer.maxTime = t;
        this.timer.tick = tick;
    }
    start() {
        this.timer.start();
        this.display = (self) => {
            return `Score: ${self.score}\nHigh score: ${self._highScore}\nTimer: ${self.timer.tick}`;
        };
    }
    get score() {
        let n = this._score;
        return n;
    }
    set score(value) {
        this._score = value;
        if (value > this._highScore)
            this._highScore = this._score;
    }
    render() {
        push();
        noStroke();
        fill('white');
        textSize(16);
        text(this.display(this), 30, 40);
        pop();
        this.timer.update();
    }
    update(timer, vars) {
        vars.game.score -= vars.game.lossAmount;
        if (vars.game.score < 0) {
            gameOver = true;
            vars.game.timer.stop();
            console.log(`Game over!\nFinal high score: ${vars.game._highScore}`);
            vars.game.display = (self) => {
                return `Game over!\nFinal high score: ${self._highScore}`;
            };
        }
    }
}
var TimerPlaybackStates;
(function (TimerPlaybackStates) {
    TimerPlaybackStates[TimerPlaybackStates["PLAY"] = 0] = "PLAY";
    TimerPlaybackStates[TimerPlaybackStates["PAUSE"] = 1] = "PAUSE";
    TimerPlaybackStates[TimerPlaybackStates["STOPPED"] = 2] = "STOPPED";
})(TimerPlaybackStates || (TimerPlaybackStates = {}));
class IntervalTimer {
    constructor(maxTime, cb, vars = {}) {
        this._callback = () => { };
        this.vars = {};
        this._maxTime = 0;
        this._tick = 0;
        this._playbackState = TimerPlaybackStates.STOPPED;
        this._callback = cb;
        this.vars = vars;
        this._maxTime = maxTime;
        this._tick = this._maxTime;
    }
    get maxTime() { return this._maxTime; }
    set maxTime(value) {
        this._maxTime = value;
        this._tick = this._maxTime;
    }
    get tick() { return this._tick; }
    set tick(value) { this._tick = Math.max(Math.min(value, this._maxTime), 0); }
    get ticksElapsed() { return this._maxTime - this._tick; }
    get playbackState() {
        return this._playbackState;
    }
    callback(cb, objs = undefined) {
        this._callback = cb;
        if (objs)
            this.vars = objs;
    }
    start(cb_fromStop = () => { }, cb_fromPause = () => { }) {
        if (this._playbackState == TimerPlaybackStates.PLAY)
            return;
        if (this._playbackState == TimerPlaybackStates.STOPPED) {
            if (cb_fromStop)
                cb_fromStop(this);
            this._tick = this._maxTime;
        }
        else {
            if (cb_fromPause)
                cb_fromPause(this);
        }
        this._playbackState = TimerPlaybackStates.PLAY;
    }
    pause(cb = () => { }) {
        if (this._playbackState == TimerPlaybackStates.STOPPED || this._playbackState == TimerPlaybackStates.PAUSE)
            return;
        if (cb)
            cb(this);
        this._playbackState = TimerPlaybackStates.PAUSE;
    }
    stop(cb = () => { }) {
        if (this._playbackState == TimerPlaybackStates.STOPPED)
            return;
        if (cb)
            cb(this);
        this._tick = this._maxTime;
        this._playbackState = TimerPlaybackStates.STOPPED;
    }
    update() {
        switch (this._playbackState) {
            case TimerPlaybackStates.STOPPED:
                this._tick = this._maxTime;
                return;
            case TimerPlaybackStates.PAUSE:
                return;
            default:
                break;
        }
        if (this._tick > 0)
            this._tick--;
        else {
            this._callback(this, this.vars);
            this._tick = this._maxTime;
        }
    }
}
const _bocchiFaces = {
    normal: p5.Image.prototype,
    shock: p5.Image.prototype,
    xi: p5.Image.prototype
};
var fnt;
var current_bocchi_face;
var hitbox;
var game;
var gameOver = false;
const difficultyDictionary = {
    "0": [60, 1],
    "50": [50, 2],
    "100": [40, 4],
    "150": [30, 8],
    "200": [20, 12],
    "250": [10, 14]
};
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function preload() {
    _bocchiFaces.normal = loadImage('assets/bocchi.png');
    _bocchiFaces.shock = loadImage('assets/bocchi_Dx.png');
    _bocchiFaces.xi = loadImage('assets/bocchi_x.png');
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    hitbox = new Rect({ x: 180, y: 220, w: 230, h: 210 })
        .fillColor(null)
        .outlineColor(null)
        .mouseHover((self) => {
        if (self.isPressed)
            return;
        current_bocchi_face = _bocchiFaces.xi;
    })
        .mouseHoverRelease((self) => {
        if (self.isPressed)
            return;
        current_bocchi_face = _bocchiFaces.normal;
    })
        .mouseDown((self) => {
        current_bocchi_face = _bocchiFaces.shock;
        if (game.timer.playbackState == TimerPlaybackStates.STOPPED && !gameOver)
            game.start();
        else if (game.timer.playbackState == TimerPlaybackStates.PLAY) {
            game.timer.tick = game.timer.maxTime;
            game.score++;
        }
    })
        .mouseUp((self) => {
        if (Rect.CollidePointRect({ x: mouseX, y: mouseY }, self.toRectCon()))
            current_bocchi_face = _bocchiFaces.xi;
        else
            current_bocchi_face = _bocchiFaces.normal;
    });
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
    for (let [k, v] of Object.entries(difficultyDictionary)) {
        if (game.highScore >= parseInt(k)) {
            game.setDifficultyTick(v[0]);
            game.lossAmount = v[1] || 1;
        }
    }
}
//# sourceMappingURL=build.js.map