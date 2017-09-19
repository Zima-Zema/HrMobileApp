import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import { Observable } from "rxjs";

export interface ITasks {
    Id: number
    EmpListId: number;
    TaskNo: number;
    TaskCat: number;
    Description: string;
    Priority: number;
    Status: number;
    Required: any;
    Unit: any;
    EmpId?: number;
    ManagerId?: number;
    AssignedTime: any;
    StartTime: any;
    Duration: number;
    CreatedUser: string;
    ModifiedUser: string;
    CreatedTime: any;
    ModifiedTime: any;
    ExpectDur: number;
    EndTime: any;
    SubPeriodId: number;
    CompanyId: number;
    //ChangeEmployee:boolean;
    //EmpList:string,
    //Employee:any,
    //Manager:any,
    //Period:any,
    //PeriodId:number,
   // SubPeriod: any,
    //TaskCategory: string,
    //isStart:boolean
}

export interface ITollen {
    Files: Array<any>;
    Source: string;
    TaskId: number;
    CompanyId: number;
    Language: string;
    FileDetails: Array<any>;
}

@Injectable()
export class TasksServicesApi {
    private baseURL: string = 'http://192.168.1.17:36207'
    // private baseURL: string = 'http://enterprise-hr.com'
    constructor(private _http: Http) {
    }

    //get all tasks
    getTasks(emp_id: number): Observable<any[]> {
        return this._http.get(`${this.baseURL}/newApi/MobileTasks/getAllTasks?emp_id=${emp_id}`).map((res: Response) => {
             console.log("res get tasks : ",res.json())
            return res.json();
           
        })
    }
    //save images and files
    saveData(body: ITollen): Observable<any> {
        let bodyString = JSON.stringify(body); // Stringify payload
        // console.log("the bloody bodyString>>",bodyString);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}/newApi/MobileTasks/PostFile`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("res.json() ::: ",res.json());
                return res.json();
            }).catch((err)=>{
                console.log("the bloody From Service>>",err);
                return err;
            });
    }
}