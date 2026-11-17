/**
 * Short spec line of a card: "i7-13650HX · 16GB · 1TB SSD · RTX 4060".
 * Drops the vendor ("Intel", "AMD", "Apple", "NVIDIA GeForce") and "Core" before i3/i5/i7/i9.
 */
export function specsLine({ cpu, ram, storage, gpu }) {
  const shortCpu = cpu.replace(/^(Intel|AMD|Apple)\s+/, '').replace(/^Core\s+(i\d-)/, '$1');
  const shortGpu = gpu.replace(/^NVIDIA GeForce\s+/, '').replace(/^AMD\s+/, '');
  const disk = storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`;
  return [shortCpu, `${ram}GB`, `${disk} SSD`, shortGpu].join(' · ');
}
