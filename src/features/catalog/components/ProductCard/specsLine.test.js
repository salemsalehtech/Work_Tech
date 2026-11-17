import { specsLine } from './specsLine';

it.each([
  [
    { cpu: 'Intel Core i7-13650HX', ram: 16, storage: 1024, gpu: 'NVIDIA GeForce RTX 4060' },
    'i7-13650HX · 16GB · 1TB SSD · RTX 4060',
  ],
  [
    { cpu: 'Intel Core 5 210H', ram: 16, storage: 512, gpu: 'NVIDIA GeForce RTX 3050' },
    'Core 5 210H · 16GB · 512GB SSD · RTX 3050',
  ],
  [
    { cpu: 'AMD Ryzen 7 7445HS', ram: 16, storage: 512, gpu: 'AMD Radeon 780M' },
    'Ryzen 7 7445HS · 16GB · 512GB SSD · Radeon 780M',
  ],
  [
    { cpu: 'Apple M5 10-core', ram: 16, storage: 2048, gpu: 'Apple M5 10-core GPU' },
    'M5 10-core · 16GB · 2TB SSD · Apple M5 10-core GPU',
  ],
])('shortens %o', (specs, expected) => {
  expect(specsLine(specs)).toBe(expected);
});
