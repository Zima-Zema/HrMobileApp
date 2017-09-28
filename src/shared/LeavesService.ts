import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';


export interface IRequestType {
    CompId: number,
    Culture: string,
    EmpId: number
}

export interface IRequestData {
    CompanyId: number,
    TypeId: number,
    EmpId: number,
    RequestId: number,
    Culture: string,
    StartDate: string
}




@Injectable()
export class LeaveServicesApi {

    private baseURL: string =
    //'http://192.168.1.17:36207';
    //
    "http://www.enterprise-hr.com";


    constructor(private _http: Http, private _storage: Storage) {
    }

    // get all leaves
    getLeaves(body: IRequestType): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/GetEmpLeaves`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }
    // get GetLeaveTypes
    GetLeaveTypes(body: IRequestType): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/GetLeaveTypes`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }
    //Get Request Leave Data
    GetRequestLeaveData(body: IRequestData): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/GetRequestLeaveData`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }

}