import { Component, OnInit } from '@angular/core';
import { IFISAuthentication } from '../../types/ifisauthentication';
import { AuthenticationService } from '../../services/authentication.service';
import { EmitterService } from '../../services/emitter.service';
import { Emitters } from '../../types/emitters';

@Component({
  selector: 'app-ifis-simulator',
  templateUrl: './ifis-simulator.component.html',
  styleUrls: ['./ifis-simulator.component.css']
})
export class IfisSimulatorComponent implements OnInit {

  private _userType: string = 'sfos_vessel_owner'; // default user role,
    // sfos_vessel_owner | sfos_vessel_owner_ro | sfos_representative | sfos_representative_ro | sfos_la | sfos_la_ro | sfos_la2 | sfos_la2_ro
    // sfos_fish_buyer | sfos_fish_buyer_ro | sfos_sfpa | sfos_sfpa_ro | sfos_sfpmd | sfos_sfpmd_ro
  private previousUserType: string = this._userType;

  public access: IFISAuthentication = null;

  constructor(private user: AuthenticationService) { }

  public ngOnInit(): void {
    // if keycloak authentication has already been used don't fire up the simulator automatically - let the user select a role
    if (this.user.isUsingKeycloak()) {
      this._userType = 'keycloak';
      console.log('KEYCLOAK LOG IN - IFIS ROLE SIMULATOR IS AVAILABLE BUT NOT YET IN USE');
    } else {
      console.log('IFIS ROLE SIMULATOR IS IN USE');
    }
    this.onChangeUserType(this.userType);
  }

  public set userType(value: string) {
    this.previousUserType = this._userType;
    this._userType = value;
    console.log('Selected UserType = ' + this._userType + '. (Previous = ' + this.previousUserType + ')');
  }
  public get userType(): string {
    return this._userType;
  }

  public onChangeUserType(userType: string): void {

    this.userType = userType;

    // if user type has changed from EXT to INT or vice-versa we need to re-display the dashboard so incorrect screen 2s are not displayed
    let returnToDashboard: boolean = false;

    // if user group stays the same but access has changed from write to view or vice-versa
    let accessLevelChanged: boolean = false;

    if (this.userType === 'keycloak') {
      returnToDashboard = true;
      accessLevelChanged = this.previousUserType === 'keycloak';
      this.access = new IFISAuthentication(this.user.getKeycloakRoles()); // rely on keycloak authentication
    }
    else if (this.userType === 'sfos_vessel_owner') {
      returnToDashboard = !(['sfos_vessel_owner', 'sfos_vessel_owner_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_vessel_owner';
      this.access = new IFISAuthentication(['sfos_vessel_owner']);
    }
    else if (this.userType === 'sfos_vessel_owner_ro') {
      returnToDashboard = !(['sfos_vessel_owner', 'sfos_vessel_owner_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_vessel_owner_ro';
      this.access = new IFISAuthentication(['sfos_vessel_owner_ro']);
    }
    else if (this.userType === 'sfos_representative') {
      returnToDashboard = !(['sfos_representative', 'sfos_representative_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_representative';
      this.access = new IFISAuthentication(['sfos_representative']);
    }
    else if (this.userType === 'sfos_representative_ro') {
      returnToDashboard = !(['sfos_representative', 'sfos_representative_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_representative_ro';
      this.access = new IFISAuthentication(['sfos_representative_ro']);
    }
    else if (this.userType === 'sfos_la') {
      returnToDashboard = !(['sfos_la', 'sfos_la_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_la';
      this.access = new IFISAuthentication(['sfos_la']);
    }
    else if (this.userType === 'sfos_la_ro') {
      returnToDashboard = !(['sfos_la', 'sfos_la_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_la_ro';
      this.access = new IFISAuthentication(['sfos_la_ro']);
    }
    else if (this.userType === 'sfos_la2') {
      returnToDashboard = !(['sfos_la2', 'sfos_la2_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_la2';
      this.access = new IFISAuthentication(['sfos_la2']);
    }
    else if (this.userType === 'sfos_la2_ro') {
      returnToDashboard = !(['sfos_la2', 'sfos_la2_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_la2_ro';
      this.access = new IFISAuthentication(['sfos_la2_ro']);
    }
    else if (this.userType === 'sfos_fish_buyer') {
      returnToDashboard = !(['sfos_fish_buyer', 'sfos_fish_buyer2_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_fish_buyer';
      this.access = new IFISAuthentication(['sfos_fish_buyer']);
    }
    else if (this.userType === 'sfos_fish_buyer_ro') {
      returnToDashboard = !(['sfos_fish_buyer', 'sfos_fish_buyer2_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_fish_buyer_ro';
      this.access = new IFISAuthentication(['sfos_fish_buyer_ro']);
    }
    else if (this.userType === 'sfos_sfpa') {
      returnToDashboard = !(['sfos_sfpa', 'sfos_sfpa_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_sfpa';
      this.access = new IFISAuthentication(['sfos_sfpa']);
    }
    else if (this.userType === 'sfos_sfpa_ro') {
      returnToDashboard = !(['sfos_sfpa', 'sfos_sfpa_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_sfpa_ro';
      this.access = new IFISAuthentication(['sfos_sfpa_ro']);
    }
    else if (this.userType === 'sfos_sfpmd') {
      returnToDashboard = !(['sfos_sfpmd', 'sfos_sfpmd_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_sfpmd';
      this.access = new IFISAuthentication(['sfos_sfpmd']);
    }
    else if (this.userType === 'sfos_sfpamd_ro') {
      returnToDashboard = !(['sfos_sfpmd', 'sfos_sfpmd_ro'].includes(this.previousUserType));
      accessLevelChanged = this.previousUserType === 'sfos_sfpamd_ro';
      this.access = new IFISAuthentication(['sfos_sfpamd_ro']);
    }
    else {
      // no-access
      this.access = new IFISAuthentication();
    }

    this.user.setSimulatorUser(this.access);
    this.user.authenticate();

    if (returnToDashboard) {
      EmitterService.get(Emitters[Emitters.RETURN_TO_DASHBOARD]).emit(true);
    }
    if (accessLevelChanged) {
      const currentAccessLevel: string = this.userType;
      const previousAccessLevel: string = this.previousUserType;
      EmitterService.get(Emitters[Emitters.UPDATE_ACCESS_LEVEL]).emit({currentAccessLevel: currentAccessLevel, previousAccessLevel: previousAccessLevel});
    }
  }

}
