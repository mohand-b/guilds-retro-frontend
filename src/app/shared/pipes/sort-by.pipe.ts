import {Pipe, PipeTransform} from '@angular/core';
import {DateTime} from 'luxon'; // Si vous utilisez Luxon pour les dates

@Pipe({
  name: 'sortBy',
  standalone: true
})
export class SortByPipe implements PipeTransform {
  transform(items: any[], property: string, order: 'asc' | 'desc' = 'asc'): any[] {
    if (!items || !property) {
      return items;
    }

    return items.sort((a, b) => {
      const valueA = this.resolveProperty(a, property);
      const valueB = this.resolveProperty(b, property);

      if (order === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }

  private resolveProperty(item: any, property: string): any {
    const value = property.split('.').reduce((obj, key) => obj[key], item);
    if (DateTime.isDateTime(value)) {
      return value.toMillis();
    } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return DateTime.fromISO(value).toMillis();
    }
    return value;
  }
}
