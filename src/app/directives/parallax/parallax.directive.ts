import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/* istanbul ignore next */
@Directive({
  selector: '[parallax]',
})
export class ParallaxDirective {
  @Input() ratio: number = 1;
  private initialTop: number = 0

  constructor(private eleRef: ElementRef) {
    this.initialTop = this.eleRef.nativeElement.getBoundingClientRect().top;
    // console.log('this.initialTop: ' + this.initialTop);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    this.eleRef.nativeElement.style.top = (this.initialTop - (window.pageYOffset * this.ratio)) + 'px';
    // console.log('this.eleRef.nativeElement.style.top = (' + this.initialTop
    // + ' - (' + window.pageYOffset + ' * ' + this.ratio + ')) = ' + this.eleRef.nativeElement.style.top + 'px');
  }

}
