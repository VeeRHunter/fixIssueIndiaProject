import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "rxjs";

@Injectable()
export class PostService extends RestfulService {

  public defaultItemsPerPage: number = 25;

  protected getResourcePath(): string {
    return '/post';
  }

  public postReply(data): Observable<any> {
    return Observable.create((observer) => {
      this.post(`/reply`, data).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public getTreeOfLife(itemsPerPage: number = null, lastRequestDate: any = null): Observable<any> {
    if (!itemsPerPage) {
      itemsPerPage = this.defaultItemsPerPage;
    }
    return Observable.create((observer) => {
      this.get(`/latest?itemsPerPage=${itemsPerPage}&lastRequestDate=${lastRequestDate}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public getOwnTreeOfLife(itemsPerPage: number = null, lastRequestDate: any = null): Observable<any> {
    if (!itemsPerPage) {
      itemsPerPage = this.defaultItemsPerPage;
    }
    return Observable.create((observer) => {
      this.get(`/own/latest?itemsPerPage=${itemsPerPage}&lastRequestDate=${lastRequestDate}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public getUserPosts(profileId: string, itemsPerPage: number = null, lastRequestDate: any = null): Observable<any> {
    if (!itemsPerPage) {
      itemsPerPage = this.defaultItemsPerPage;
    }
    return Observable.create((observer) => {
      this.get(`/profile/${profileId}/latest?itemsPerPage=${itemsPerPage}&lastRequestDate=${lastRequestDate}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public getBranchView(itemsPerPage: number =null, lastRequestDate: any = null): Observable<any> {
    if (!itemsPerPage) {
      itemsPerPage = this.defaultItemsPerPage;
    }
    return Observable.create((observer) => {
      this.get(`/following/latest?itemsPerPage=${itemsPerPage}&lastRequestDate=${lastRequestDate}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public getPractitionerHelpList(itemsPerPage: number =null, lastRequestDate: any = null): Observable<any> {
    if (!itemsPerPage) {
      itemsPerPage = this.defaultItemsPerPage;
    }
    return Observable.create((observer) => {
      this.get(`/practitioner?itemsPerPage=${itemsPerPage}&lastRequestDate=${lastRequestDate}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

}
