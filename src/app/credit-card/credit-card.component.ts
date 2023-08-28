import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
})
export class CreditCardComponent {
  @Input() typeCard: any;
  @Input() numberCard: string;
  @Input() name: string;
  @Input() cvc: string;
  @Input() expires: string;
  
  formatNumber(value: string, start: number, end: number): string {
    if (!value) {
      return '';
    }
    return value.substring(start, end);
  }
}
