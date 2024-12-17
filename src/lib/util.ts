import type { StatefulGenerator } from "./StatefulGenerator";
import type { HexColor } from "./types";

export function generateRandomHexColor(): HexColor {
  const getRandomComponent = () => Math.floor(Math.random() * 256);

  const red = getRandomComponent().toString(16).padStart(2, '0');
  const green = getRandomComponent().toString(16).padStart(2, '0');
  const blue = getRandomComponent().toString(16).padStart(2, '0');

  return `#${red}${green}${blue}`;
}

export function fnv1aHash(seed: string): number {
  let hash = 2166136261; // FNV-1a offset basis
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i); // XOR the current character's ASCII value
    hash *= 16777619; // Multiply by FNV-1a prime
    hash = hash >>> 0; // Ensure it wraps around to 32-bit unsigned integer
  }
  return hash;
}

// export function lowPassFilter(initialValue: number, k: number): (newValue: number) => number {
//     let lastValue = initialValue;

//     return function(newValue: number) {
//         return newValue * k + lastValue * (1 - k);
//     }
// }
export function* lowPassGenerator(initialValue: number, k: number, generator: Generator<number, never, number>): Generator<number, never, number> {
    let lastOutput: number = initialValue;

    while (true) {
        let input: number = generator.next().value;
        
        // weighted average between new input and last output, attenuates quick changes
        let output: number = input * k + lastOutput * (1 - k);

        yield output;
        lastOutput = output;
    }
}

export function* highPassGenerator(initialValue: number, k: number, generator: Generator<number, never, number>): Generator<number, never, number> {
    let lastOutput: number = initialValue;
    let lastInput = initialValue;

    while (true) {
        let input: number = generator.next().value;
        
        // changes decay over time from k --> attenuates low frequency noise
        let output: number = k * (lastOutput + input - lastInput);
        
        lastInput = input;
        lastOutput = output;
        yield output;
    }
}

export function* lowPassFilter(initialValue: number, k: number, generator: StatefulGenerator): Generator<number, never, number> {
    let lastOutput: number = initialValue;

    while (true) {
        let input: number = generator.getLastValue();
        
        // weighted average between new input and last output, attenuates quick changes
        let output: number = input * k + lastOutput * (1 - k);

        yield output;
        lastOutput = output;
    }
}

export function* highPassFilter(initialValue: number, k: number, generator:StatefulGenerator): Generator<number, never, number> {
    let lastOutput: number = initialValue;
    let lastInput = initialValue;

    while (true) {
        let input: number = generator.getLastValue();
        
        // changes decay over time from k --> attenuates low frequency noise
        let output: number = k * (lastOutput + input - lastInput);
        
        lastInput = input;
        lastOutput = output;
        yield output;
    }
}

export function createHashedPRNG(seed: string): () => number {
  let state = fnv1aHash(seed);

  return function next(): number {
    // Linear Congruential Generator (LCG) method for generating random numbers
    state = (state * 1664525 + 1013904223) % (2 ** 32);
    return state / (2 ** 32); // Normalize to [0, 1)
  };
}

export function cyrb128(seed: string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < seed.length; i++) {
        k = seed.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }

    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}


export let getDeltaTime: () => Generator<number, never, unknown> = function* () {
    let lastTime = performance.now();
    while (true) {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        yield deltaTime;
    }
};

export let getFPS: () => Generator<number, never, unknown> = function* () {
    let lastTime = performance.now();

    while (true) {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        yield deltaTime > 0 ? 1000 / deltaTime : 100;
    }
};