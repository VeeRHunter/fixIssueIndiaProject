import {Injectable} from "@angular/core";
import {ApiService} from "./api";
import {Observable} from "rxjs/Observable";
import {AuthenticationService} from "./authentication";
import {Http} from "@angular/http";
import {App} from "ionic-angular";

@Injectable()
export abstract class RestfulService extends ApiService {

  constructor(public http: Http,
              public authenticationService: AuthenticationService,
              protected app: App) {
    super(http, authenticationService, app);
  }

  public getAll(page: number = 1, itemsPerPage: number = 25): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/?page=${page}&itemsPerPage=${itemsPerPage}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public getOne(id: string): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/${id}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public updateOne(id: string, data: any): Observable<any> {
    return Observable.create((observer) => {
      this.put(`/${id}`, data).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public createOne(data: any): Observable<any> {
    return Observable.create((observer) => {
      this.post(`/`, data).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public deleteOne(id: string): Observable<any> {
    return Observable.create((observer) => {
      this.delete(`/${id}`).subscribe(
        (response) => observer.next(response),
        (error) => observer.error(error.json().errors)
      );
    });
  }
}
