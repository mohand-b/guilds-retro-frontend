import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function atLeastOneRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const text = control.get('text')?.value;
    const image = control.get('image')?.value;

    if (text || image) {
      return null;
    }

    return {atLeastOneRequired: true};
  };
}
