import { Component, Input, OnInit } from '@angular/core';
import { CapacityBlock, CapacityBlockView, CapacityView } from '../../../types/capacity';
import { animations } from '../../../animations';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-vessel-capacity-card',
  templateUrl: './vessel-capacity-card.component.html',
  styleUrls: ['./vessel-capacity-card.component.css'],
  animations: animations,
})
export class VesselCapacityCardComponent implements OnInit {

  @Input() public capacity: CapacityView = null;
  @Input() public pointsEnabled: boolean = false;

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(public breakpointObserver: BreakpointObserver) { }

  public ngOnInit(): void {
  }

  public isExpiringSoon(): boolean {
    for (let i: number = 0; i < this.capacity.blocks.length; i++) {
      const block: CapacityBlockView = new CapacityBlockView(this.capacity.blocks[i]);
      if (block.isExpiringSoon()) {
        return true;
      }
    }
  }

}
