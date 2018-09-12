import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "rxjs";

@Injectable()
export class ProfileService extends RestfulService {
  protected getResourcePath(): string {
    return '/profile';
  }

  public getCurrent(): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/current`).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => observer.error(errors.json().errors)
      );
    });
  }

  public searchUsersByNameAndType(searchName: string,
                                  isPractitioner: boolean = false,
                                  pageNumber: number = 1,
                                  usersPerPage: number = 25): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/search/name?name=${searchName}&practitioner=${isPractitioner}&itemsPerPage=${usersPerPage}&page=${pageNumber}`).subscribe(
        (response) => observer.next(response.json().data),
        (errors) => observer.error(errors.json().errors)
      );
    });
  }

  public uploadImage(data: any): Observable<any> {
    return Observable.create((observer) => {
      this.post(`/image`, data).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }
}
