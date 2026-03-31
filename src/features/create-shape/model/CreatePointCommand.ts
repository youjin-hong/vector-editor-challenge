import type { PointShape } from '@/entities/shape';
import type { Command } from '@/shared/types';

export class CreatePointCommand implements Command {
  readonly description = 'Create Point';

  constructor(
    private readonly shape: PointShape,
    private readonly addShape: (shape: PointShape) => void,
    private readonly removeShape: (id: string) => void,
  ) {}

  execute(): void {
    this.addShape(this.shape);
  }

  undo(): void {
    this.removeShape(this.shape.id);
  }
}
