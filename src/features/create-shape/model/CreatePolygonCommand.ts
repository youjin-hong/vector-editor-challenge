import type { PolygonShape } from '@/entities/shape';
import type { Command } from '@/shared/types';

export class CreatePolygonCommand implements Command {
  readonly description = 'Create Polygon';

  constructor(
    private readonly shape: PolygonShape,
    private readonly addShape: (shape: PolygonShape) => void,
    private readonly removeShape: (id: string) => void,
  ) {}

  execute(): void {
    this.addShape(this.shape);
  }

  undo(): void {
    this.removeShape(this.shape.id);
  }
}
