// globals.ts
import { Injectable } from '@angular/core';

export class Plain {
  public width: number;
  public height: number;
}
export class Configuration {
  public showPWATestMenuItem: boolean = false;
  public letterOfOfferReviewDelay: number = 0; // 5000
  public embeddedLetterOfOffer: boolean = false;
  public penaltyPointsEnabled: boolean = true;

  // application config defined by the business
  public warnIfCapacityExpiryDateIsApproachingDays: number = 60;
}

@Injectable()
export class Globals {
  public demo: boolean = false;
  public demoSkipLoginScreen: boolean = true; // demo must be true for demoSkipLoginScreen = true to take effect
  public prototype: boolean = false; // set true to display proposed features
  public admin: boolean = false; // set true to display DELETE button on Licence Application Cards

  public screenWidth: number;
  public screenHeight: number;

  // Responsive Screen Resolutions
  public thunderbolt: Plain = { width: 2560, height: 1440};
  public desktop_xlarge: Plain = { width: 1980, height: 1080};
  public desktop_large: Plain = { width: 1366, height: 768};
  public desktop: Plain = { width: 960, height: 768};
  public tablet: Plain = { width: 768, height: 768};
  public mobile_large: Plain = { width: 640, height: 768};
  public mobile: Plain = { width: 480, height: 768};
  public mobile_small: Plain = { width: 300, height: 768};

  public desktop_qb_large: Plain = { width: 1920, height: 1080};
  public desktop_qb_small: Plain = { width: 1280, height: 1024};

  public configuration: Configuration = new Configuration();
}
