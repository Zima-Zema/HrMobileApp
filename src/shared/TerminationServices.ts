import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';

export interface ITerminationListVM {
    Culture: string,
    EmpId: number,
    CompanyId:number
}
export interface IPostTernimationVM{
    Culture: string,
    Id: number,
    CompanyId:number,
    PlanedDate:string
}

@Injectable()
export class TerminationServicesApi {
    private baseURL: string ='';
    //="http://enterprisehr-001-site1.ctempurl.com/";
    constructor(private _http: Http, private _storage: Storage) {
        this._storage.get("BaseURL").then((val) => {
            this.baseURL = val;
        });
    }

    GetTermination(body: ITerminationListVM): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/MobTermination/GetTerminationList`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    PostTerminationRequest(body: IPostTernimationVM): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/MobTermination/PostTerminationRequest`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }
}