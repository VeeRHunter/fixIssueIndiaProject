import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "rxjs";

@Injectable()
export class UserFollowService extends RestfulService {

  protected getResourcePath(): string {
    return '/user-follow';
  }

  public getCurrent(): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/current`).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => observer.error(errors.json().errors)
      );
    });
  }

  public unfollowUser(id): Observable<any> {
    return Observable.create((observer) => {
      this.delete(`/unfollow/${id}`).subscribe(
        (response) => observer.next(response.json()),
        (error) => observer.error(error.json().errors)
      );
    });
  }

}
