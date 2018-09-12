import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PractitionerAccountService extends RestfulService {

  protected getResourcePath(): string {
    return '/practitioner-account';
  }

  public update(data: any): Observable<any> {
    return Observable.create((observer) => {
      this.put(`/`, data).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public uploadFile(id: string, fileType: string, data: any): Observable<any> {
    return Observable.create((observer) => {
      this.patch(`/${id}/${fileType}`, data).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

}