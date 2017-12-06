import { Pipe, PipeTransform } from '@angular/core';

export enum ImageStatusEnum {
  "assets/img/grey.png" = 1, "assets/img/yellow.png"=2  , "assets/img/green.png"=6, "assets/img/red.png"=9 ,
}

@Pipe({
  name: 'imagePipe',
})
export class ImagePipe implements PipeTransform {
transform(stat: number, ApprovStat:string) {
    return ImageStatusEnum[stat];
  }
}
