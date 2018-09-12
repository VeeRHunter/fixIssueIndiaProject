import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class PostReportService extends RestfulService {

  protected getResourcePath(): string {
    return '/post-report';
  }

}