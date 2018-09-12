import {Injectable} from "@angular/core";
import {ApiService} from "./api";
import {Observable} from "../../node_modules/rxjs/Observable";

@Injectable()
export class ShareService extends ApiService {
  protected getResourcePath(): string {
    return '/share';
  }

  public shareByEmail(emailAddress: string): Observable<any> {
    return Observable.create((observer) => {
      this.post('/email', {
        email_address: emailAddress
      }).subscribe(
        (data) => observer.next(data.json().data),
        (error) => observer.error(error.json().errors)
      )
    });
  }
}