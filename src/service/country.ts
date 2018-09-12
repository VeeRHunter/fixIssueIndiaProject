import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class CountryService extends RestfulService {
  protected getResourcePath(): string {
    return '/country';
  }
}
