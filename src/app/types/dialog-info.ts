import {NVP} from './nvp';

export class PopupInfo {
  public title: string = '';
  public data: Array<NVP> = [];
  public icons: boolean = false;

  constructor (title: string = '', data: Array<NVP> = [], icons: boolean = false) {
    this.title = title;
    this.data = data;
    this.icons = icons;
  }
}

export class ConfirmationInfo {
  public title: string = '';
  public text: string = '';
  public prompt: string = 'Are you sure?';
  public yesButtonText: string = 'Yes';
  public noButtonText: string = 'No';

  constructor (title: string = '', text: string = '', prompt: string = 'Are you sure?', yesButtonText: string = 'Yes', noButtonText: string = 'No') {
    this.title = title;
    this.text = text;
    this.prompt = prompt;
    this.yesButtonText = yesButtonText;
    this.noButtonText = noButtonText;
  }
}


