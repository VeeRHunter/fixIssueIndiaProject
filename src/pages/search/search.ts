import {Component, ElementRef} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileService} from "../../service/profile";
import {Profile as ProfileModel} from "../../models/profile";
import {ProfileView} from "../profile/view/profile";

@IonicPage({name: "search", segment: "search"})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class Search {

  public profile: ProfileModel;

  public SEARCHMODE_USER = 'user';
  public SEARCHMODE_PRACTITIONER = 'practitioner';

  public usersFound = null;
  public searchMode = this.SEARCHMODE_USER;
  public searchedInProgress = null;
  public searchName: string = '';

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private profileService: ProfileService,
              private elementRef: ElementRef) {
    this.profile = this.navParams.get('profile');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  subscribeToClickListeners() {
    let elements = this.elementRef.nativeElement.querySelectorAll('.profile-link');
    for (let element of elements) {
      element.addEventListener(
        'click',
        () => {
          this.onProfileView(element.dataset.profileid);
        }
      );
    }
  }

  loadData() {
    let self = this;
    self.searchedInProgress = true;
    self.usersFound = null;
    let isPractitionerSearch = false;
    if (this.searchMode == this.SEARCHMODE_PRACTITIONER) {
      isPractitionerSearch = true;
    }
    self.profileService.searchUsersByNameAndType(
      this.searchName,
      isPractitionerSearch,
      1,
      25
    ).subscribe(
      (profiles) => {
        self.usersFound = profiles;
        self.searchedInProgress = false;

        setTimeout(() => {
          this.subscribeToClickListeners();
        }, 20);
      },
      (errors) => {
        console.log(errors);
      }
    );
  }

  getUserProfileImage(profile) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

  onChangeSearchMode(searchMode) {
    if (this.SEARCHMODE_USER === searchMode || this.SEARCHMODE_PRACTITIONER === searchMode) {
      this.searchMode = searchMode;
      this.loadData();
    }
  }

  public onProfileView(profileId) {
    if (this.profile.id != profileId) {
      let authUserProfile = this.profile;
      let profile = {
        id: profileId
      };
      this.navCtrl.push(
        ProfileView,
        {
          authUserProfile,
          profile
        })
    }
  }
}