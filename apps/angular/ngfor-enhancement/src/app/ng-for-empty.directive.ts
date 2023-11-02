import { NgFor } from '@angular/common';
import {
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngFor]',
  standalone: true,
  hostDirectives: [{ directive: NgFor, inputs: ['ngForOf', 'ngForTrackBy'] }],
})
export class NgForEmptyDirective<T> {
  private readonly containerRef = inject(ViewContainerRef);
  private readonly items = signal([] as T[]);
  private readonly emptyTemplateRef = signal<TemplateRef<unknown> | null>(null);
  private readonly shouldDisplayEmptyTemplate = computed(
    () => this.items().length === 0 && this.emptyTemplateRef()
  );

  private emptyViewRef?: EmbeddedViewRef<unknown>;

  @Input() set ngForOf(value: T[]) {
    this.items.set(value);
  }

  @Input() set ngForIfEmpty(ref: TemplateRef<unknown>) {
    this.emptyTemplateRef.set(ref);
  }

  constructor() {
    effect(() => {
      this.emptyViewRef?.destroy();

      if (this.shouldDisplayEmptyTemplate()) {
        this.emptyViewRef = this.containerRef.createEmbeddedView(
          this.emptyTemplateRef()!
        );
      }
    });
  }
}
