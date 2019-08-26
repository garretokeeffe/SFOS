import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {SidenavService} from '../../services/sidenav.service';
import {animations} from '../../animations';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css'],
  animations: animations
})
export class RedirectComponent implements OnInit {

  private url: string;

  public width: number;
  public height: number;
  public trusted_src: SafeResourceUrl;

  public isSidenavOpen: boolean = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  // detect window resize events
  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    this.resizeContainer();
  }

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private elRef: ElementRef,
              public breakpointObserver: BreakpointObserver,
              private sidenav: SidenavService) {
    this.onResize(null);
    // this.trusted_src = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.url = paramMap['params']['url'];
      this.trusted_src = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    });

    this.sidenav.isOpen().subscribe((isOpen: boolean) => {
      console.log('sidenav new open status: ' + isOpen);
      this.isSidenavOpen = isOpen;
      this.resizeContainer();
    },
    (error) => {}
    );
  }

  public resizeContainer(): void {
    this.width = this.isSidenavOpen ? window.innerWidth - 8 - 200 : window.innerWidth - 8;
    this.height = window.innerHeight - 16 - 64; // 64 is height of toolbar, 16 is padding
    console.log('width: ' + this.width + '  height: ' + this.height);
  }

}
