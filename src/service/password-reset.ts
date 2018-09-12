import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {Http, RequestOptions, Headers} from "@angular/http";

@Injectable()
export class PasswordResetService {


  constructor(private http: Http) {
  }

  protected getResourcePath(): string {
    return '/reset-password';
  }

  public postResetPassword(postObject: any): Observable <any> {
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
      this.http.post(`${baseApi}/reset-password/`, JSON.stringify(postObject)).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public performResetPasswordWithPincode(body: any): Observable<any> {
    let baseApi = environment.api_host;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let requestOptions = new RequestOptions();
    //requestOptions.headers = headers;

    return Observable.create((observer) => {
      this.http.patch(`${baseApi}/reset-password/pincode`, JSON.stringify(body), requestOptions).subscribe(
        (response) => observer.next(response),
        (error) => observer.error(error.json().errors)
      );
    });
  }


}
