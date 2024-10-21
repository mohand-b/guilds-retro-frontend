import {animate, group, query, style, transition, trigger} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* => *', [
    query(':enter, :leave', [
      style({position: 'absolute', width: '100%'})
    ], {optional: true}),

    group([
      query(':leave', [
        animate('300ms ease-in', style({transform: 'translateX({{ direction }})', opacity: 0}))
      ], {optional: true}),

      query(':enter', [
        style({transform: 'translateX({{ oppositeDirection }})', opacity: 0}),
        animate('300ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
      ], {optional: true})
    ])
  ], {
    params: {
      direction: '100%',
      oppositeDirection: '-100%'
    }
  })
]);

export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({opacity: 0}),
    animate('500ms ease-in', style({opacity: 1}))
  ])
]);
