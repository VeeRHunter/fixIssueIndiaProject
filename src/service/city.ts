import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";
import {Observable} from "../../node_modules/rxjs/Observable";

@Injectable()
export class CityService extends RestfulService {

  protected getResourcePath(): string {
    return '/city';
  }

  public getCitiesByCountry(countryId: string): Observable<any> {
    return Observable.create((observer) => {
      this.get(`/country/${countryId}`).subscribe(
        (cities) => observer.next(cities.json().data),
        (error) => observer.error(error.json().errors)
      )
    });
  }
}
