import type { ByteBuffer } from '@/helpers/bytebuffer';

export class FormatMap {
  private constructor() {}

  private static drawTile(tileId: number) {
    const newTileId = tileId >= 10000 ? (tileId + 0xffffd8f0) & 0xffff : tileId;
    const relativeId = newTileId % 2700;

    const sx = (relativeId % 20) * 32;
    const sy = Math.floor(relativeId / 20) * 32;

    return [sx, sy, relativeId];
  }

  private static drawMap(width: number, height: number, ids: number[][]) {
    const tiles: (number[] | null)[][][] = [];
    for (let i = 0; i < ids.length; i++) {
      const dx = i % 128;
      const dy = Math.floor(i / 128);

      const [id1, id2] = ids[i];

      if (!tiles[dx]) tiles[dx] = [];
      tiles[dx][dy] = [this.drawTile(id1), id2 !== 65535 ? this.drawTile(id2) : null];
    }
    return { width, height, tiles };
  }

  static read(stream: ByteBuffer) {
    const width: number = stream.readUint8();
    const height: number = stream.readUint8();

    const ids: number[][] = [];
    do {
      const bg = stream.readUint16();
      const sp = stream.readUint16();

      ids.push([bg, sp]);
    } while (stream.remaining() > 4);

    return this.drawMap(width, height, ids);
  }
}
