import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class FieldOfPracticeService extends RestfulService {

  protected getResourcePath(): string {
    return '/field-of-practice';
  }

}