import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-licenceApplicationLanding',
  templateUrl: './licenceApplicationLanding.html',
  styleUrls: ['./licenceApplicationLanding.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
})
export class LicenceApplicationLanding implements OnInit {
  private _qualifyingMember: boolean = false;
  public get isQualifyingMember(): boolean {
    return this._qualifyingMember;
  }
  public set qualifyingMember(value: boolean) {
    this._qualifyingMember = value;
  }

  constructor(private snackBar: MatSnackBar) { }

  public ngOnInit(): void { }
}
