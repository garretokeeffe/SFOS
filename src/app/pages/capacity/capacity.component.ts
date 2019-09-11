import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute} from '@angular/router';
import { UserView} from '../../types/user';
import { UserService} from '../../services/user.service';
import { CapacityService} from '../../services/capacity.service';
import { AllCapacity, AllCapacityView, CapacityDetail, CapacityView } from '../../types/capacity';
import { FleetSegment, FleetSegmentManager, FleetSubSegment } from '../../types/fleet-segment';
import { Globals} from '../../globals';
import { MatButtonToggleGroup, MatSelect, MatTabGroup} from '@angular/material';
import { of } from 'rxjs';
import * as moment from 'moment';
import { Duration } from 'moment';

export interface Capacity {
  fleetSegment: string;
  gt: number;
  kw: number;
}

@Component({
  selector: 'app-capacity',
  templateUrl: './capacity.component.html',
  styleUrls: ['./capacity.component.css'],
})
export class CapacityComponent implements OnInit, AfterViewChecked {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  public title$: Observable<string>;

  public user: UserView = null;
  public allCapacity: AllCapacityView = new AllCapacityView();

  // Temp UX Design Variables  TODO: REMOVE THIS BLOCK and References in HTML
  @ViewChild(MatSelect) public numberOfVesselsSelector: MatSelect;
  @ViewChild('displayModeToggleGroup') public displayMode: MatButtonToggleGroup; // table vs card

  public showUXOptions: boolean = false;
  public pointsEnabled: boolean = false;
  public showVesselCapacity: boolean = true;
  public alignColumns: boolean = false;
  public optimiseLayout: boolean = false;
  public autoExpand: boolean = false;
  // End Temp UX Variables

  public FleetSegment: any = FleetSegment; // enum reference
  public FleetSubSegment: any = FleetSubSegment; // enum reference
  public FleetSegmentManager: any = FleetSegmentManager; // access to static methods

  public document: HTMLElement;

  constructor(public activatedRoute: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              public userService: UserService,
              public capacityService: CapacityService,
              public elem: ElementRef,
              public cdRef: ChangeDetectorRef,
              public globals: Globals) {
    this.document = this.elem.nativeElement;
  }

  public ngOnInit(): void {
    this.displayMode.value = 'GRID'; // GRID | TABLE  TODO: remove this when UI has been agreed

    // TODO: for now set title = 'MY CAPACITY' , when Representative User is implemented w need to use window.history.state.title
    // but this is not being passed correctly from the MY CAPACITY feature button on the vessel owner home screen
    // this.title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));
    this.title$ = of('My Capacity');

    console.log(Breakpoints.HandsetPortrait); // remove me

    this.userService.getUserByUserId().subscribe((user: UserView) => {
        this.user = user;
      },
      (error) => {
        console.error('Failed to retrieve userprofile');
        this.user = null;
      },
    );

    // TODO: pass ownerId into getAllCapacity
    this.capacityService.getAllCapacity().subscribe(
    (allCapacity: AllCapacity) => {
      this.allCapacity = new AllCapacityView(allCapacity);
      this.numberOfVesselsSelector.value = (this.allCapacity.onRegister.length - 1).toString();
    },
    (error) => {
      console.error('Failed to retrieve capacity');
      this.allCapacity = new AllCapacityView();
      this.numberOfVesselsSelector.value = '0';
    });
  }

  public ngAfterViewChecked(): void {
    this.resizeCards();
  }

  public resizeCards(): void {
    return; // TODO: re-enable this after solving problem of resizing after showing proposed vessel details
    // make all cards the same size
    let cards: HTMLCollection = this.document.getElementsByTagName('mat-card');
    let largestHeight: number = 0;
    let largestWidth: number = 0;

    if (cards) {
      // remove any previously set heights and width
      for (let i: number = 0; i < cards.length; i++) {
        const card: any = cards[i];
        if (!card.classList.contains('inner-card')) {
          card.style.height = '';
          card.style.width = '';
        }
      }
      cards = this.document.getElementsByTagName('mat-card');

      // give all cards the largest height and width if not on mobile
      if (!this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {
        // determine the largest height and width
        for (let i: number = 0; i < cards.length; i++) {
          const card: any = cards[i];
          if (!card.classList.contains('inner-card')) {
            if (card.clientHeight > largestHeight) {
              largestHeight = card.clientHeight;
            }
            if (card.clientWidth > largestWidth) {
              largestWidth = card.clientWidth;
            }
          }
        }
        // set largest height and width on all cards
        for (let i: number = 0; i < cards.length; i++) {
          const card: any = cards[i];
          if (!card.classList.contains('inner-card')) {
            card.style.height = largestHeight - 32 + 'px'; // deduct extra vertical padding
            card.style.width = largestWidth + 'px';
          }
        }
      }
    }
  }

  public isExpiringSoon(): boolean {
    let expiringSoon: boolean = false;
    if (this.allCapacity && this.allCapacity.offRegister && this.allCapacity.offRegister) {
      this.allCapacity.offRegister.forEach( (capacity: CapacityView) => {
        capacity.details.forEach( (detail: CapacityDetail) => {
          if (detail.expiryDate) {

            const now: any = moment.utc(new Date()); // today's date
            const expiryDate: any = moment(detail.expiryDate, 'DD/MM/YYYY'); // expiryDate should already be in utc
            const difference: Duration = moment.duration(expiryDate.diff(now));
            const daysToExpiry: number = difference.asDays();
            // console.log('Days to expiry: ' + daysToExpiry);

            if (daysToExpiry <= this.globals.configuration.warnIfCapacityExpiryDateIsApproachingDays) {
              expiringSoon = true;
            }
          }
        });
      });
    }
    return expiringSoon;
  }
}
