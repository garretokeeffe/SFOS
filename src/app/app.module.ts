// tslint:disable: ordered-imports
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { ServiceWorkerModule } from '@angular/service-worker';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Add schemas property into the root module and put CUSTOM_ELEMENTS_SCHEMA into it.
                                                        // This is important since Onsen UI components are Web Components (Custom Elements).

import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

// tslint:disable: ordered-imports
import { keycloakInitializer } from './keycloak-init';
import { AppComponent } from './app.component';
import { IfisSimulatorComponent } from './components/ifis-simulator/ifis-simulator.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { LoginComponent } from './pages/login/login.component';

import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VesselsComponent } from './components/vessels/vessels.component';
import { HomeVesselOwnerComponent } from './pages/home-vessel-owner/home-vessel-owner.component';
import { NoAccessComponent } from './components/noaccess/noaccess.component';
import { HomeLicensingComponent } from './pages/home-licensing/home-licensing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CapacityComponent } from './pages/capacity/capacity.component';
import { LicencesComponent } from './pages/licences/licences.component';
import { LogsheetsComponent } from './components/logsheets/logsheets.component';
import { CatchlimitsComponent } from './components/catchlimits/catchlimits.component';
import { BalancingstatementsComponent } from './components/balancingstatements/balancingstatements.component';
import { PairingsComponent } from './components/pairings/pairings.component';
import { InspectionsComponent } from './components/inspections/inspections.component';
import { PointsComponent } from './components/points/points.component';
import { AddVesselComponent } from './components/add-vessel/add-vessel.component';

// services
import { AuthenticationService } from './services/authentication.service';
import { EmitterService } from './services/emitter.service';

// globals
import { Utils } from './services/utils.service';
import { environment } from '../environments/environment';
import { routingModule } from './app.routing';
import { Globals } from './globals';
import { ProgressComponent } from './components/progress/progress.component';
import { GlossaryVesselIdentifiersBottomSheet, VesselComponent } from './components/vessel/vessel.component';
import { LicenceApplicationComponent } from './pages/licence-application/licence-application.component';
import { ArchwizardModule } from 'angular-archwizard';
import { PwaTestComponent } from './pwa-test/pwa-test.component';
import { LaApplicationsListComponent } from './components/la-applications-list/la-applications-list.component';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { HomeRepresentativeComponent } from './pages/home-representative/home-representative.component';
import { HomeSfpaComponent } from './pages/home-sfpa/home-sfpa.component';
import { HomeSfpmdComponent } from './pages/home-sfpmd/home-sfpmd.component';
import { HomeLa2Component } from './pages/home-la2/home-la2.component';
import { ClientSelectorComponent } from './components/client-selector/client-selector.component';
import { HomeLaComponent } from './pages/home-la/home-la.component';
import { MapComponent } from './pages/map/map.component';
import { ProgressBarModule} from 'angular-progress-bar';
import { RedirectComponent } from './main-nav/redirect/redirect.component';
import { SidenavService } from './services/sidenav.service';
import { HomeFishBuyerComponent } from './pages/home-fish-buyer/home-fish-buyer.component';
import { HomeComponent } from './pages/home/home.component';
import { LogobarComponent } from './components/logobar/logobar.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { HelpComponent } from './pages/help/help.component';
import { SafePipe} from './pipes/safe.pipe';
import { FeatureButtonsComponent } from './components/feature-buttons/feature-buttons.component';
import { DividerComponent } from './components/divider/divider.component';
import { VersionService } from './services/version.service';
import { DemoService } from './services/demo.service';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { ParallaxDirective } from './directives/parallax/parallax.directive';
import { MainLogoComponent } from './components/main-logo/main-logo.component';
import { TokenInterceptor } from './services/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CapacityCardComponent } from './components/capacity/capacity-card/capacity-card.component';
import { Filter } from './pipes/filter.pipe';
import { NotFilter } from './pipes/notFilter.pipe';
import { Unique } from './pipes/unique.pipe';
import { Contain } from './pipes/contain.pipe';
import { FleetSegmentComponent } from './components/capacity/fleet-segment/fleet-segment.component';
import { TrackRecordComponent } from './components/capacity/track-record/track-record.component';
import { OrderBy } from './pipes/orderBy.pipe';
import { CapacityBlockComponent } from './components/capacity/capacity-block/capacity-block.component';
import { VesselCapacityCardComponent } from './components/capacity/vessel-capacity-card/vessel-capacity-card.component';
import {
  LaRetrievePreliminaryApplicationBottomSheet,
  LaRetrievePreliminaryApplicationComponent,
} from './components/licence-application/la-retrieve-preliminary-application/la-retrieve-preliminary-application.component';
import { NumberDirective } from './directives/number/number.directive';
import { LaHeaderComponent } from './components/licence-application/la-header/la-header.component';
import { LaWizardComponent } from './components/licence-application/la-wizard/la-wizard.component';
import {
  LaActivateApplicationBottomSheet,
  LaLetterOfOfferComponent,
} from './components/licence-application/la-letter-of-offer/la-letter-of-offer.component';
import { LaDownloadFormsComponent } from './components/licence-application/la-download-forms/la-download-forms.component';
import { LaSubmitManuallyComponent } from './components/licence-application/la-submit-manually/la-submit-manually.component';
import {
  LaLicenceApplicationProcessExplanationBottomSheet,
  LaConfirmQualifyingStatusComponent, LaConfirmQualifyingStatusBottomSheet
} from './components/licence-application/la-confirm-qualifying-status/la-confirm-qualifying-status.component';
import {
  LaFleetSegmentBottomSheet,
  LaPreliminaryInfoSimpleComponent,
  LaReviewPreliminaryInfoBottomSheet,
  LaVesselLengthBottomSheet,
} from './components/licence-application/la-preliminary-info-simple/la-preliminary-info-simple.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { BottomsheetCloseIconComponent } from './components/bottomsheet-close-icon/bottomsheet-close-icon.component';
import { LaApplicationsComponent } from './components/licence-application/la-applications/la-applications.component';
import { LaApplicationCardComponent } from './components/licence-application/la-application-card/la-application-card.component';
import { FormsComponent } from './pages/forms/forms.component';
import { IsoDatePipe } from './pipes/iso-date.pipe';
import { LoadingText } from './directives/loading-text/loading-text.directive';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    Filter,
    NotFilter,
    Contain,
    Unique,
    OrderBy,
    ParallaxDirective,
    IfisSimulatorComponent,
    LoginComponent,
    MainNavComponent,
    VesselsComponent,
    HomeVesselOwnerComponent,
    NoAccessComponent,
    HomeLicensingComponent,
    ProfileComponent,
    CapacityComponent,
    LicencesComponent,
    LogsheetsComponent,
    CatchlimitsComponent,
    BalancingstatementsComponent,
    PairingsComponent,
    InspectionsComponent,
    PointsComponent,
    AddVesselComponent,
    UnderConstructionComponent,
    ProgressComponent,
    VesselComponent,
    LicenceApplicationComponent,
    PwaTestComponent,
    LaApplicationsListComponent,
    InfoDialogComponent,
    ConfirmationDialogComponent,
    HomeRepresentativeComponent,
    HomeSfpaComponent,
    HomeSfpmdComponent,
    HomeLa2Component,
    ClientSelectorComponent,
    HomeLaComponent,
    MapComponent,
    RedirectComponent,
    HomeFishBuyerComponent,
    HomeComponent,
    LogobarComponent,
    NotificationsComponent,
    HelpComponent,
    FeatureButtonsComponent,
    DividerComponent,
    TitleBarComponent,
    MainLogoComponent,
    CapacityCardComponent,
    FleetSegmentComponent,
    TrackRecordComponent,
    CapacityBlockComponent,
    VesselCapacityCardComponent,
    GlossaryVesselIdentifiersBottomSheet,
    LaRetrievePreliminaryApplicationComponent,
    LaRetrievePreliminaryApplicationBottomSheet,
    NumberDirective,
    LaHeaderComponent,
    LaWizardComponent,
    LaReviewPreliminaryInfoBottomSheet,
    LaVesselLengthBottomSheet,
    LaFleetSegmentBottomSheet,
    LaLetterOfOfferComponent,
    LaDownloadFormsComponent,
    LaSubmitManuallyComponent,
    LaConfirmQualifyingStatusComponent,
    LaLicenceApplicationProcessExplanationBottomSheet,
    LaConfirmQualifyingStatusBottomSheet,
    LaActivateApplicationBottomSheet,
    LaPreliminaryInfoSimpleComponent,
    BottomsheetCloseIconComponent,
    LaApplicationsComponent,
    LaApplicationCardComponent,
    FormsComponent,
    IsoDatePipe,
    LoadingText,
  ],
  imports: [
    routingModule,
    BrowserModule,
    BrowserAnimationsModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    LayoutModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CdkTableModule,
    CdkTreeModule,
    NgxTypeaheadModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ArchwizardModule,
    ProgressBarModule,
    PdfJsViewerModule,
    KeycloakAngularModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents: [
    InfoDialogComponent,
    ConfirmationDialogComponent,
    GlossaryVesselIdentifiersBottomSheet,
    LaRetrievePreliminaryApplicationBottomSheet,
    LaReviewPreliminaryInfoBottomSheet,
    LaVesselLengthBottomSheet,
    LaFleetSegmentBottomSheet,
    LaLicenceApplicationProcessExplanationBottomSheet,
    LaConfirmQualifyingStatusBottomSheet,
    LaActivateApplicationBottomSheet,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-GB' },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true} },
    Globals,
    AuthenticationService,
    Utils,
    EmitterService,
    SidenavService,
    VersionService,
    DemoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: APP_INITIALIZER, useFactory: keycloakInitializer, multi: true, deps: [KeycloakService, Globals] },
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
