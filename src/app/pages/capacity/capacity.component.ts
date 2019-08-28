import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute} from '@angular/router';
import { UserView} from '../../types/user';
import { UserService} from '../../services/user.service';
import { LicenceService} from '../../services/licence.service';
import { CapacityService} from '../../services/capacity.service';
import { VesselView} from '../../types/vessel';
import { CapacityType, CapacityView} from '../../types/capacity';
import { CapacityManager} from './capacity-manager.component';
import { FleetSegment, FleetSubSegment } from '../../types/fleet-segment';
import { Globals} from '../../globals';
import { MatButtonToggleGroup, MatSelect, MatTabGroup} from '@angular/material';

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
  styleUrls: ['./capacity.component.css']
})
export class CapacityComponent implements OnInit, AfterViewChecked {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  title$: Observable<object>;

  public user: UserView = null;
  public capacities: CapacityManager = new CapacityManager();

  panelOpenState = false;

  displayedColumns: string[] = ['fleetSegment', 'gt', 'kw'];
  displayedColumnsData: string[] = ['fleetSegmentData', 'gtData', 'kwData'];
  dataSource = ELEMENT_DATA;

  // FleetSubSegmentColumns: Array<string> = ['vesselName', 'capacity']; // 'points', 'pointsExpiryDate'

  // Temp UX Design Variables  TODO: REMOVE THIS BLOCK and References in HTML
  @ViewChild(MatSelect) numberOfVesselsSelector: MatSelect;
  @ViewChild('displayModeToggleGroup') displayMode: MatButtonToggleGroup; // table vs card
  @ViewChild('containerToggleGroup') container: MatButtonToggleGroup; // tab vs expansion panel

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

  public document: HTMLElement;

  constructor(public activatedRoute: ActivatedRoute,
              public breakpointObserver: BreakpointObserver,
              public userService: UserService,
              public capacityService: CapacityService,
              public elem: ElementRef,
              public cdRef: ChangeDetectorRef) {
    this.document = this.elem.nativeElement;
  }

  ngOnInit() {
    this.displayMode.value = 'GRID'; // GRID | TABLE  TODO: remove this when UI has been agreed
    this.container.value = 'TAB'; // TAB | EXPANSION_PANEL TODO: remove this when UI has been agreed

    this.title$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state.title));

    console.log(Breakpoints.HandsetPortrait); // remove me

    this.userService.getUserByUserId().subscribe((user: UserView) => {
        this.user = user;
      },
      error => {
        console.error('Failed to retrieve userprofile');
        this.user = null;
      }
    );

    this.capacityService.getCapacities().subscribe(capacities => {
        this.capacitiesLoaded = new CapacityManager(capacities); // TODO: change this block to this.capacities = new CapacityManager(capacities); once UI has been agreed
        this.capacities = new CapacityManager(this.capacitiesLoaded.capacities);
        this.numberOfVesselsSelector.value = (this.capacitiesLoaded.capacities.length - 1).toString();
      },
      error => {
        console.error('Failed to retrieve capacity');
        this.capacitiesLoaded = new CapacityManager(); // TODO: change this block to this.capacities = new CapacityManager(); once UI has been agreed
        this.capacities = new CapacityManager();
        this.numberOfVesselsSelector.value = '0';
      }
    );
  }

  ngAfterViewChecked() {
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
    // make all cards the same size
    let cards: HTMLCollection = this.document.getElementsByTagName('mat-card');
    let largestHeight: number = 0;
    let largestWidth: number = 0;

    if (cards) {
      // remove any previously set heights and width
      for (let i: number = 0; i < cards.length; i++) {
        const card: any = cards[i];
        card.style.height = '';
        card.style.width = '';
      }
      cards = this.document.getElementsByTagName('mat-card');

      // give all cards the largest height and width if not on mobile
      if (!this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {
        // determine the largest height and width
        for (let i: number = 0; i < cards.length; i++) {
          const card: any = cards[i];
          if (card.clientHeight > largestHeight) {
            largestHeight = card.clientHeight;
          }
          if (card.clientWidth > largestWidth) {
            largestWidth = card.clientWidth;
          }
        }
        // set largest height and width on all cards
        for (let i: number = 0; i < cards.length; i++) {
          const card: any = cards[i];
          card.style.height = largestHeight - 32 + 'px'; // deduct extra vertical padding
          card.style.width = largestWidth + 'px';
        }
      }
    }
  }
}

