import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class ProfileReportService extends RestfulService {

  protected getResourcePath(): string {
    return '/profile-report';
  }

}