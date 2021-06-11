export class BuyCarError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, BuyCarError.prototype);
    }
}