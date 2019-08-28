import {Component, Input, OnInit} from '@angular/core';
import {UserView} from '../../types/user';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-client-selector',
  templateUrl: './client-selector.component.html',
  styleUrls: ['./client-selector.component.css']
})
export class ClientSelectorComponent implements OnInit {

  @Input() inline: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  public client: UserView = new UserView();

  constructor(public breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.client.firstName = 'Peter';
    this.client.lastName = 'Mahoney';
  }

  public selectClient(): void {

  }

}
