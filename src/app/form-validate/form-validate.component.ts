import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-validate',
  templateUrl: './form-validate.component.html',
  styleUrls: ['./form-validate.component.css']
})
export class FormValidateComponent implements OnInit {
  typeCard: any = null
  cardForm: FormGroup;
  numberCard: string
  ramdonNumber: string
  dateInput: string = '';
  isValidMonthYear: boolean = false;
  isExpiredYear: boolean = false;
  showForm: boolean = true;
  showSuccessComponent: boolean = false;
  @ViewChild('expiresInput') expiresInput: ElementRef;


  ngOnInit() {
    this.cardForm = new FormGroup({
      userData: new FormGroup({
       
        name: new FormControl(
          null,
          [ Validators.required,]),
        number: new FormControl(
          null,
          [Validators.required],
          [this.forbiddenNumberValidator()]),
        expires: new FormControl(
          null,
          [ 
            Validators.required, 
            Validators.pattern(/^\d{2}\/\d{0,2}$/),
          ]),
        cvc: new FormControl(
          '',
          [ Validators.required,]),
      }),
    });
    
  }

  forbiddenNumberValidator(): AsyncValidatorFn {
    return (control: FormControl): Promise<{ [key: string]: any }> => {
      return new Promise((resolve) => {
        this.numberCard = control.value.toString(); // Convertir el valor a cadena
  
        if (this.numberCard.match(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)) {
          this.typeCard = { type: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" };
          resolve(null); 
        }
      
        if (this.numberCard.match(/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/)) {
          this.typeCard = { type: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1000px-Mastercard-logo.svg.png" };
          resolve(null); 
        }

        if (this.numberCard.match(/^3[47][0-9]{13}$/)) {
          this.typeCard = { type: "https://graffica.info/wp-content/uploads/2018/04/american-express-graphic-design-3.jpg" };
          resolve(null); 
        } 
  
        resolve({invalidNumber: true});
      });
    };
  }
  

  onExpiresInput(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      input.value = value.slice(0, 2) + '/' + value.slice(2, 4);
    } else {
      input.value = value;
    }

    this.dateInput = input.value;
    this.checkMonthYearValidity();
    this.checkYearExpiration();
  }

  checkMonthYearValidity() {
    const parts = this.dateInput.split('/');
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);

      if (month >= 1 && month <= 12 && year >= 0 && year <= 99) {
        this.isValidMonthYear = true;
      } else {
        this.isValidMonthYear = false;
      }
    } else {
      this.isValidMonthYear = false;
    }
  }

  checkYearExpiration() {
    if (this.isValidMonthYear) {
      const currentYear = new Date().getFullYear() % 100; // Obtener el año actual (últimos dos dígitos)
      const inputYear = parseInt(this.dateInput.split('/')[1], 10);

      if (inputYear < currentYear) {
        this.isExpiredYear = true;
      } else {
        this.isExpiredYear = false;
      }
    } else {
      this.isExpiredYear = false;
    }
  }
  
  ramdonCvc(){
    const minNumber = 0;
    const maxNumber = 999;
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    this.ramdonNumber = randomNumber.toString().padStart(3, '0');
    this.cardForm.get('userData.cvc').setValue(this.ramdonNumber);
  }

  onSubmit() {
    this.showForm = false;
    this.showSuccessComponent = true;
  
    setTimeout(() => {
      this.cardForm.reset();
      this.showForm = true;
      this.showSuccessComponent = false;
    }, 4000);
  }
  
}
