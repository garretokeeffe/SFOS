import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[loading-text]',
})
export class LoadingText {

  private messageList: Array<string> = [
    'Loading',
    'Thank you for your patience',
    'Still loading',
    'Nearly there',
    'Thank you for your patience',
    'Still loading',
    'Thank you for your patience',
  ];
  private messageIndex: number = 0;

  constructor(private el: ElementRef) {

    console.log('invoking loading-text directive');

    const nativeElement: HTMLElement = this.el.nativeElement;
    nativeElement.innerText = this.messageList[this.messageIndex];

    setInterval((_) => {
      this.messageIndex++;
      if (this.messageIndex === this.messageList.length) {
        this.messageIndex = 0;
      }
      nativeElement.innerText = this.messageList[this.messageIndex];
    },5000);
  }

}
