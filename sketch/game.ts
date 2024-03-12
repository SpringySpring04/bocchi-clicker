
class Game {

    private _score: number;
    private _highScore: number;

    public get highScore(): number { return this._highScore; }

    public timer: IntervalTimer;
    public lossAmount: number = 1;

    private display: (self: this)=>string;

    public setDifficultyTick(t: number) {
        let tick = this.timer.tick;
        this.timer.maxTime = t;
        this.timer.tick = tick;
    }

    constructor(difficulty: number = 60) {
        let buffer = [0x00];
        this._highScore = 1;
        this._score = 1;
        this.timer = new IntervalTimer(difficulty, this.update, {game : this});
        this.lossAmount = 1;
        this.display = (self: this) => {
            return "Click on bocchi to start the game";
        }
    }

    public start() {
        this.timer.start();
        this.display = (self: this) => { 
            return `Score: ${self.score}\nHigh score: ${self._highScore}\nTimer: ${self.timer.tick}`;
        };
    }

    public get score(): number {
        let n = this._score;
        return n;
    }

    public set score(value: number) {
        this._score = value;
        if (value > this._highScore)
        this._highScore = this._score;
    }

    public render() {
        push();
            noStroke();
            fill('white');
            textSize(16);
            text(this.display(this), 30, 40);
        pop();
        this.timer.update();
    }

    public update(timer: IntervalTimer, vars: any) {
        vars.game.score -= vars.game.lossAmount;
        if (vars.game.score < 0) {
            gameOver = true;
            vars.game.timer.stop();
            console.log(`Game over!\nFinal high score: ${vars.game._highScore}`);
            vars.game.display = (self: this) => {
                return `Game over!\nFinal high score: ${self._highScore}`;
            }
        }
    }

}