var Rect = (function () {
    function Rect(_a) {
        var x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        this._mouseIsPressed = false;
        this._mouseWasPressed = false;
        this._mouseIsInside = false;
        this._mouseWasInside = false;
        this._mouseHover = function () { };
        this._mouseHoverRelease = function () { };
        this._mousePressed = function () { };
        this._mouseDown = function () { };
        this._mouseUp = function () { };
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.outline_color = null;
        this.fill_color = 'green';
    }
    Rect.CollidePointRect = function (pt, rect) {
        return (pt.x >= rect.x &&
            pt.y >= rect.y &&
            pt.x <= rect.x + rect.w &&
            pt.y <= rect.y + rect.h);
    };
    Rect.CollideRects = function (r1, r2) {
        return (r1.x + r1.w >= r2.x &&
            r1.x <= r2.x + r2.w &&
            r1.y + r1.h >= r2.y &&
            r1.y <= r2.y + r2.h);
    };
    Object.defineProperty(Rect.prototype, "isPressed", {
        get: function () { return this._mouseIsPressed; },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.toRectCon = function () {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
    };
    Rect.prototype.render = function () {
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
    };
    Rect.prototype.update = function () {
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
    };
    Rect.prototype._lateUpdate = function () {
        this._mouseWasInside = this._mouseIsInside;
        this._mouseWasPressed = this._mouseIsPressed;
    };
    Rect.prototype.mouseHover = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (typeof callback != 'function')
            this._mouseHover = function () { };
        else
            this._mouseHover = callback;
        return this;
    };
    Rect.prototype.mouseHoverRelease = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (typeof callback != 'function')
            this._mouseHoverRelease = function () { };
        else
            this._mouseHoverRelease = callback;
        return this;
    };
    Rect.prototype.mousePressed = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (typeof callback != 'function')
            this._mousePressed = function () { };
        else
            this._mousePressed = callback;
        return this;
    };
    Rect.prototype.mouseDown = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (typeof callback != 'function')
            this._mouseDown = function () { };
        else
            this._mouseDown = callback;
        return this;
    };
    Rect.prototype.mouseUp = function (callback) {
        if (callback === void 0) { callback = function () { }; }
        if (typeof callback != 'function')
            this._mouseUp = function () { };
        else
            this._mouseUp = callback;
        return this;
    };
    Rect.prototype.fillColor = function (value) {
        this.fill_color = value;
        return this;
    };
    Rect.prototype.outlineColor = function (value) {
        this.outline_color = value;
        return this;
    };
    return Rect;
}());
var _bocchiFaces = {
    normal: p5.Image.prototype,
    shock: p5.Image.prototype,
    xi: p5.Image.prototype
};
var hitbox;
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
    hitbox = new Rect({ x: 50, y: 50, w: 50, h: 50 })
        .fillColor('#00aa00')
        .outlineColor(null)
        .mouseHover(function (self) {
        self.fill_color = '#00ff00';
    })
        .mouseHoverRelease(function (self) {
        self.fill_color = '#00aa00';
    })
        .mouseDown(function (self) {
        console.log("hitbox clicked!");
    })
        .mouseUp(function (self) {
        console.log("hitbox release!");
    });
}
function draw() {
    background(0);
    image(_bocchiFaces.normal, 20, 20);
    hitbox.render();
}
//# sourceMappingURL=build.js.map