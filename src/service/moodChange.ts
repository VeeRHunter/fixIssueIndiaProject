import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "rxjs";

@Injectable()
export class MoodChangeService extends RestfulService {

  protected getResourcePath(): string {
    return '/mood-change';
  }

  public getCurrent(): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/current`).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => observer.error(errors.json().errors)
      );
    });
  }

}
