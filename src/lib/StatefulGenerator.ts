export class StatefulGenerator {
    lastValue: number;
    generator: Generator;

    constructor(generator: Generator) {
        this.generator = generator;
        this.lastValue = generator.next().value;
    }

    next(arg?: any) {
        let result = this.generator.next(arg);

        this.lastValue = result.value;
        return result;
    }

    getLastValue() {
        return this.lastValue;
    }
}