import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {Http} from "@angular/http";

@Injectable()
export class ProfileCreateService {

  constructor(private http: Http) {
  }

  public createProfile(data: any): Observable<any> {
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
      this.http.post(`${baseApi}/profile/`, JSON.stringify(data)).subscribe(
        (response) => observer.next(response.json().data),
        (error) => {
          observer.error(error.json().errors);
          console.log(error);
        }
      );
    });
  }

}
