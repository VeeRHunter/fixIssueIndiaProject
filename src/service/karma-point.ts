import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class KarmaPointService extends RestfulService {

  protected getResourcePath(): string {
    return '/karma-point';
  }

}
