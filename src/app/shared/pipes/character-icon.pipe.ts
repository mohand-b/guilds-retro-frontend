import {Pipe, PipeTransform} from '@angular/core';
import {CharacterClassEnum, UserDto} from "../../routes/profile/state/users/user.model";

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

@Pipe({
  name: 'characterUnisexIcon',
  standalone: true
})
export class CharacterUnisexIconPipe implements PipeTransform {

  transform(user: UserDto): string {
    if (!user || !user.characterClass) {
      return '';
    }

    const characterClass = user.characterClass.toLowerCase

    return `assets/characters/${characterClass}_icon.svg`;
  }
}

@Pipe({
  name: 'characterColor',
  standalone: true
})
export class CharacterColorPipe implements PipeTransform {

  transform(characterClass: CharacterClassEnum): string {

    switch (characterClass) {
      case CharacterClassEnum.CRA:
        return '#D91616';
      case CharacterClassEnum.ECAFLIP:
        return '#F8F2AB';
      case CharacterClassEnum.ENIRIPSA:
        return '#EB5B6F';
      case CharacterClassEnum.ENUTROF:
        return '#EBCA00';
      case CharacterClassEnum.FECA:
        return '#a9946a';
      case CharacterClassEnum.IOP:
        return '#ED8502';
      case CharacterClassEnum.OSAMODAS:
        return '#1DA9E2';
      case CharacterClassEnum.PANDAWA:
        return '#4C4F42';
      case CharacterClassEnum.SACRIEUR:
        return '#C3D214';
      case CharacterClassEnum.SADIDA:
        return '#3BAA35';
      case CharacterClassEnum.SRAM:
        return '#3B4193';
      case CharacterClassEnum.XELOR:
        return '#026491';
      default:
        return '#BBBBBB';
    }
  }
}

