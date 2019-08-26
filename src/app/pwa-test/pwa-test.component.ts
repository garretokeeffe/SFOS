import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Item } from './api.service';

@Component({
  selector: 'app-pwa-test',
  templateUrl: './pwa-test.component.html',
  styleUrls: ['./pwa-test.component.css']
})
export class PwaTestComponent implements OnInit {

  items:  Array<Item>;
  constructor(private apiService: ApiService) {
  }
  ngOnInit() {
    this.fetchData();
  }
  fetchData() {
    this.apiService.fetch().subscribe((data:  Array<Item>) => {
      console.log(data);
      this.items  =  data;
    }, (err) => {
      console.log(err);
    });
  }

}
