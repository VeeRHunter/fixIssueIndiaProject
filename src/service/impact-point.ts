import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class ImpactPointService extends RestfulService {

  protected getResourcePath(): string {
    return '/impact-point';
  }

}
