import type { Shape } from '@/entities/shape';
import type { Command } from '@/shared/types';

export class DeleteShapeCommand implements Command {
  readonly description = 'Delete Shape';

  constructor(
    private readonly shape: Shape,
    private readonly addShape: (shape: Shape) => void,
    private readonly removeShape: (id: string) => void,
  ) {}

  execute(): void {
    this.removeShape(this.shape.id);
  }

  undo(): void {
    this.addShape(this.shape);
  }
}
