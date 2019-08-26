import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-vessels',
  templateUrl: './vessels.component.html',
  styleUrls: ['./vessels.component.css']
})
export class VesselsComponent implements OnInit {

  title$: Observable<object>;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));
  }

}
