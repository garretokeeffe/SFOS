import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.css'],
})
export class DividerComponent implements OnInit {

  @Input() public fullWidth: boolean = false;

  constructor() { }

  public ngOnInit(): void {

  }

}
