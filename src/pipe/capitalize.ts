import { Pipe } from '@angular/core';
import {PipeTransform} from "../../node_modules/@angular/core/src/change_detection/pipe_transform";

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform{
  transform(value) {
    if (value) {
      const words = value.split(' ');

      value = words.map((word) => word.substring(0, 1).toUpperCase() + word.substring(1)).join(' ');
    }
    return value;
  }
}