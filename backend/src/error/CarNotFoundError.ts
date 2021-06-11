export class CarNotFoundError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, CarNotFoundError.prototype);
    }
}