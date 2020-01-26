import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'signedNumber'
})
export class SignedNumberPipe implements PipeTransform {

    transform(value: number, isFirst: boolean = false): string | number {
        if (value === null || value === undefined) {
            return '';
        }
        if (value >= 0 && !isFirst) {
            return `+ ${value}`;
        }
        if (value < 0) {
            return `- ${-1 * value}`;
        }
        return value;
    }
}
