import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

export interface IRequestType {
    CompanyId: number,
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
    DayFraction: number,
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
    CantGreaterError:string,
    AllowedDaysError:string,
    PeriodError:string,
    percentage: number,
    NoWorkFlowError:string,
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
    NofDays:number
}
export interface ICancelVM {
    RequestId: number,
    Language: string,
    CompanyId: number
}
export interface IBreak {
    RequestId: number,
    Language: string,
    CompanyId: number,
    BreakEndDate: string,
    BreakNofDays: number
}
export interface IEdit {
    RequestId: number,
    Language: string,
    CompanyId: number,
    EditedStartDate: string,
    EditedEndDate: string,
    EditedReturnDate: string
}
export interface ILeavesTrans{
    EmpId:number,
    StartDate:Date,
    CompanyId:number,
    Culture:string
}


@Injectable()
export class LeaveServicesApi {
    private baseURL: string;
    constructor(private _http: Http, private _storage: Storage) {
        this._storage.get("BaseURL").then((val) => {
            this.baseURL = val;
        });
    }
    // get all leaves
    getLeaves(body: IRequestType): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/GetEmpLeaves`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    // get GetLeaveTypes
    GetLeaveTypes(body: IRequestType): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/GetLeaveTypes`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    //Get Request Leave Data
    GetRequestLeaveData(body: IRequestData): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/GetRequestLeaveData`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    //Insert LeaveRequest 
    addLeaveRequest(body: ILeaveRequest): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/PostLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    ///////////////////////////////////////////////////////////////////
    //Validation
    validateRequest(body: IValidate): Observable<IValidationMsg> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/ValidateLeaveRequest`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    ////////////////////////////////////////////////////////////////
    //Update LeaveRequest
    editLeaveRequest(body: ILeaveRequest): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/PutLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    ////////////////////////////////////////////////
    removeLeaveRequest(body: IDeleteRequest): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/DeleteLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {;
                return err;
            });
    }
    /////////////////////////////////////////////////////
    CancelAppLeave(body: ICancelVM) {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/CancelLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    ////////////////////////////////////////////////////////
    breakLeave(body: IBreak) {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/BreakLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    ///////////////////////////////////////////////////////
    editApprovedLeave(body: IEdit) {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/EditLeave`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }
    ///////////////////////////////////////////////////////
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

                    //remmber to check this for
                    for (let i = 0; i < calender.CustomHolidays.length; i++) {
                        var custDate = new Date(calender.CustomHolidays[i]);
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
        let endDate;
        let returnDate;
        let NofDays;
        let hasFraction: boolean;
        let hasNofDays: boolean;
        let bloodyStartDate = startDate;
        //
        hasFraction = (leaveType && fraction != null);
        hasNofDays = (leaveType && noOfDayes != null);
        //
        if (startDate && leaveType.AllowFraction) {  //لو اجازه عارضه
            startDate = new Date(startDate)

            if (hasNofDays || (hasNofDays && fraction == 0)) {
                NofDays = Number.parseInt(noOfDayes);
                endDate = this.addDays(startDate, NofDays, calender, leaveType);
                endDate = new Date(endDate)
                returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType)
            }
            if (hasFraction) {
                if (fraction == 1 || fraction == 2) {
                    endDate = new Date(startDate)
                    returnDate = endDate;
                }
                else if (fraction == 3 || fraction == 4) {
                    endDate = new Date(startDate);
                    returnDate = this.addDays(bloodyStartDate, 2, calender, leaveType);
                    startDate = new Date(startDate);
                }
            }
        }
        else { //لو مش اجازه عارضه
            NofDays = Number.parseFloat(noOfDayes) + (fraction ? Number.parseFloat(fraction) : 0);
            endDate = this.addDays(bloodyStartDate, NofDays, calender, leaveType);
            returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType);
        }

        return {
            startDate: startDate,
            endDate: endDate,
            returnDate: returnDate
        }
    }
    // calcDates(startDate, noOfDayes, calender, leaveType, fraction) { //Old One
    //     let startHours;
    //     let startMin;
    //     let NofHours;
    //     let endDate;
    //     let returnDate;
    //     let NofDays;
    //     let hasFraction: boolean;
    //     let hasNofDays: boolean;
    //     let calc_Date;
    //     let WorkStartTimeString = calender.WorkStartTime;
    //     let WorkStartHour: number;
    //     let WorkStartMin: number;
    //     let WorkingHours = calender.WorkHours;
    //     let MilliDate;
    //     let bloodyStartDate = startDate;
    //     //
    //     hasFraction = (leaveType && fraction != null);
    //     hasNofDays = (leaveType && noOfDayes != null);
    //     //
    //     if (startDate && leaveType.AllowFraction) {  //لو اجازه عارضه
    //         WorkStartHour = new Date(WorkStartTimeString).getHours(); //8
    //         WorkStartMin = new Date(WorkStartTimeString).getMinutes(); //30 or 0
    //         startDate = new Date(startDate).setHours(WorkStartHour, WorkStartMin, 0, 0); //12-10 8:00

    //         if (hasNofDays || (hasNofDays && fraction == 0)) {
    //             NofDays = Number.parseInt(noOfDayes);
    //             endDate = this.addDays(startDate, NofDays, calender, leaveType);
    //             let WorkEndHour: number = new Date(endDate).getHours(); //8
    //             endDate = new Date(endDate).setHours((WorkEndHour + WorkingHours), WorkStartMin, 0, 0);//16 //For hours
    //             returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType).setHours(WorkStartHour, WorkStartMin, 0, 0);
    //         }
    //         if (hasFraction) {
    //             if (fraction >= 0) {
    //                 let WorkEndHour: number = new Date(startDate).getHours(); //8
    //                 endDate = new Date(startDate).setHours((WorkEndHour + (fraction * WorkingHours)), WorkStartMin, 0, 0);
    //                 returnDate = endDate;
    //             }
    //             else if (fraction < 0) {
    //                 let WorkEndHour: number = new Date(startDate).getHours(); //8
    //                 endDate = new Date(startDate).setHours((WorkEndHour + WorkingHours), WorkStartMin, 0, 0);//16
    //                 returnDate = this.addDays(bloodyStartDate, 2, calender, leaveType).setHours(WorkStartHour, WorkStartMin, 0, 0);

    //                 startDate = new Date(startDate).setHours(((WorkEndHour + WorkingHours) + (fraction * WorkingHours)), WorkStartMin, 0, 0);
    //             }
    //         }
    //     }
    //     else { //لو مش اجازه عارضه
    //         NofDays = Number.parseFloat(noOfDayes) + (fraction ? Number.parseFloat(fraction) : 0);
    //         endDate = this.addDays(bloodyStartDate, NofDays, calender, leaveType);
    //         returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType);
    //     }
    //     // // //
    //     // if ((startDate && !hasFraction) || (startDate && fraction == 0)) {
    //     //     returnDate = this.addDays(bloodyStartDate, NofDays + 1, calender, leaveType);
    //     // }

    //     return {
    //         startDate: startDate,
    //         endDate: endDate,
    //         returnDate: returnDate
    //     }
    // }

    getOffDays(calender) {
        let year = new Date().getFullYear();
        let offdays: Array<any> = [];
        calender.CustomHolidays.forEach(element => {
            offdays.push(new Date(element));
        });
        calender.StanderdHolidays.forEach((ele) => {
            offdays.push(new Date(year, ele.SMonth - 1, ele.SDay))
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


    addDaysToDate(date, days) {
        let dat = new Date(date);
        return new Date(dat.setDate(dat.getDate() + days));
    }

    getDates(startDate, stopDate) {
        var dateArray = new Array();
        startDate = new Date(startDate).setHours(0, 0, 0, 0);
        stopDate = new Date(stopDate).setHours(0, 0, 0, 0);
        var currentDate = startDate;

        while (new Date(currentDate) <= new Date(stopDate)) {
            dateArray.push(currentDate)
            currentDate = this.addDaysToDate(currentDate, 1).setHours(0, 0, 0, 0);
        }
        return dateArray;
    }

    cutLeave(startDate, actualReturn, noFDays, endDate, calender, leaveType, balance) {
        let WorkStartHour = new Date(calender.WorkStartTime).getHours();
        let WorkStartMin = new Date(calender.WorkStartTime).getMinutes(); //30 or 0
        let WorkingHours = calender.WorkHours;
        let holidays = this.getOffDays(calender);
        let dates = this.getDates(new Date(startDate), this.addDaysToDate(actualReturn, -1));
        holidays.forEach((ele) => {
            dates = dates.filter((date) => new Date(date).toLocaleDateString() !== new Date(ele).toLocaleDateString());
        });
        let dayesAfterCut = dates.length;
        balance += noFDays - dayesAfterCut;
        noFDays = dayesAfterCut;
        endDate = this.addDays(startDate, noFDays, calender, leaveType); //new Date(startDate).setDate(new Date(startDate).getDate() + noFDays - 1);
        return {
            noFDays: noFDays,
            endDate: new Date(endDate).setHours(WorkStartHour + WorkingHours, WorkStartMin, 0, 0),
            balance: balance
        }

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
    /////////////////////////////////////////////////
    getHolidays(compId: number): Observable<any[]> {
        return this._http.get(`${this.baseURL}newApi/Leaves/GetHolidays?compId=${compId}`).map((res: Response) => {
            return res.json();
        }).catch((err) => {
            return err;
        })
    }
    //////////////////////////////////////////////
     getLeaveTrans(body: ILeavesTrans): Observable<any> {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Leaves/GetLeavesTrans`, bodyString, { headers: headers })
            .map((res: Response) => {
                return res.json();
            }).catch((err) => {
                return err;
            });
    }

}