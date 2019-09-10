import { Component, Input, OnInit } from '@angular/core';
import { CapacityView } from '../../../types/capacity';
import { animation } from '@angular/animations';
import { animations } from '../../../animations';

@Component({
  selector: 'app-track-record',
  templateUrl: './track-record.component.html',
  styleUrls: ['./track-record.component.css'],
  animations: animations,
})
export class TrackRecordComponent implements OnInit {

  @Input() public capacity: CapacityView = null;

  constructor() { }

  public ngOnInit(): void {
  }

}
