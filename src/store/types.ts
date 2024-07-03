export enum AppAction {
  EDIT,
  ERASE
}

export enum AppLayer {
  LAYER1,
  LAYER2,
  ASTAR
}

export interface OpenedMap {
  name: string;
  content: { width: number; height: number; tiles: (number[] | null)[][][] };
  image: HTMLImageElement | null;
  currentLayers: string;
  currentTilemap: number | null;
}
export interface OpenedTilemap {
  name: string;
  content: { pixels: any[]; astar: any[] };
  image: HTMLImageElement | null;
}

export interface AppState {
  currentAction: AppAction;
  currentLayers: AppLayer[];

  files: OpenedMap[];
  currentFile: number | null;

  tilemaps: OpenedTilemap[];
  currentTilemap: number | null;

  loading: boolean;

  pos: number[];

  zoom: number;
  gridInfo: string;
  tileInfo: string;
}
