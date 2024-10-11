import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {EventTypesEnum} from "../../routes/events/state/events/event.model";

export function eventTypeFieldsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const type = control.get('type')?.value;
    const title = control.get('title')?.value;
    const dungeonName = control.get('dungeonName')?.value;
    const arenaTargets = control.get('arenaTargets')?.value;

    if (!type) {
      return null;
    }

    const isValid =
      (type === EventTypesEnum.DUNGEON && dungeonName) ||
      (type === EventTypesEnum.ARENA && arenaTargets) ||
      (type === EventTypesEnum.OTHER && title);

    return isValid ? null : {missingRequiredField: true};
  };
}
