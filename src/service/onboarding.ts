import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";
import {environment} from "../environments/environment";

@Injectable()
export class OnboardingService {
  protected static getResourcePath(): string {
    return '/onboarding-step';
  }

  constructor(private http: Http) {
  }

  public getUrl(path: string): string {
    return `${environment.api_host}${OnboardingService.getResourcePath()}${path}`;
  }

  public getAllActive(): Observable<any> {
    return Observable.create((observer) => {
      this.http.get(this.getUrl('/active')).subscribe(
        (steps) => observer.next(steps.json().data),
        (error) => observer.error(error.json().errors)
      );
    });
  }

  public static userHasCompletedTutorial(): boolean {
    return localStorage.getItem('tutorial_viewed') === '1';
  }

  public static markUserAsHavingTheTutorialComplete(): void {
    localStorage.setItem('tutorial_viewed', '1');
  }
}
