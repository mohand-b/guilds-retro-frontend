import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sortAlphabetically',
  standalone: true
})
export class SortAlphabeticallyPipe implements PipeTransform {
  transform(value: string[]): string[] {
    return value.sort((a, b) => a.localeCompare(b));
  }
}
