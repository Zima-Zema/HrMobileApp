import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptionsArgs, Response, RequestMethod } from "@angular/http";
import { Observable } from "rxjs";
import { Storage } from '@ionic/storage';

export interface ILogin {
    UserName: string;
    Password: string;
    ResetPassword: string;
    confirm: string
}

@Injectable()
export class LoginServiceApi {

    private baseURL: any;
    private Token: any;
    private storageKeys: string[];
    private loginReturnData: any;

    constructor(private _http: Http, private _storage: Storage) {

    }

    logIn(companyName: string, userName: string, password: string) {

        return new Promise((resolve, reject) => {
            this._storage.keys().then((val) => {
                return new Promise((resolve, reject) => {
                    this.storageKeys = val;
                    resolve();
                });
            }).then(
                () => {
                    return new Promise((resolve, reject) => {
                        if (this.storageKeys.indexOf("BaseURL") == -1) {
                            //if (companyName.toUpperCase() == "DefaultCompany".toUpperCase()) {
                            this.baseURL = (`http://${companyName}/`);
                            this._storage.set("BaseURL", this.baseURL).then(() => {
                                this._storage.set("CompanyName", companyName).then(() => {
                                    resolve();
                                });
                            });
                            //}
                            // else {
                            //     resolve("Invalid Company Name !!");
                            // }
                        }
                        else {
                            this._storage.get("BaseURL").then((val) => {
                                this.baseURL = val;
                                resolve();
                            });
                        }
                    })
                }
                ).then((data) => {
                    return new Promise((resolve, reject) => {
                        if (data) {
                            resolve(data);
                        }
                        else {
                            if (this.storageKeys.indexOf("Token") == -1) {
                                this.getToken(userName, password).subscribe(
                                    res => {
                                        this.Token = res.access_token;
                                        this._storage.set("Token", this.Token).then(() => {
                                            resolve();
                                        });
                                    },
                                    error => {
                                        console.log(error);
                                        if (error.status == 404) {
                                            resolve("Error in Service .. Try agian later !!");
                                        }
                                        else if (error.status == 403) {
                                            resolve("Error in Service .. Try agian later !!");
                                        }
                                        else if (error.status == 500) {
                                            resolve("Error in Server .. Try agian later !!");
                                        }
                                        else if (error.type == 3) {
                                            this._storage.clear();
                                            resolve("Error in Service URL .. Please Contact Customer Service !!");
                                        }
                                        else {
                                            resolve(JSON.parse(error._body).error_description);
                                        }
                                    });
                            }
                            else {
                                this._storage.get("Token")
                                    .then(val => {
                                        this.Token = val;
                                        resolve();
                                    });
                            }
                        }
                    });
                }).then((data) => {
                    if (data) {
                        resolve(data);
                    }
                    else {
                        this.Authenticate(userName, password)
                            .then((error) => {
                                if (error) {
                                    resolve(error);
                                }
                                else {
                                    resolve(this.loginReturnData);
                                }
                            });
                    }
                });
        })
    }


    getBaseURL(companyName: string) {
        return new Promise((resolve, reject) => {
            if (companyName.toUpperCase() == "DefaultCompany".toUpperCase()) {
                this.baseURL = ('http://www.enterprise-hr.com/');
                this._storage.set("BaseURL", this.baseURL).then(() => {
                    resolve();
                });
            }
        });
    }

    getToken(userName: string, password: string): Observable<any> {
        let header = new Headers();
        header.append('Content-Type', 'application/x-www-form-urlencoded');
        let options: RequestOptionsArgs = { headers: header, method: RequestMethod.Post, };
        var body = `UserName=${userName}&Password=${password}&grant_type=password`;
        return this._http.post(`${this.baseURL}token`, body, options)
            .map((res: Response) => {
                return res.json();
            });
    }

    Authenticate(userName: string, password: string) {
        return new Promise((resolve, reject) => {
            let header = new Headers();
            header.append('Content-Type', 'application/json');
            header.append('Authorization', `bearer ${this.Token}`);
            let options: RequestOptionsArgs = { headers: header, method: RequestMethod.Post, };
            let body = {
                Username: userName,
                Password: password
            }
            this._http.post(`${this.baseURL}newApi/Security/Login`, body, options)
                .map(res => {
                    return res.json();
                }).subscribe(
                data => {
                    this.loginReturnData = data;
                    resolve();
                },
                error => {
                    if (error.status == 500) {
                        resolve("Error in Server .. Try agian later !!");
                    }
                    else if (error.status == 403) {
                        resolve("Incorrect Username or Password !!");
                    }
                    resolve(error._body);
                });
        });
    }

    resetPassword(body: ILogin) {
        let bodyString = JSON.stringify(body);
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this._http.post(`${this.baseURL}newApi/Security/Reset`, bodyString, { headers: headers }).retry(1)
            .map((res: Response) => {
                console.log("Res>>>", res.json());
                return res.json();

            }).catch((err) => {
                console.log("the bloody From Service>>", err);
                return err;
            });
    }

}