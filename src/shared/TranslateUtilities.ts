import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class TranslateUtilities {
    /**
     *
     */
    constructor(private translationService: TranslateService) {

    }

    translate(msg:string):string{
        
        this.translationService.get(msg).subscribe(translation => {
            return translation;
          });
          return "";
    }
}