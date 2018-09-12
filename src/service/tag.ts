import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "rxjs";

@Injectable()
export class TagService extends RestfulService {

  protected getResourcePath(): string {
    return '/tag';
  }

  public getByTag(tag: string): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/${tag}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

}
