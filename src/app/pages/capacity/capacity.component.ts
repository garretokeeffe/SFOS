import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute} from '@angular/router';
import { UserView} from '../../types/user';
import { UserService} from '../../services/user.service';
import { CapacityService} from '../../services/capacity.service';
import { AllCapacity, AllCapacityView, CapacityDetail, CapacityType, CapacityView } from '../../types/capacity';
import { CapacityManager} from './capacity-manager.component';
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

const ELEMENT_DATA: Capacity[] = [
  {fleetSegment: 'Polyvalent General',  gt: 1.079, kw: 2.079},
  {fleetSegment: 'Beamer',              gt: 4.026, kw: 3.026},
  {fleetSegment: 'Pelagic',             gt: 6.941,  kw: 4.941},
  {fleetSegment: 'Aquaculture',         gt: 9.122, kw: 5.012},
  {fleetSegment: 'Specific',            gt: 10.811, kw: 6.811}
];

@Component({
  selector: 'app-capacity',
  templateUrl: './capacity.component.html',
  styleUrls: ['./capacity.component.css'],
})
export class CapacityComponent implements OnInit, AfterViewChecked {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  public title$: Observable<string>;

  public user: UserView = null;
  public capacities: CapacityManager = new CapacityManager(); // TODO: remove once allCapacity has been implemented

  // public capacityManager: CapacityManager = new CapacityManager(); // for access to static utility methods
  public allCapacity: AllCapacityView = new AllCapacityView();

  // Temp UX Design Variables  TODO: REMOVE THIS BLOCK and References in HTML
  @ViewChild(MatSelect) numberOfVesselsSelector: MatSelect;
  @ViewChild('displayModeToggleGroup') displayMode: MatButtonToggleGroup; // table vs card

  public showUXOptions: boolean = false;
  public pointsEnabled: boolean = false;
  public showVesselCapacity: boolean = true;
  public capacitiesLoaded: CapacityManager = new CapacityManager();
  public alignColumns: boolean = false;
  public optimiseLayout: boolean = false;
  public autoExpand: boolean = false;
  // End Temp UX Variables

  public CapacityType: any = CapacityType; // enum reference
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

    /*
    this.capacityService.getCapacities().subscribe(capacities => {
        this.capacitiesLoaded = new CapacityManager(capacities); // TODO: change this block to this.capacities = new capacityManager(capacities); once UI has been agreed
        this.capacities = new CapacityManager(this.capacitiesLoaded.capacities);
        this.numberOfVesselsSelector.value = (this.capacitiesLoaded.capacities.length - 1).toString();
      },
      error => {
        console.error('Failed to retrieve capacity');
        this.capacitiesLoaded = new CapacityManager(); // TODO: change this block to this.capacities = new capacityManager(); once UI has been agreed
        this.capacities = new CapacityManager();
        this.numberOfVesselsSelector.value = '0';
      }
    );
    */

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
  // TODO: these next 2 methods may be removed when the UI has been agreed
  public onNumberOfVesselsSelected(count: string): void {
    if (count === 'ALL') {
      this.capacities = new CapacityManager(this.capacitiesLoaded.capacities);
    } else {
      this.capacities = new CapacityManager(this.capacitiesLoaded.capacities.filter((elem: CapacityView) => elem.id <= parseInt(count, 10)));
    }
    this.autoExpand = parseInt(count, 10) === 1 ? true : false;
  }
  public getOptimisedLayout(): boolean {
    let alignColumns: boolean = this.alignColumns;

    // If OptimisedLayout is selected
    // No Points:     Align Columns on both Mobile and Desktop
    // Point Enabled: Align Columns on Desktop Only
    if (this.optimiseLayout) {
      if (this.pointsEnabled) {
        alignColumns = !this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait);
      } else {
        alignColumns = true;
      }
    }

    return alignColumns;
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
