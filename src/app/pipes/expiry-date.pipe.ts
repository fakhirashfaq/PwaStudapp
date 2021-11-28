import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../shared/utils/constants';

@Pipe({
  name: 'expiryDate'
})
export class ExpiryDatePipe implements PipeTransform {

  transform(date: Date) {
    return !!date ? date.setFullYear(date.getFullYear() + Constants.numberValue_One) : null;
  }

}
