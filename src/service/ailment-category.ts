import {Injectable} from "@angular/core";
import {RestfulService} from "./restful";

@Injectable()
export class AilmentCategoryService extends RestfulService {

  protected getResourcePath(): string {
    return '/ailment-category';
  }

}