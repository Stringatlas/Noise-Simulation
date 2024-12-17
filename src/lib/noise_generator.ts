
export function gaussianNoise(mean: number, std: number): number {
    let u1 = Math.random();
    let u2 = Math.random();
    let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * std + mean;
}

export function uniformNoise(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function* IMUNoiseGenerator(initialValue: number, noiseStdDev: number, randomWalkStdDev: number, bias: number = 0): Generator<number, never, number> {
    let trueValue = initialValue;
    let randomWalkComponent = 0;

    while (true) {
        let noise: number = gaussianNoise(0, noiseStdDev);
        randomWalkComponent += gaussianNoise(0, randomWalkStdDev);

        let noisyValue = trueValue + randomWalkComponent + noise;
        console.log("Random walk", randomWalkComponent)
        trueValue = yield noisyValue
        if (trueValue == undefined) trueValue = initialValue;
    }
}

export function* randomNoiseGenerator(): Generator<number, never, unknown> {
    while (true) {
        yield uniformNoise(-1, 1);
    }
}

