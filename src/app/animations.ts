import { animate, AnimationTriggerMetadata, keyframes, state, style, transition, trigger } from '@angular/animations';

export const flashOnOff: AnimationTriggerMetadata = trigger('flashOnOff', [
  state('in', style({ transform: 'translateX(0)' })),
  state('out', style({ transform: 'translateX(100%)' })),
  transition('void => *', [
    animate(350, keyframes([
      style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
      style({ opacity: 0.75, transform: 'translateX(0)', offset: 0.5 }),
      style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 }),
    ])),
  ]),
  transition('* => void', [
    animate(350, keyframes([
      style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
      style({ opacity: 0.5, transform: 'translateX(0)', offset: 0.5 }),
      style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 }),
    ])),
  ]),
]);

export const flyInOut: AnimationTriggerMetadata = trigger('flyInOut', [
  state('in', style({transform: 'translateX(0)'})),
  state('out', style({transform: 'translateX(100%)'})),
  transition('void => *', [
    animate(1400, keyframes([
      style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
      style({opacity: 0.33, transform: 'translateX(0)',  offset: 0.5}),
      style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
    ]))
  ]),
  transition('* => void', [
    animate(700, keyframes([
      style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
      style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
      style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
    ]))
  ]),
  transition('in => out', [
    animate(700, keyframes([
      style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
      style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
      style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
    ]))
  ])
]);

export const flyUpDown: AnimationTriggerMetadata = trigger('flyUpDown', [
  state('down', style({ transform: 'translateY(0)' })),
  state('up', style({ transform: 'translateY(100%)' })),
  transition('void => *', [
    animate(400, keyframes([
      style({ opacity: 0, transform: 'translateY(-100%)', offset: 0 }),
      style({ opacity: 0.33, transform: 'translateY(0)', offset: 0.5 }),
      style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
    ])),
  ]),
  /* flyUpDown leave */
  transition('* => void', [
    animate(250, keyframes([
      style({ transform: 'scale(0)',
        height: 0, offset: 0 }),
    ])),
  ]),
]);

export const visibility: AnimationTriggerMetadata = trigger('visibility', [
  state('hidden', style({
    transform: 'scale(0)',
    height: 0,
  })),
  state('visible', style({
    transform: 'scale(1)',
  })),
  transition('hidden => visible', animate('250ms ease-in')),
  transition('visible => hidden', animate('250ms ease-out')),
]);

export const fadeInOut: AnimationTriggerMetadata = trigger('fadeInOut', [
  transition('* => fadeIn', [
    style({ opacity: 0 }),
    animate(500, style({ opacity: 1 }))
  ]),
  transition('* => fadeOut', [
    animate(500, style({ opacity: 0 }))
  ])
]);

export const detailExpand: AnimationTriggerMetadata = trigger('detailExpand', [
  state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
  state('expanded', style({ height: '50px'})),
  transition('expanded <=> collapsed', animate('250ms ease-in')),
  transition('visible => hidden', animate('250ms ease-out')),
]);

export const detailExpandView: AnimationTriggerMetadata = trigger('detailExpandView', [
  state('collapsed', style({ height: '0px', minHeight: '0', display: 'none', margin: '5px' })),
  state('1', style({ height: '70px'})),
  state('2', style({ height: '75px'})),
  state('3', style({ height: '100px'})),
  state('4', style({ height: '125px'})),
  transition('expanded <=> collapsed', animate('250ms ease-in')),
  transition('visible => hidden', animate('250ms ease-out')),
]);

export const animations: AnimationTriggerMetadata[] = [flashOnOff, flyInOut, flyUpDown, visibility, fadeInOut, detailExpand, detailExpandView];
