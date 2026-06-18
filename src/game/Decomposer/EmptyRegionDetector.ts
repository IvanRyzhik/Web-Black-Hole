export interface RegionSample {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
}

export interface EmptyRegionOptions {
  whiteThreshold?: number;
  minCoverage?: number;
}

export function isEmptyRegion(
  sample: RegionSample,
  options: EmptyRegionOptions = {},
): boolean {
  const whiteThreshold = options.whiteThreshold ?? 245;
  const minCoverage = options.minCoverage ?? 0.95;

  if (sample.width <= 0 || sample.height <= 0 || sample.pixels.length === 0) {
    return true;
  }

  let emptyPixels = 0;
  const pixelCount = sample.pixels.length / 4;

  for (let index = 0; index < sample.pixels.length; index += 4) {
    const red = sample.pixels[index] ?? 255;
    const green = sample.pixels[index + 1] ?? 255;
    const blue = sample.pixels[index + 2] ?? 255;
    const alpha = sample.pixels[index + 3] ?? 255;

    const isTransparent = alpha < 16;
    const isWhite =
      red >= whiteThreshold && green >= whiteThreshold && blue >= whiteThreshold;

    if (isTransparent || isWhite) {
      emptyPixels += 1;
    }
  }

  return emptyPixels / pixelCount >= minCoverage;
}

export function sampleElementRegion(element: HTMLElement): RegionSample | null {
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const style = getComputedStyle(element);
  context.fillStyle = style.backgroundColor || '#ffffff';
  context.fillRect(0, 0, width, height);

  return {
    width,
    height,
    pixels: context.getImageData(0, 0, width, height).data,
  };
}
