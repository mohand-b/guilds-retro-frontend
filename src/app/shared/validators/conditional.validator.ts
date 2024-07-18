import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function conditionalValidator(predicate: () => boolean, validator: ValidatorFn): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }
    return predicate() ? validator(control) : null;
  };
}
