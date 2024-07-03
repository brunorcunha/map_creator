import type { ByteBuffer } from '@/helpers/bytebuffer';

export class FormatCil {
  private constructor() {}

  private static shortToRGB565(shortValue: number) {
    let r = (shortValue >> 11) & 0x1f;
    let g = (shortValue >> 5) & 0x3f;
    let b = shortValue & 0x1f;

    r = (r << 3) | (r >> 2);
    g = (g << 2) | (g >> 4);
    b = (b << 3) | (b >> 2);

    return [r, g, b];
  }

  private static drawCil(
    header: number[][],
    astar: number[],
    ids: number[]
  ): { pixels: { x: number; y: number; rgb: number[] }[]; astar: number[] } {
    // const mapSize = 640;

    const pixels = [];
    for (let i = 0; i < ids.length; i++) {
      const x = i % 640;
      const y = Math.floor(i / 640);

      const indexedColor = ids[i];
      if (indexedColor === 0) continue;

      pixels.push({ x, y, rgb: header[indexedColor] });
    }

    return { pixels, astar };
  }

  static read(stream: ByteBuffer) {
    const header: number[][] = [];
    for (let i = 0; i < 256; i++) {
      header.push(this.shortToRGB565(stream.readUint16()));
    }

    const ids: number[] = [];
    do {
      ids.push(stream.readUint8());
    } while (stream.remaining() > 2701);

    const astar: number[] = [];
    do {
      astar.push(stream.readUint8());
    } while (stream.remaining() > 1);

    return this.drawCil(header, astar, ids);
  }
}
