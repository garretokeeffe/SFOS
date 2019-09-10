import { Component, EventEmitter, HostListener, OnInit } from '@angular/core';
import { EmitterService } from './services/emitter.service';

import { environment } from '../environments/environment';
import { Globals } from './globals';
import { AuthenticationService } from './services/authentication.service';
import { Emitters } from './types/emitters';
import { Router } from '@angular/router';

declare const require: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public title: string = 'Seafood Online Services';
  public shortTitle: string = 'SFOS';
  public environment: any = environment;
  public environmentName: string = environment.name;
  public isAuthenticated: boolean = false;
  private isAuthenticatedEmitter: EventEmitter<any> = EmitterService.get(Emitters[Emitters.AUTHENTICATED]);

  public deferredPrompt: any;
  public showA2HSButton: boolean = false;

  public login: boolean = false; // TODO remove this

  @HostListener('window:beforeinstallprompt', ['$event'])

  public onbeforeinstallprompt(e: any): void {
    console.log('INTERCEPTED beforeinstallprompt in app component');
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showA2HSButton = true;
  }
  public addToHomeScreen(): void {
    // hide our userprofile interface that shows our A2HS button
    this.showA2HSButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the userprofile to respond to the prompt
    this.deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      this.deferredPrompt = null;
    });
  }

  constructor(public globals: Globals,
              public authenticationService: AuthenticationService,
              private router: Router) {
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    globals.demo = urlParams.has('demo') ? urlParams.get('demo').toLowerCase() === 'false' ? false : true : globals.demo;
    globals.demoSkipLoginScreen = urlParams.has('skiplogin') && urlParams.get('skiplogin').toLowerCase() !== 'false' && globals.demo ? true : globals.demoSkipLoginScreen;
    globals.prototype = urlParams.has('prototype') ? urlParams.get('prototype').toLowerCase() === 'false' ? false : true : globals.prototype;

    if (globals.demo) {
      console.log('Running in DEMO mode');
    } else {
      console.log('Running in ' + this.environmentName + ' mode');
    }

    if (globals.prototype) {
      console.log('PROTOTYPE features are enabled');
    } else {
      console.log('PROTOTYPE features are disabled');
    }

    this.isAuthenticated = false; // globals.demoSkipLoginScreen ? true : false;
  }

  public ngOnInit(): void {
    this.isAuthenticatedEmitter.subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;
    });
  }

}
