import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

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
    Draft = 1, Submit, ApprovalEmployeeReview, ManagerReview, Accepted, Approved, CancelBeforeAccepted, CancelAfterAccepted, Rejected
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
    StartDate: string,
    Culture: string,
    EndDate: string,
    ReturnDate: string,
    ReasonDesc: string,
    Type: string,
    ApprovalStatus: ApprovalStatusEnum
}

export interface IValidationMsg {
    AssignError: string,
    IsReplacementError: string,
    ReplacmentError: string,
    WaitingError: string,
    WaitingMonth: string,
    HasRequestError: string,
    StarsError: string,
    Stars: number,
    DeptPercentError: string,
    percentage: number,
    IsError: boolean
}
export interface IValidate {
    Id: number,
    TypeId: number,
    EmpId: number,
    CompanyId: number,
    EndDate: string,
    StartDate: string,
    Culture: string,
    ReplaceEmpId: number,
}
export interface ICancelVM {
    RequestId: number,
    Language: string,
    CompanyId: number
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
    ///////////////////////////////////////////////////////////////////
    //Validation
    validateRequest(body: IValidate): Observable<IValidationMsg> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/ValidateLeaveRequest`, bodyString, { headers: headers })
            .map((res: Response) => {
                //console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }
    ////////////////////////////////////////////////////////////////
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
    ////////////////////////////////////////////////
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
    /////////////////////////////////////////////////////
    CancelAppLeave(body: ICancelVM) {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/Leaves/CancelLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json ::: ", res.json());
                return res.json();
            }).catch((err) => {
                console.log("the error in Service ::", err);
                return err;
            });
    }

    addDays(startDate, noOfDayes, calender, leaveType): Date {
        let count = 0;
        let result = new Date(startDate);
        //console.log(`the bloody result from addDays ${result}`)
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

    calcDates(startDate, noOfDayes, calender, leaveType, fraction) {
        let startHours;
        let startMin;
        let NofHours;
        let endDate;
        let returnDate;
        let NofDays;
        let hasFraction: boolean;
        let hasNofDays: boolean;
        let calc_Date;
        let WorkStartTimeString = calender.WorkStartTime;
        let WorkStartHour: number;
        let WorkingHours = calender.WorkHours;
        let MilliDate;
        let bloodyStartDate = startDate;
        //
        hasFraction = (leaveType && fraction != null);
        hasNofDays = (leaveType && noOfDayes != null);
        console.log(`hasFraction : ${hasFraction} , hasNofDays : ${hasNofDays}`);
        console.log(`calcDates startDate : ${startDate}`)
        //
        if (startDate && leaveType.AllowFraction) {  //لو اجازه عارضه
            WorkStartHour = new Date(WorkStartTimeString).getHours(); //8
            startDate = new Date(startDate).setHours(WorkStartHour, 0, 0, 0); //12-10 8:00

            console.log("calcDates After startDate : ", startDate);
            if (hasNofDays || (hasNofDays && fraction == 0)) {
                console.log("yaaaaaaaaaaah, hasNofDays");
                NofDays = Number.parseInt(noOfDayes);
                endDate = this.addDays(startDate, NofDays, calender, leaveType);
                let WorkEndHour: number = new Date(endDate).getHours(); //8
                endDate = new Date(endDate).setHours((WorkEndHour + WorkingHours), 0, 0, 0);//16 //For hours
                returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType).setHours(WorkStartHour, 0, 0, 0);
            }
            if (hasFraction && fraction != 0) {
                console.log("yaaaaaaaaaaah, hasFraction");
                if (fraction >= 0) {
                    let WorkEndHour: number = new Date(startDate).getHours(); //8
                    endDate = new Date(startDate).setHours((WorkEndHour + (fraction * WorkingHours)), 0, 0, 0);
                    returnDate = endDate;
                }
                else if (fraction < 0) {
                    let WorkEndHour: number = new Date(startDate).getHours(); //8
                    endDate = new Date(startDate).setHours((WorkEndHour + WorkingHours), 0, 0, 0);//16
                    returnDate = this.addDays(bloodyStartDate, 2, calender, leaveType).setHours(WorkStartHour, 0, 0, 0);

                    startDate = new Date(startDate).setHours(((WorkEndHour + WorkingHours) + (fraction * WorkingHours)), 0, 0, 0);
                }
            }
        }
        else { //لو مش اجازه عارضه
            NofDays = Number.parseFloat(noOfDayes) + (fraction ? Number.parseFloat(fraction) : 0);
            endDate = this.addDays(bloodyStartDate, NofDays, calender, leaveType);
            returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType);
        }
        // // //
        // if ((startDate && !hasFraction) || (startDate && fraction == 0)) {
        //     returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType);
        // }

        console.log(`Before Return: startDate: ${startDate} // endDate: ${endDate} // returnDate ${returnDate}`)
        return {
            startDate: startDate,
            endDate: endDate,
            returnDate: returnDate
        }
    }

    getOffDays(calender) {
        let year = new Date(calender.WorkStartTime).getFullYear();
        let offdays: Array<any> = [];
        calender.CustomHolidays.forEach(element => {
            offdays.push(new Date(element));
        });
        calender.StanderdHolidays.forEach((ele) => {
            offdays.push(new Date(year, ele.SMonth, ele.SDay))
        })
        for (let month = 1; month <= 12; month++) {
            let tdays = new Date(year, month, 0).getDate();
            for (let date = 1; date <= tdays; date++) {

                let day = new Date();
                day.setDate(date);
                day.setMonth(month - 1);
                day.setFullYear(year);
                if (day.getDay() == calender.weekend1 || day.getDay() == calender.weekend2) {
                    offdays.push(day);
                }
            }
        }
        return offdays;
    }



    getallDays(year) {
        var offdays: Array<any> = [];
        let i = 0;
        for (let month = 1; month <= 12; month++) {
            let tdays = new Date(year, month, 0).getDate();
            for (let date = 1; date <= tdays; date++) {
                let smonth = (month < 10) ? "0" + month : month;
                let sdate = (date < 10) ? "0" + date : date;
                let dd = year + "-" + smonth + "-" + sdate;
                let day = new Date();
                day.setDate(date);
                day.setMonth(month - 1);
                day.setFullYear(year);
                offdays[i++] = dd;
            }
        }
        return offdays;
    }




    getInitialDate(initialDate: Date, calender): Date {
        //20/10 fri 5 
        if (calender.weekend1 < calender.weekend2) {
            if (initialDate.getDay() == calender.weekend1) {
                initialDate = new Date(new Date(initialDate.getTime() + (2 * 24 * 60 * 60 * 1000)).setHours(0, 0));
                return initialDate;
            } else if (initialDate.getDay() == calender.weekend2) {
                initialDate = new Date(new Date(initialDate.getTime() + (1 * 24 * 60 * 60 * 1000)).setHours(0, 0));
                return initialDate;
            } else {
                return initialDate;
            }
        }
        else {
            if (initialDate.getDay() == calender.weekend1) {
                initialDate = new Date(new Date(initialDate.getTime() + (1 * 24 * 60 * 60 * 1000)).setHours(0, 0));
                return initialDate;
            } else if (initialDate.getDay() == calender.weekend2) {
                initialDate = new Date(new Date(initialDate.getTime() + (2 * 24 * 60 * 60 * 1000)).setHours(0, 0));
                return initialDate;
            } else {
                return initialDate;
            }
        }
    }
    // OriginalcalcDates(startDate, noOfDayes, calender, leaveType, fraction) {
    //     let startHours;
    //     let startMin;
    //     let NofHours;
    //     let endDate;
    //     let returnDate;
    //     let NofDays = Number.parseFloat(noOfDayes) + (fraction ? Number.parseFloat(fraction) : 0);
    //     let hasFraction = (leaveType && leaveType.AllowFraction && (!Number.isInteger(NofDays)));
    //     if (hasFraction) {
    //         startHours = new Date(startDate).getHours();
    //         startMin = new Date(startDate).getMinutes();
    //         if (startHours <= (new Date(calender.WorkStartTime).getHours())) {
    //             if (calender.WorkStartTime) {

    //                 //if (calender.WorkStartTime.indexOf('/Date') != -1) {
    //                 startHours = new Date(calender.WorkStartTime).getHours();
    //                 startMin = new Date(calender.WorkStartTime).getMinutes();
    //                 startDate = (new Date(startDate)).setHours(startHours, startMin);
    //                 //startDate = new Date((new Date(startDate)).setMinutes(startMin));
    //                 //}
    //             }
    //         }
    //         //
    //         NofHours = ((NofDays) != 0 ? NofDays % Number.parseInt(NofDays.toString()) : NofDays);
    //         if (calender.WorkHours != undefined)
    //             NofHours *= calender.WorkHours;
    //     }
    //     if (startDate && NofDays) {
    //         endDate = this.addDays(startDate, NofDays, calender, leaveType);
    //         returnDate = this.addDays(startDate, NofDays + 1, calender, leaveType);

    //         if (hasFraction) {
    //             var NofMin = (Number.parseInt(NofHours) != 0 ? NofHours % Number.parseInt(NofHours) : NofHours);

    //             returnDate = this.addDays(startDate, NofDays, calender, leaveType);
    //             returnDate = (new Date(returnDate)).setHours(startHours + NofHours);
    //             returnDate = new Date((new Date(returnDate)).setMinutes(startMin + (NofMin * 60)));

    //             endDate = (new Date(endDate)).setHours(startHours + NofHours);
    //             endDate = new Date((new Date(endDate)).setMinutes(startMin + (NofMin * 60)));
    //         }
    //     }
    //     return {
    //         startDate: startDate,
    //         endDate: endDate,
    //         returnDate: returnDate
    //     }
    // }
}