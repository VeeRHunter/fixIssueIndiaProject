import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {Subject} from "rxjs/Subject";
import {environment} from "../environments/environment";

@Injectable()
export class AuthenticationService {
  private _authenticationSubject = new Subject<boolean>();
  private _userSubject = new Subject<any>();

  public authenticationState$: Observable<any>;
  public userState$: Observable<any>;

  constructor(private http: Http) {
    this.authenticationState$ = this._authenticationSubject.asObservable();
    this.userState$ = this._userSubject.asObservable();
  }

  public removeUserCredentials(): void {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userAuth');

    this._userSubject.next('Retrieving username...');
    this._authenticationSubject.next(false);
  }

  public storeUser(user: any): void {
    let userProfile = {
      'id': user.id,
      'username': user.username,
      'blocked': user.blocked,
      'profile': user.profile,// todo check why this do not work !!!
      'is_practitioner': false, //todo: get info from user.profile when it will be available
      'notifications': user.notifications
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    this._userSubject.next(userProfile);
  }

  public storeAuthentication(info: any): void {
    let authenticationInfo = {
      'access_token': info.access_token,
      'refresh_token': info.refresh_token,
    };
    localStorage.setItem('userAuth', JSON.stringify(authenticationInfo));
    localStorage.setItem('userProfile', JSON.stringify(info.user));

    this._authenticationSubject.next(true);
  }

  public logout(): void {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userAuth');
  }

  public static getUser(): any {
    return JSON.parse(localStorage.getItem('userProfile'));
  }

  public getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('userProfile'));
  }

  public static isAuthenticated(): boolean {
    if (localStorage.getItem('userAuth')) {
      let userAuth = JSON.parse(localStorage.getItem('userAuth'));
      return userAuth.hasOwnProperty('access_token');
    }

    return false;
  }

  public static getAccessToken(): string {
    if (!AuthenticationService.isAuthenticated()) {
      // throw new Error('User is not authenticated');
      console.log('getAccessToken: User is not authenticated');

      localStorage.removeItem('userProfile');
      localStorage.removeItem('userAuth');
    }

    if (localStorage.getItem('userAuth')) {
      return JSON.parse(localStorage.getItem('userAuth')).access_token;
    }

  }

  public static getRefreshToken(): string {
    if (!AuthenticationService.isAuthenticated()) {
      //throw new Error('User is not authenticated');
      console.log('User is not authenticated');

      localStorage.removeItem('userProfile');
      localStorage.removeItem('userAuth');
    }

    if (localStorage.getItem('userAuth')) {
      return JSON.parse(localStorage.getItem('userAuth')).refresh_token;
    }

  }

  public authenticate(loginAttempt: any): Observable<any> {
    //console.log(loginAttempt);
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
      this.http.post(`${baseApi}/auth/login`, JSON.stringify(loginAttempt)).subscribe(
        (response) => observer.next(response.json().data),
        (error) => {
          observer.error(error.json().errors);
          console.log(error);
        }
      );
    });
  }

  public authenticateWithFacebook(token: any): Observable<any> {
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
      this.http.post(`${baseApi}/social-registration/facebook`, JSON.stringify(token)).subscribe(
        (response) => {
          observer.next(response.json().data)
        },
        (error) => {
          observer.error(error.json().errors);
          console.log(error);
        }
      );
    });
  }

  public authenticateWithGoogle(googleProfile: any): Observable<any> {
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
      this.http.post(`${baseApi}/social-registration/gmail`, JSON.stringify(googleProfile)).subscribe(
        (response) => {
          observer.next(response.json().data)
        },
        (error) => {
          observer.error(error.json().errors);
          console.log(error);
        }
      );
    });
  }

  public obtainNewAccessToken(): Observable<any> {
    let refreshToken = AuthenticationService.getRefreshToken();
    let baseApi = environment.api_host;

    return Observable.create((observer) => {
        this.http.post(`${baseApi}/auth/refresh`, JSON.stringify({
          device_name: 'device name', //this.deviceService.getSignature(),
          user_id: AuthenticationService.getUser().id,
          refresh_token: refreshToken
        })).subscribe(
          (response) => {
            let responseData = response.json().data;
            this.storeAuthentication(responseData);

            observer.next(responseData);
          },
          (error) => {
            observer.error(error)
          }
        );
      }
    );
  }
}
