import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function singleWordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value = control.value || '';

    value = value.replace(/\s+/g, '').slice(0, 30);

    if (control.value !== value) {
      control.setValue(value, {emitEvent: false});
    }

    const isValid = /^[^\s]{1,30}$/.test(value);
    return isValid ? null : {singleWord: {value}};
  };
}
