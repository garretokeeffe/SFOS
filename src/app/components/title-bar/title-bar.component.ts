import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { VersionService } from '../../services/version.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { animations } from '../../animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { UserView } from '../../types/user';
import { UserService } from '../../services/user.service';
import { Globals } from '../../globals';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css'],
  animations: animations,
})
export class TitleBarComponent implements OnInit {

  @Input() public authenticated: boolean = true;
  @ViewChild('Image1') public imageElement1: ElementRef;

  private imageList: Array<string> = [
    'assets/images/title-bar/fish-in-sea.jpg',
    'assets/images/title-bar/mackeral.jpg',
    'assets/images/title-bar/bunch-of-fish.jpg',
    'assets/images/title-bar/cod-school.jpg',
  ];
  // 'assets/images/title-bar/bunch-of-fish.jpg',
  // 'assets/images/title-bar/cod-school.jpg',
  private blobList: Array<any> = [];
  private imageIndex: number = 0;
  public image: string = '';
  public openImage: boolean = true;

  public version: string = environment.version; // = '';
  public user: UserView = new UserView();

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches)
  );

  constructor(public userService: UserService,
              private breakpointObserver: BreakpointObserver,
              public versionService: VersionService,
              public http: HttpClient,
              public globals: Globals) { }

  public ngOnInit(): void {
    console.log('Initialising title bar');
    this.getUserProfile();

    this.preloadImages();
    // this.getServerVersion();
  }

  public getUserProfile(): void {
    this.userService.getUserProfile().subscribe((user: UserView) => {
      this.user = user;
    });
  }

  public getServerVersion(): void {
    this.versionService.getVersion().subscribe ((version: string) => {
      console.log('SFOS Application Version: ' + version);
      this.version = version;
    });
  }

  public preloadImages(): void {
    this.imageList.forEach ((file: string) => {
      this.http.get(file, {
        headers: new HttpHeaders({
          'Content-Type': 'image/jpg'
        }),
        observe: 'body',
        responseType: 'blob'
      })
      .subscribe(
        (res: Blob) => {
          const urlCreator: any = window.URL;
          const url: string = urlCreator.createObjectURL(res);
          this.blobList.push(url);
          if (this.blobList.length === 1) {
            this.startSlideShowBlob();
          }
        },
        (error) => {
          console.log(JSON.stringify(error));
          console.log('Failed to load ' + file);
        });
    });
  }

  /* istanbul ignore next */
  public startSlideShow(): void {
    this.imageElement1.nativeElement.style['background-image'] = 'url(' + this.imageList[this.imageIndex] + ')';

    setInterval(_ => {
      this.imageIndex++;
      if (this.imageIndex === this.imageList.length) {
        this.imageIndex = 0;
      }
      this.openImage = false; // fade-out current image
      setTimeout(() => {
        this.imageElement1.nativeElement.style['background-image'] = 'url(' + this.imageList[this.imageIndex] + ')';
        this.openImage = true; // fade-in new image
      }, 500);
    }, 10000);
  }

  /* istanbul ignore next */
  public startSlideShowBlob(): void {
    this.imageElement1.nativeElement.style['background-image'] = 'url(' + this.blobList[this.imageIndex] + ')';

    setInterval(_ => {
      this.imageIndex++;
      if (this.imageIndex === this.imageList.length) {
        this.imageIndex = 0;
      }
      this.openImage = false; // fade-out current image
      setTimeout(() => {
        this.imageElement1.nativeElement.style['background-image'] = 'url(' + this.blobList[this.imageIndex] + ')';
        this.openImage = true; // fade-in new image
      }, 500);
    }, 10000);
  }

}
