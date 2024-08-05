import {Directive, ElementRef, EventEmitter, inject, Input, OnChanges, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appLineClamp]',
  standalone: true
})
export class LineClampDirective implements OnChanges {
  @Input() appLineClamp: number | null = 3;
  @Output() contentClamped = new EventEmitter<boolean>();

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnChanges() {
    if (this.appLineClamp !== null) {
      this.renderer.setStyle(this.el.nativeElement, 'display', '-webkit-box');
      this.renderer.setStyle(this.el.nativeElement, '-webkit-line-clamp', this.appLineClamp);
      this.renderer.setStyle(this.el.nativeElement, '-webkit-box-orient', 'vertical');
      this.renderer.setStyle(this.el.nativeElement, 'overflow', 'hidden');

      setTimeout(() => {
        const isClamped = this.el.nativeElement.scrollHeight > this.el.nativeElement.clientHeight;
        this.contentClamped.emit(isClamped);
      }, 0);
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'display');
      this.renderer.removeStyle(this.el.nativeElement, '-webkit-line-clamp');
      this.renderer.removeStyle(this.el.nativeElement, '-webkit-box-orient');
      this.renderer.removeStyle(this.el.nativeElement, 'overflow');
      this.contentClamped.emit(false);
    }
  }
}
