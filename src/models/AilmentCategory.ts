import {FieldOfPractice} from "./FieldOfPractice";
export class AilmentCategory {
  constructor(public id: string,
              public name: string,
              public is_practitioner: boolean,
              public field_of_practice: FieldOfPractice,
              public created_at: string,
              public updated_at: string) {
  }

}