import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';

export interface IEmpAssignOrders {
    CompanyId: number,
    Culture: string,
    EmpId: number
}
@Injectable()

export class AssignOrderServicesApi {
    private baseURL: string ;
    //= 'http://192.168.1.146:36207/';
    constructor(private _http: Http,private _storage: Storage) {
        this._storage.get("BaseURL").then((val) => {
            this.baseURL = val;
            console.log("BaseUrl From Notity services>>>", this.baseURL);
        });
    }

    GetEmpAssignOrders(body: IEmpAssignOrders): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetEmpAssignOrders`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }
    //
    GetMangersAssignOrders(body: IEmpAssignOrders): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetMangerAssignOrders`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }
}