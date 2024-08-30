import {Pipe, PipeTransform} from '@angular/core';
import {UserDto} from "../../routes/profile/state/users/user.model";

@Pipe({
  name: 'characterIcon',
  standalone: true
})
export class CharacterIconPipe implements PipeTransform {

  transform(user: UserDto): string {
    if (!user || !user.characterClass || !user.gender) {
      return '';
    }

    const characterClass = user.characterClass.toLowerCase();
    const gender = user.gender.toLowerCase();

    return `assets/characters/${characterClass}-${gender}-icon.svg`;
  }
}

