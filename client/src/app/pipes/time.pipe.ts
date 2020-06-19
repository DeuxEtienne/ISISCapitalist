import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    let res = '';
    
    let h = Math.floor(value / 3600000);
    let m = Math.floor((value % 3600000) / 60000);
    let s = Math.floor((value % 60000) / 1000);
    for (let i of [h, m, s]) {
      if (i == 0) res += '00:';
      else if (i < 10) res += '0' + i + ':';
      else res += i + ':';
    }

    let ms = Math.floor(value % 1000);
    if (ms < 10) res += '00' + ms;
    else if (ms < 100) res += '0' + ms;
    else res += ms;

    return res;
  }
}
