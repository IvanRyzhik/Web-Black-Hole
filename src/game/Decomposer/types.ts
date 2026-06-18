export type ElementKind = 'empty' | 'button' | 'text' | 'image' | 'unknown';

export type ShapeKind = 'cube' | 'pyramid' | 'layer';

export interface SpawnedElement {
  id: string;
  kind: ElementKind;
  shape: ShapeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  mass: number;
}

export interface DecomposeResult {
  elements: SpawnedElement[];
  totalElements: number;
}
