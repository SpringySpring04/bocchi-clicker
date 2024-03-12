class Game {

    private _score: Uint8Array;
    private _overflows: number = 0;
    public scoreView: DataView;

    constructor() {
        let buffer = [0x00];
        this._score = new Uint8Array(buffer);
        this.scoreView = new DataView(this._score.buffer);
    }

    public get score(): number {
        return this.scoreView.getUint8(0);
    }

    public set score(value: number) {
        if (value > 0xFF) value = value % 0xFF;
        this._overflows += Math.round(value / 0xFF);
        this.scoreView.setUint8(0, value);
    }

    public get overflows(): number {
        return this._overflows;
    }

}