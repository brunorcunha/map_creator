export class ByteBuffer {
  private view: DataView;
  private offset: number;

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
    this.offset = 0;
  }

  writeInt8(value: number) {
    this.view.setInt8(this.offset, value);
    this.offset += 1;
    return this;
  }

  writeInt16(value: number) {
    this.view.setInt16(this.offset, value, true); // little-endian
    this.offset += 2;
    return this;
  }

  writeInt32(value: number) {
    this.view.setInt32(this.offset, value, true); // little-endian
    this.offset += 4;
    return this;
  }

  writeFloat32(value: number) {
    this.view.setFloat32(this.offset, value, true); // little-endian
    this.offset += 4;
    return this;
  }

  writeFloat64(value: number) {
    this.view.setFloat64(this.offset, value, true); // little-endian
    this.offset += 8;
    return this;
  }

  readInt8() {
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }

  readUint8() {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }

  readInt16() {
    const value = this.view.getInt16(this.offset, true); // little-endian
    this.offset += 2;
    return value;
  }

  readUint16() {
    const value = this.view.getUint16(this.offset, true); // little-endian
    this.offset += 2;
    return value;
  }

  readInt32() {
    const value = this.view.getInt32(this.offset, true); // little-endian
    this.offset += 4;
    return value;
  }

  readUint32() {
    const value = this.view.getUint32(this.offset, true); // little-endian
    this.offset += 4;
    return value;
  }

  readFloat32() {
    const value = this.view.getFloat32(this.offset, true); // little-endian
    this.offset += 4;
    return value;
  }

  readFloat64() {
    const value = this.view.getFloat64(this.offset, true); // little-endian
    this.offset += 8;
    return value;
  }

  seek(offset: number) {
    this.offset = offset;
    return this;
  }

  remaining() {
    return this.view.byteLength - this.offset;
  }

  clear() {
    this.offset = 0;
    return this;
  }
}
