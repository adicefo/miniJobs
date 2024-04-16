import {AbstractControl, FormGroup} from '@angular/forms';

export function ValidirajLozinke(lozinka: string, potvrdnaLozinka: string){
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[lozinka];
    const matchingControl = formGroup.controls[potvrdnaLozinka];
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}
export function capitalizeFirstLetter(control: AbstractControl) {
  const value = control.value;
  if (value && value.length > 0) {
    const firstLetter = value.charAt(0);
    if (firstLetter !== firstLetter.toUpperCase()) {
      return { capitalizeFirstLetter: true };
    }
  }
  return null;
}
