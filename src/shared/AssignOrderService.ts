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
export interface ISpacificLeaves {
    CompanyId: number,
    Culture: string,
}
export interface IAssignOrderVM {
    Id: number,
    EmpId: number,
    ManagerId: number,
    Duration: Number,
    AssignDate: Date,
    CalcMethod: number,
    LeaveTypeId: number,
    ExpiryDate: Date,
    TaskDesc: string,
    CompanyId: number,
    Language: string
}

export interface IEmpAssignDates{
    CompanyId: number,
    EmpId: number
}

export interface IDeleteRequest {
    Id: number,
    Language: string
}

@Injectable()

export class AssignOrderServicesApi {
    private baseURL: string;
    constructor(private _http: Http, private _storage: Storage) {
        this._storage.get("BaseURL").then((val) => {
            this.baseURL = val;
        });
    }

    GetEmpAssignOrders(body: IEmpAssignOrders): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetEmpAssignOrders`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }
    //
    GetMangersAssignOrders(body: IEmpAssignOrders): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetMangerAssignOrders`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    GetEmployeeForManger(body: IEmpAssignOrders): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetEmployeeForManger`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    GetSpacificLeaves(body: ISpacificLeaves): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetSpacificLeaveTypes`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    PostAssignOrder(body: IAssignOrderVM): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/PostAssignOrder`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    removeAssignOrder(body: IDeleteRequest): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/DeleteAssignOrder`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    editAssignOrder(body: IAssignOrderVM): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/EditAssignOrder`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    getEmpAssignDates(body:IEmpAssignDates):Observable<any>{
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetEmpAssignDates`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }

    GetLastEmpCalcusValue(body:IEmpAssignDates):Observable<number>{
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/AssignOrder/GetLastEmpCalcsMethod`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            })
    }
}