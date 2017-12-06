import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Storage } from '@ionic/storage';

export interface INotifyParams {
    UserName: string;
    Language: string;
    CompanyId: number;
}

export interface INotification {
    Id :number;
    From :string;
    Message:string;
    MoreInfo:string;
    PicUrl:string;
    Read :boolean;
    SentDate:Date;
}
export interface IUpdateNotification{
     Id:number;
     Culture:string;
     CompanyId:number;
     UserName:string;
}
export interface ODataNotification{
    metadata:string;
    value:Array<INotification>
}
@Injectable()
export class NotificationServiceApi {

    perPage: number = 10;
    private baseURL: string;
    
    constructor(private _http: Http,private _storage: Storage) {
        this._storage.get("BaseURL").then((val) => {
                                this.baseURL = val;                              
                            });
    }

    getNotifications(start: number = 0,body:INotifyParams ):Observable<ODataNotification> {
        //let bodyString = JSON.stringify(body);
         let bodyString = `UserName=${body.UserName}&Language=${body.Language}&CompanyId=${body.CompanyId}`;
         console.log("bodyString>>>>",bodyString);
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        return this._http.post(`${this.baseURL}odata/WebMobLogs?$top=${this.perPage}&$skip=${start}&$orderby=SentDate desc`, bodyString, { headers: headers }).retry(1)
            .map((res: Response) => {
                console.log("Res>>>", res.json());
                return res.json();

            }).catch((err) => {
                console.log("the bloody From Service>>", err);
                return err;
            });
    }

    getNotificationCount(body:INotifyParams){
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Notifications/Count`, bodyString, { headers: headers }).retry(1)
            .map((res: Response) => {
                console.log("Res>>>", res.json());
                return res.json();

            }).catch((err) => {
                console.log("the bloody From Service>>", err);
                return err;
            });
    }

    updateNotification(body:IUpdateNotification){
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Notifications/Update`, bodyString, { headers: headers }).retry(1)
            .map((res: Response) => {
                console.log("Res>>>", res.json());
                return res.json();

            }).catch((err) => {
                console.log("the bloody From Service>>", err);
                return err;
            });
    }

}