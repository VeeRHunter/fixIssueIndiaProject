import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication";
import {Http} from "@angular/http";
import {Events} from "ionic-angular";
import {App} from "ionic-angular";

@Injectable()
export class NotificationService extends RestfulService {

  public defaultItemsPerPage: number = 25;

  constructor(public http: Http,
              public authenticationService: AuthenticationService,
              public events: Events,
              protected app: App) {

    super(http, authenticationService, app);
  }

  protected getResourcePath(): string {
    return '/notification';
  }

  public getProfileNotifications(itemsPerPage: number = null, lastRequestDate: any = null): Observable<any> {
    if (!itemsPerPage) {
      itemsPerPage = this.defaultItemsPerPage;
    }
    return Observable.create((observer) => {
      this.get(`/current?itemsPerPage=${itemsPerPage}&lastRequestDate=${lastRequestDate}`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public countNotifications(): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/current/count`).subscribe(
        (response) => observer.next(response.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public markNotificationRead(body: any): Observable<any> {
    return Observable.create((observer) => {
      this.patch(`/read`, body).subscribe(
        (response) => observer.next(response),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public triggerNotificationCount(): Observable<any> {
    return Observable.create((observer) => {
      this.countNotifications().subscribe(
        (notificationsCount) => {
          //update local storage with new notificationCount
          let storedUserProfile = JSON.parse(localStorage.getItem('userProfile'));
          if (!storedUserProfile) {
            storedUserProfile = {notifications: notificationsCount};
          } else {
            storedUserProfile.notifications = notificationsCount;
          }
          localStorage.setItem('userProfile', JSON.stringify(storedUserProfile));

          this.events.publish('notification:counter:updated', parseInt(notificationsCount));
          observer.next(notificationsCount);
        },
        (errors) => {
          console.log(errors);
          observer.error(errors);
        });
    });
  }

}
