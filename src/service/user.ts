import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {RestfulService} from "./restful";

@Injectable()
export class UserService extends RestfulService {

  protected getResourcePath(): string {
    return '/user';
  }

  public getCurrentUser(): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/current`).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => observer.error(errors.json().errors)
      );
    });
  }

  public getBlockedUsers(): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/block`).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => observer.error(errors.json().errors)
      );
    });
  }

  public findUserEmailByEmail(emailAddress): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/email/${emailAddress}`).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => observer.error(errors.json().errors)
      );
    });
  }

  public updateCurrentPassword(oldPassword: string, newPassword: string, confirmationPassword: string): Observable<any> {
    return Observable.create((observer) => {
      this.patch(`/change-password`, {
        old_password: oldPassword,
        new_password: newPassword,
        confirmation_new_password: confirmationPassword
      }).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => {
          observer.error(errors.json().errors);
        }
      );
    });
  }
}
