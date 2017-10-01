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
export interface IDeleteRequest {
    Id: number,
    Language: string
}
export enum ApprovalStatusEnum {
    New = 1, Submit, ApprovalEmployeeReview, ManagerReview, Accepted, Approved, CancelBeforeAccepted, CancelAfterAccepted, Rejected
}
export interface ILeaveRequest {
    Id: number,
    TypeId: number,
    ReqReason: number,
    BalBefore: number,
    BalanceBefore: number,
    submit: boolean,
    CompanyId: number,
    EmpId: number,
    ReplaceEmpId: number,
    NofDays: number,
    FractionDays: number,
    StartDate: Date,
    Culture: string,
    EndDate: Date,
    ApprovalStatus: ApprovalStatusEnum
}


@Injectable()
export class LeaveServicesApi {

    private baseURL: string =
    'http://192.168.1.17:36207';
    //
    // "http://www.enterprise-hr.com";


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

    //Insert LeaveRequest 
    addLeaveRequest(body: ILeaveRequest): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/PostLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }
    //Update LeaveRequest
    editLeaveRequest(body: ILeaveRequest): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/PutLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }

    removeLeaveRequest(body: IDeleteRequest): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/DeleteLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }

    //this method return endDate
    //so returnDate = addDays(startDate, (Number(NofDays) + 1)); 
    addDays(startDate, noOfDayes, calender, leaveType): Date {
        let count = 0;
        let result = new Date(startDate);
        noOfDayes--;
        if (calender && leaveType) {
            while (count < noOfDayes) {
                result.setDate(result.getDate() + 1);
                let isHoliday = false;
                if (leaveType.ExDayOff && (result.getDay() == calender.weekend1 || result.getDay() == calender.weekend2)) {
                    isHoliday = true;
                }
                if (leaveType.ExHolidays) {
                    for (let i = 0; i < calender.CustomHolidays.length; i++) {
                        var custDate = new Date(parseInt(calender.CustomHolidays[i].substr(6)));
                        if (custDate.getFullYear() == result.getFullYear() && custDate.getMonth() == result.getMonth() && custDate.getDate() == result.getDate())
                            isHoliday = true;
                    }
                    for (let i = 0; i < calender.StanderdHolidays.length; i++) {
                        if (calender.StanderdHolidays[0].SMonth == (result.getMonth() + 1) && calender.StanderdHolidays[0].SDay == result.getDate())
                            isHoliday = true;
                    }
                }
                if (!isHoliday) {
                    count++;
                }

            }
        }
        else {
            result.setDate(result.getDate() + noOfDayes);
        }
        return result;
    }

    //getNofDays
    //Number.parseFloat(nofDays) + (fraction ? Number.parseFloat(fraction) : 0);
    calcDates(startDate, noOfDayes, calender, leaveType, fraction) {
        let startHours;
        let startMin;
        let NofHours;
        let endDate;
        let returnDate;

        let NofDays = Number.parseFloat(noOfDayes) + (fraction ? Number.parseFloat(fraction) : 0);
        let hasFraction = (leaveType && leaveType.AllowFraction && (!Number.isInteger(NofDays)));
        if (hasFraction) {
            startHours = new Date(startDate).getHours();
            startMin = new Date(startDate).getMinutes();
            if (startHours == 0) {
                if (calender.WorkStartTime) {
                    if (calender.WorkStartTime.indexOf('/Date') != -1) {
                        startHours = new Date(parseInt(calender.WorkStartTime.substr(6))).getHours();
                        startMin = new Date(parseInt(calender.WorkStartTime.substr(6))).getMinutes();

                        startDate = (new Date(startDate)).setHours(startHours);
                        startDate = new Date((new Date(startDate)).setMinutes(startMin));

                    }
                }
            }
            //

            NofHours = (Number.parseInt(NofDays.toString()) != 0 ? NofDays % Number.parseInt(NofDays.toString()) : NofDays); //check for div by 0
            if (calender.WorkHours != undefined) NofHours *= calender.WorkHours;
            NofDays = Number.parseInt(NofDays.toString());
        }
        if (startDate && !isNaN(NofDays)) {
            endDate = this.addDays(startDate, Number(NofDays.toString()), calender, leaveType);
            returnDate = this.addDays(startDate, Number(NofDays.toString()) + 1, calender, leaveType);
            if (hasFraction) {
                var NofMin = (Number.parseInt(NofHours) != 0 ? NofHours % Number.parseInt(NofHours) : NofHours);
                returnDate = (new Date(returnDate)).setHours(startHours + NofHours);
                returnDate = new Date((new Date(returnDate)).setMinutes(startMin + (NofMin * 60)));

            }
        }
        return {
            startDate:startDate,
            endDate:endDate,
            returnDate:returnDate
        }

    }



}