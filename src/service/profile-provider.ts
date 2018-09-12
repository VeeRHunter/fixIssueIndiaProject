import {Injectable} from "@angular/core";
import {ProfileService} from "./profile";
import {Profile} from "../models/profile";

@Injectable()
export class ProfileProvider {

  currentUserProfile: Profile;

  constructor(private profileService: ProfileService) {
    this.currentUserProfile = null;
  }

  public loadData() {
    //get Profile
    this.profileService.getCurrent().subscribe(
      (profile) => {
        this.currentUserProfile = profile;
      },
      (errors) => {
        console.log(errors);
      }
    );
  }

  public getCurrentUserProfile() {
    if (null === this.currentUserProfile) {
      this.profileService.getCurrent().subscribe(
        (profile) => {
          this.currentUserProfile = profile;
          return this.currentUserProfile;
        },
        (errors) => {
          console.log(errors);
        }
      );
    } else {
      return this.currentUserProfile;
    }
  }
}
