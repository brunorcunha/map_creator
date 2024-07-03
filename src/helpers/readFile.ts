import { ByteBuffer } from '@/helpers/bytebuffer';
import { FormatCil } from '@/helpers/formatCil';
import { FormatMap } from '@/helpers/formatMap';

export class ReadFile {
  private constructor() {}

  private static readBytes(file: File): Promise<ByteBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target || !(e.target.result instanceof ArrayBuffer)) return reject();
        resolve(new ByteBuffer(e.target.result));
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static async readCil(file: File) {
    const stream = await this.readBytes(file);
    return FormatCil.read(stream);
  }

  static async readMap(file: File) {
    const stream = await this.readBytes(file);
    return FormatMap.read(stream);
  }
}
