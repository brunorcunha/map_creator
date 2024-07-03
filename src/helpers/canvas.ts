import { AppLayer } from '@/store/types';
import { off } from 'process';

export class CanvasWebGL {
  private static canvas: HTMLCanvasElement;
  private static context: CanvasRenderingContext2D | null;

  private constructor() {}

  private static createTempCanvas(width: number, height: number) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    return { canvas, context };
  }

  static init(div: HTMLDivElement) {
    this.canvas = document.createElement('canvas');
    div.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
  }

  static drawTilemap(pixels: any[]): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const { canvas, context } = this.createTempCanvas(640, 4325);
      if (!context) {
        reject('Canvas context not found');
        return;
      }

      const imageData = context.createImageData(640, 4325);

      for (const pixel of pixels) {
        const [r, g, b] = pixel.rgb;
        const index = (pixel.y * 640 + pixel.x) * 4;

        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      }

      context.putImageData(imageData, 0, 0);

      const image = new Image();
      image.src = canvas.toDataURL();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (error) => {
        reject(error);
      };
    });
  }

  private static drawTile(
    context: CanvasRenderingContext2D,
    tilemap: HTMLImageElement,
    tile: number[],
    dx: number,
    dy: number,
    layers: AppLayer[],
    astar: any[]
  ) {
    const [sx, sy, rid] = tile;
    context.fillStyle = '#000000';
    context.drawImage(tilemap, sx, sy, 32, 32, dx, dy, 32, 32);

    if (rid && layers.includes(AppLayer.ASTAR)) {
      const astarValue = astar[rid + 1];
      if (astarValue !== 0) {
        if (astarValue !== 2) context.fillStyle = `rgba(255, 0, 0, 0.3)`;
        if (astarValue !== 1) context.fillStyle = `rgba(255, 255, 0, 0.3)`;
        context.fillRect(dx, dy, 32, 32);
      }
    }
  }

  static drawMap(tiles: any[], tilemap: HTMLImageElement, layers: AppLayer[], astar: any[]): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const { canvas, context } = this.createTempCanvas(4096, 4096);
      if (!context) {
        reject('Canvas context not found');
        return;
      }

      for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 128; y++) {
          const dx = x * 32;
          const dy = y * 32;

          const tile1 = tiles[x][y][0];
          const tile2 = tiles[x][y][1];

          if (tile1 && layers.includes(AppLayer.LAYER1)) {
            this.drawTile(context, tilemap, tile1, dx, dy, layers, astar);
          }
          if (tile2 && layers.includes(AppLayer.LAYER2)) {
            this.drawTile(context, tilemap, tile2, dx, dy, layers, astar);
          }
        }
      }

      const image = new Image();
      image.src = canvas.toDataURL();
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (error) => {
        reject(error);
      };
    });
  }

  private static drawDashedTile(mouse: number[], offset: number[]) {
    if (!this.context) {
      throw new Error('Canvas context not found');
    }

    const cols = Math.ceil(this.canvas.width / 32);
    const rows = Math.ceil(this.canvas.height / 32);
    const gradient = this.context.createRadialGradient(mouse[0], mouse[1], 0, mouse[0], mouse[1], 150);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, .2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * 32 + offset[0];
        const y = j * 32 + offset[1];
        if (x >= offset[0] && x + 32 <= offset[0] + 4096 && y >= offset[1] && y + 32 <= offset[1] + 4096) {
          if (Math.hypot(mouse[0] - (x + 16), mouse[1] - (y + 16)) < 150) {
            this.context.save();
            this.context.setLineDash([5, 5]);
            this.context.strokeStyle = gradient;
            this.context.strokeRect(x, y, 32, 32);
            this.context.restore();
          }
        }
      }
    }
  }

  static drawImage(image: HTMLImageElement, pos: number[], mouse?: number[]) {
    if (!this.context) {
      throw new Error('Canvas context not found');
    }

    // Ajusta o tamanho do canvas para o tamanho da viewport
    this.canvas.width = window.innerWidth - 334;
    this.canvas.height = window.innerHeight - 172;
    // Limpa o canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Desenha a imagem
    this.context.drawImage(image, -pos[0], -pos[1]);

    // Se o mouse estiver sobre o canvas, desenha um retângulo tracejado
    if (mouse) {
      this.drawDashedTile(mouse, [-pos[0] % 32, -pos[1] % 32]);
    }
  }
}
