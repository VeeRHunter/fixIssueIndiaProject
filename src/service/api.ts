import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptions, RequestOptionsArgs} from "@angular/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";
import {AuthenticationService} from "./authentication";
import {Login} from "../pages/login/login";
import {App} from "ionic-angular";

@Injectable()
export abstract class ApiService {
  protected navs: Array<any> = [];

  constructor(public http: Http,
              public authenticationService: AuthenticationService,
              protected app: App) {
    this.navs = app.getActiveNavs();
  }

  private static getBasePath(): string {
    return environment.api_host;
  }

  protected abstract getResourcePath(): string;

  protected getUrl(path: string): string {
    let basePath = ApiService.getBasePath();
    let resourcePath = this.getResourcePath;

    return `${basePath}${resourcePath()}${path}`;
  }

  private static assignAuthorizationHeader(headers: Headers): void {
    headers.append('Authorization', `Bearer ${AuthenticationService.getAccessToken()}`);
  }

  protected get(url: string): Observable<any> {
    url = this.getUrl(url);
    let requestOptions = ApiService.getRequestOptions();

    return Observable.create((observer) => {
      this.http.get(url, requestOptions).subscribe(
        (response) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          let errorJson = error.json().errors;

          if (1 === errorJson.length) {
            if (ApiService.accessTokenExpired(errorJson) || ApiService.accessTokenInvalid(errorJson)) {
              this.authenticationService.obtainNewAccessToken().subscribe(
                () => {
                  requestOptions = ApiService.getRequestOptions();
                  this.http.get(url, requestOptions).subscribe(
                    (response) => observer.next(response),
                    (error) => {
                      this.removeCredentials();
                      observer.error(error);
                    }
                  );
                },
                (error) => {
                  this.removeCredentials();
                  observer.error(error);
                }
              );
            } else if (ApiService.accessDeniedException(errorJson)) {
              this.removeCredentials();
              observer.error(error);
            } else {
              this.removeCredentials();
              observer.error(error)
            }
          } else {
            this.removeCredentials();
            observer.error(error);
          }
        }
      );
    });
  }

  private removeCredentials() {
    this.authenticationService.removeUserCredentials();
    if (this.navs.length > 0) {
      for(let nav of this.navs) {
        if(null !== nav.parent) {
          nav.parent.setRoot(Login);
          nav.parent.popToRoot();
        } else {
          nav.setRoot(Login);
          nav.popToRoot();
        }
      }
    }
  }

  private static accessDeniedException(errorJson: any) {
    if ('Access Denied.' === errorJson[0].message && 403 === errorJson[0].code) {
      return true;
    }

    if ('Not authorized action' === errorJson[0].message && 401 === errorJson[0].code) {
      return true;
    }

    if (404 === errorJson[0].code) {
      return true;
    }
  }

  private static accessTokenExpired(errorJson: any) {
    return 'Access token expired' === errorJson[0].message && 403 === errorJson[0].code;
  }

  private static accessTokenInvalid(errorJson: any) {
    return 'Invalid access token' === errorJson[0].message && 403 === errorJson[0].code;
  }

  //noinspection ReservedWordAsName
  protected delete(url: string): Observable<any> {
    url = this.getUrl(url);

    let requestOptions = ApiService.getRequestOptions();
    return Observable.create((observer) => {
      this.http.delete(url, requestOptions).subscribe(
        (response) => observer.next(response),
        (error) => {
          let errorJson = error.json().errors;

          if (1 === errorJson.length) {
            if (ApiService.accessTokenExpired(errorJson)) {
              this.authenticationService.obtainNewAccessToken().subscribe(
                () => {
                  requestOptions = ApiService.getRequestOptions();
                  this.http.delete(url, requestOptions).subscribe(
                    (response) => observer.next(response),
                    (error) => {
                      this.removeCredentials();
                      observer.error(error);
                    }
                  );
                },
                () => {
                  this.removeCredentials();
                  observer.error(error);
                }
              );
            } else if (ApiService.accessDeniedException(errorJson)) {
              this.removeCredentials();
              observer.error(error);
            } else {
              this.removeCredentials();
              observer.error(error)
            }
          } else {
            this.removeCredentials();
            observer.error(error);
          }
        }
      );
    });
  }

  protected post(url: string, body: any): Observable<any> {
    url = this.getUrl(url);

    let requestOptions = ApiService.getRequestOptions();
    return Observable.create((observer) => {
      this.http.post(url, JSON.stringify(body), requestOptions).subscribe(
        (response) => observer.next(response),
        (error) => {
          let errorJson = error.json().errors;

          if (1 === errorJson.length) {
            if (ApiService.accessTokenExpired(errorJson)) {
              this.authenticationService.obtainNewAccessToken().subscribe(
                () => {
                  requestOptions = ApiService.getRequestOptions();
                  this.http.post(url, JSON.stringify(body), requestOptions).subscribe(
                    (response) => observer.next(response),
                    (error) => {
                      this.removeCredentials();
                      observer.error(error);
                    }
                  );
                },
                () => {
                  this.removeCredentials();
                  observer.error(error);
                }
              );
            } else if (ApiService.accessDeniedException(errorJson)) {
              this.removeCredentials();
              observer.error(error);
            } else {
              this.removeCredentials();
              observer.error(error)
            }
          } else {
            this.removeCredentials();
            observer.error(error);
          }
        }
      );
    });
  }

  protected patch(url: string, body: any): Observable<any> {
    url = this.getUrl(url);

    let requestOptions = ApiService.getRequestOptions();
    return Observable.create((observer) => {
      this.http.patch(url, JSON.stringify(body), requestOptions).subscribe(
        (response) => observer.next(response),
        (error) => {
          let errorJson = error.json().errors;

          if (1 === errorJson.length) {
            if (ApiService.accessTokenExpired(errorJson)) {
              this.authenticationService.obtainNewAccessToken().subscribe(
                () => {
                  requestOptions = ApiService.getRequestOptions();
                  this.http.patch(url, JSON.stringify(body), requestOptions).subscribe(
                    (response) => observer.next(response),
                    (error) => {
                      this.removeCredentials();
                      observer.error(error);
                    }
                  );
                },
                () => {
                  this.removeCredentials();
                  observer.error(error);
                }
              );
            } else if (ApiService.accessDeniedException(errorJson)) {
              this.removeCredentials();
              observer.error(error);
            } else {
              this.removeCredentials();
              observer.error(error)
            }
          } else {
            this.removeCredentials();
            observer.error(error);
          }
        }
      );
    });
  }

  protected put(url: string, body: any): Observable<any> {
    url = this.getUrl(url);

    let requestOptions = ApiService.getRequestOptions();
    return Observable.create((observer) => {
      this.http.put(url, JSON.stringify(body), requestOptions).subscribe(
        (response) => observer.next(response),
        (error) => {
          let errorJson = error.json().errors;

          if (1 === errorJson.length) {
            if (ApiService.accessTokenExpired(errorJson)) {
              this.authenticationService.obtainNewAccessToken().subscribe(
                () => {
                  requestOptions = ApiService.getRequestOptions();
                  this.http.put(url, JSON.stringify(body), requestOptions).subscribe(
                    (response) => observer.next(response),
                    (error) => {
                      this.removeCredentials();
                      observer.error(error);
                    }
                  );
                },
                () => {
                  this.removeCredentials();
                  observer.error(error);
                }
              );
            } else if (ApiService.accessDeniedException(errorJson)) {
              this.removeCredentials();
              observer.error(error);
            } else {
              this.removeCredentials();
              observer.error(error)
            }
          } else {
            this.removeCredentials();
            observer.error(error);
          }
        }
      );
    });
  }

  public getPaginationData(): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/?page=1&itemsPerPage=1`).subscribe(
        (response) => observer.next(response.json().pagination_metadata),
        (error) => observer.error(error.json().errors)
      );
    })
  }

  public getAllRaw(): Observable<any> {
    return Observable.create((observer) => {
      this.getPaginationData().subscribe(
        (pagination) => {
          let totalPages = Math.ceil(pagination.total_items / 50);

          let requests = [];
          for (let page = 1; page <= totalPages; page++) {
            requests[page - 1] = this.get(`/?page=${page}&itemsPerPage=50`).map(
              (response) => response.json().data
            );
          }

          Observable.forkJoin(requests).subscribe(
            (dataBatch) => {
              let data = [];

              for (let i = 0; i < totalPages; i++) {
                Array.prototype.push.apply(data, dataBatch[i]);
              }
              observer.next(data);
            },
            (error) => {
              observer.error(error.json().errors);
            }
          );
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  private static getRequestOptions(): RequestOptionsArgs {
    let headers = new Headers();
    ApiService.assignAuthorizationHeader(headers);
    let requestOptions = new RequestOptions();
    requestOptions.headers = headers;

    return requestOptions;
  }
}
