import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function valueInArrayValidator(validValues: string[]): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isValid = validValues.some(validValue => validValue.toLowerCase() === value.toLowerCase());
    return isValid ? null : {invalidValue: {value}};
  };

}
