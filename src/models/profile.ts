import {Country} from "./country";
import {City} from "./city";
import {ProfileImage} from "./profileImage";
import {PractitionerAccount} from "./PractitionerAccount";
import {Mood} from "./mood";
export class Profile {
  constructor(public id: string,
              public first_name: string,
              public last_name: string,
              public gender: string,
              public date_of_birth: Date,
              public country: Country,
              public city: City,
              public profile_image: ProfileImage,
              public profile_images: ProfileImage[],
              public ailment_category: any,
              public practitioner_account: PractitionerAccount,
              public is_practitioner: boolean,
              public current_mood: Mood,
              public karma_points: number,
              public total_karma_points: number,
              public personal_bio: string,
              public following_profile_ids: any,
              public total_posts: any,
              public total_impact_points: any,
              public created_at: string,
              public updated_at: string) {
  }

}