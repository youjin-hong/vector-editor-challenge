import type { Coordinate } from '@/entities/shape';
import type { Command } from '@/shared/types';

export class MoveShapeCommand implements Command {
  readonly description = 'Move Shape';

  constructor(
    private readonly shapeId: string,
    private readonly fromPosition: Coordinate | Coordinate[],
    private readonly toPosition: Coordinate | Coordinate[],
    private readonly updateShapePosition: (id: string, position: Coordinate | Coordinate[]) => void,
  ) {}

  execute(): void {
    this.updateShapePosition(this.shapeId, this.toPosition);
  }

  undo(): void {
    this.updateShapePosition(this.shapeId, this.fromPosition);
  }
}
