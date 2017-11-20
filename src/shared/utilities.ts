import 'rxjs/add/operator/map';
import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';
/*
  Generated class for the UtilitiesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
export interface IGetEmpCustody {
  EmpId: number
  Language: string,
  CompanyId: number
}
@Injectable()
export class UtilitiesProvider {
  private baseURL: string;
  constructor(public _http: Http, private _storage: Storage) {
    this._storage.get("BaseURL").then((val) => {
      this.baseURL = val;
      console.log("BaseUrl From Notity services>>>", this.baseURL);

    });
  }
  // get all Custody
  getCustodies(body: IGetEmpCustody): Observable<any> {
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
    return this._http.post(`${this.baseURL}newApi/Utilities/GetEmployeeCustody`, bodyString, { headers: headers })
      .map((res: Response) => {
        console.log("res.json ::: ", res.json());
        return res.json();
      });
      // .catch((err) => {
      //   console.log("the error in Service ::", err);
      //   return  Observable.of({error:err}) ;
      // });
  }

}
