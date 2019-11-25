import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-bottomsheet-close-icon',
  templateUrl: './bottomsheet-close-icon.component.html',
  styleUrls: ['./bottomsheet-close-icon.component.css'],
})
export class BottomsheetCloseIconComponent implements OnInit {

  constructor(public bottomSheetRef: MatBottomSheetRef) { }

  public ngOnInit() {
  }

}
