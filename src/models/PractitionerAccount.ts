import {FieldOfPractice} from "./FieldOfPractice";
import {Profile} from "./profile";
export class PractitionerAccount {
  constructor(public id: string,
              public created_at: string,
              public updated_at: string,
              public name: string,
              public business_address: string,
              public medical_id_number: string,
              public personal_bio: string,
              public field_of_practice: FieldOfPractice,
              public profile: Profile,
              public medical_license_image: string,
              public medical_license_extension: string,
              public other_document_body: string,
              public other_document_extension: string,
              public medical_certificate_image: string,
              public medical_certificate_extension: string,
              public id_card_image: string,
              public id_card_extension: string,
              public driver_license_image: string,
              public driver_license_extension: string,
              public approved: boolean) {
  }
}