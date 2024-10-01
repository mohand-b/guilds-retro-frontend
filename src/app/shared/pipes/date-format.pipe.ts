import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(value: Date | string): string {
    const date = typeof value === 'string' ? DateTime.fromISO(value) : DateTime.fromJSDate(value);

    const secondsDifference = DateTime.now().diff(date, 'seconds').seconds;

    if (Math.abs(secondsDifference) <= 10) {
      return 'à l\'instant';
    }

    const distanceToNow = date.toRelative();

    return distanceToNow || '';
  }
}
