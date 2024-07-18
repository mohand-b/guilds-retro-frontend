import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DUNGEONS} from "../../routes/events/state/dungeons/dungeons.data";

export function dungeonNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    const isValid = DUNGEONS.some(dungeon => dungeon.dungeonName.toLowerCase() === value.toLowerCase());
    return isValid ? null : {invalidDungeonName: {value}};
  };
}
