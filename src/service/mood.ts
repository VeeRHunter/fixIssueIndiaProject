import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class MoodService extends RestfulService {

  protected getResourcePath(): string {
    return '/mood';
  }

}
