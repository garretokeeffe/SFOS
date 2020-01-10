import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVesselComponent } from './components/add-vessel/add-vessel.component';
import { BalancingstatementsComponent } from './components/balancingstatements/balancingstatements.component';
import { CatchlimitsComponent } from './components/catchlimits/catchlimits.component';
import { InspectionsComponent } from './components/inspections/inspections.component';
import { LogsheetsComponent } from './components/logsheets/logsheets.component';
import { NoAccessComponent } from './components/noaccess/noaccess.component';
import { PairingsComponent } from './components/pairings/pairings.component';
import { PointsComponent } from './components/points/points.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { VesselsComponent } from './components/vessels/vessels.component';
import { CapacityComponent } from './pages/capacity/capacity.component';
import { HomeVesselOwnerComponent } from './pages/home-vessel-owner/home-vessel-owner.component';
import { LicenceApplicationComponent } from './pages/licence-application/licence-application.component';
import { LicencesComponent } from './pages/licences/licences.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PwaTestComponent } from './pwa-test/pwa-test.component';

// Internal Users
import { LaApplicationsListComponent } from './components/la-applications-list/la-applications-list.component';

// Representative Users (External)
import { HomeRepresentativeComponent } from './pages/home-representative/home-representative.component';
import {HomeSfpaComponent} from './pages/home-sfpa/home-sfpa.component';
import {HomeSfpmdComponent} from './pages/home-sfpmd/home-sfpmd.component';
import {HomeLa2Component} from './pages/home-la2/home-la2.component';
import {HomeLaComponent} from './pages/home-la/home-la.component';
import {MapComponent} from './pages/map/map.component';
import {AuthenticationService} from './services/authentication.service';
import {RedirectComponent} from './main-nav/redirect/redirect.component';
import {HomeFishBuyerComponent} from './pages/home-fish-buyer/home-fish-buyer.component';
import {HomeComponent} from './pages/home/home.component';
import {NotificationsComponent} from './pages/notifications/notifications.component';
import {HelpComponent} from './pages/help/help.component';
import {LaWizardComponent} from './components/licence-application/la-wizard/la-wizard.component';
import { FormsComponent } from './pages/forms/forms.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthenticationService]}, /* no authentication required to reach login page */
  { path: 'home-vessel-owner', component: HomeVesselOwnerComponent, canActivate: [AuthenticationService] },
  { path: 'noaccess', component: NoAccessComponent, canActivate: [AuthenticationService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationService] },
  { path: 'clientprofile', component: ProfileComponent, canActivate: [AuthenticationService] },

  { path: 'clientlicences', component: LicencesComponent, canActivate: [AuthenticationService] },
  { path: 'licence-application', component: LicenceApplicationComponent, canActivate: [AuthenticationService] },
  { path: 'vessels', component: VesselsComponent, canActivate: [AuthenticationService] },
  { path: 'clientvessels', component: VesselsComponent, canActivate: [AuthenticationService] },
  { path: 'add-vessel', component: AddVesselComponent, canActivate: [AuthenticationService] },
  { path: 'capacity', component: CapacityComponent, canActivate: [AuthenticationService] },
  { path: 'clientcapacity', component: CapacityComponent, canActivate: [AuthenticationService] },

  { path: 'logsheets', component: LogsheetsComponent, canActivate: [AuthenticationService] },
  { path: 'catchlimits', component: CatchlimitsComponent, canActivate: [AuthenticationService] },
  { path: 'balancingstatements', component: BalancingstatementsComponent, canActivate: [AuthenticationService] },
  { path: 'pairings', component: PairingsComponent, canActivate: [AuthenticationService] },
  { path: 'inspections', component: InspectionsComponent, canActivate: [AuthenticationService] },
  { path: 'points', component: PointsComponent, canActivate: [AuthenticationService] },
  { path: 'logsheets', component: UnderConstructionComponent, canActivate: [AuthenticationService] },
  { path: 'map', component: MapComponent, canActivate: [AuthenticationService] },

  { path: 'licencesinternal', component: LaApplicationsListComponent, canActivate: [AuthenticationService] },
  { path: 'lahome', component: HomeLaComponent, canActivate: [AuthenticationService] },
  { path: 'la2home', component: HomeLa2Component, canActivate: [AuthenticationService] },
  { path: 'rephome', component: HomeRepresentativeComponent, canActivate: [AuthenticationService] },
  { path: 'fishbuyerhome', component: HomeFishBuyerComponent, canActivate: [AuthenticationService] },
  { path: 'sfpahome', component: HomeSfpaComponent, canActivate: [AuthenticationService] },
  { path: 'sfpmdhome', component: HomeSfpmdComponent, canActivate: [AuthenticationService] },

  { path: 'pwatest', component: PwaTestComponent, canActivate: [AuthenticationService] },

  { path: 'redirect/:url', component: RedirectComponent, pathMatch: 'full', canActivate: [AuthenticationService] },

  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthenticationService] },
  { path: 'forms', component: FormsComponent }, /* no authentication required on forms page */
  { path: 'help', component: HelpComponent, canActivate: [AuthenticationService] },
  { path: 'home', component: HomeComponent }, /* no authentication required on public home page */

  { path: 'licences', component: LicencesComponent, canActivate: [AuthenticationService] },
  { path: 'licence-application-wizard', component: LaWizardComponent }, /* no authentication required on licence application wizard */
  { path: 'licence-application-wizard/:id', component: LaWizardComponent  }, /* no authentication required on licence application wizard */
  { path: 'licence-application-wizard/:id/:arn', component: LaWizardComponent  }, /* no authentication required on licence application wizard */

  { path: 'vessel/:id', component: VesselsComponent, canActivate: [AuthenticationService] }, /* This will link routes like /vessel/1 or /vessel/9 etc. to the VesselsComponent component. */
  // { path: '',  redirectTo: '/login', pathMatch: 'full' },
  { path: '',  redirectTo: '/home', pathMatch: 'full' },
];

export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' });
