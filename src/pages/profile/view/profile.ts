import {Component} from "@angular/core";
import {IonicPage, LoadingController, NavParams, AlertController} from "ionic-angular";
import {DomSanitizer} from "@angular/platform-browser";
import {ProfileService} from "../../../service/profile";
import {Profile as ProfileModel} from "../../../models/profile";
import {UserFollowService} from "../../../service/userFollow";
import {ProfileProvider} from "../../../service/profile-provider";
import {CapitalizePipe} from "../../../pipe/capitalize";
import {PostService} from "../../../service/post";

@IonicPage({name: "profile-view", segment: "profile-view"})
@Component({
  selector: 'page-view-profile',
  templateUrl: 'profile.html',
})
export class ProfileView {

  public dataLoading: boolean = true;
  public loadingPosts: boolean = false;
  public userProfile: ProfileModel = null;
  public userImageBg: any;
  public userImage: any;
  public mood: any;
  public currentMoodClass: any = '';
  public posts: any;
  public lastRequestDate: any;

  public profile: ProfileModel;
  public authUserProfile: ProfileModel;
  public didFollow: boolean = false;

  public GENDER_MALE = 0;
  public GENDER_FEMALE = 1;
  public GENDER_INDETERMINATE = 2;
  public GENDER_INTERSEX = 3;
  public GENDER_OTHER = 4;

  constructor(private profileService: ProfileService,
              private postService: PostService,
              private sanitizer: DomSanitizer,
              private loadingCtrl: LoadingController,
              private userFollowService: UserFollowService,
              private alertCtrl: AlertController,
              private navParams: NavParams,
              public profileProvider: ProfileProvider) {
    this.profile = this.navParams.get('profile');
    //this.authUserProfile = this.profileProvider.getCurrentUserProfile();

    if (!this.authUserProfile) {
      this.profileService.getCurrent().subscribe(
        (profile) => {
          this.authUserProfile = profile;
        },
        (errors) => {
          console.log(errors);
        }
      );
    }
  }

  ionViewWillEnter() {
    this.loadData();
  }

  private loadData() {
    this.dataLoading = true;
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    //get Profile
    this.profileService.getOne(this.profile.id).subscribe(
      (profile) => {
        this.userProfile = profile;

        this.userImage = this.getUserProfileImage(this.userProfile);
        this.userImageBg = this.sanitizer.bypassSecurityTrustStyle('url(' + this.userImage + ')');

        if (this.userProfile.hasOwnProperty('current_mood')) {
          this.mood = this.userProfile.current_mood;
          this.currentMoodClass = this.mood.mood;
        }

        this.dataLoading = false;
        loading.dismiss();

        this.loadingPosts = true;
        this.postService.getUserPosts(this.profile.id).subscribe(
          (posts) => {
            this.posts = posts;
            this.loadingPosts = false;
            this.setLastRequestDate(posts);
          },
          (errors) => {
            this.loadingPosts = false;
            loading.dismiss();
          }
        );
      },
      (errors) => {
        loading.dismiss();
        console.log(errors);
      }
    );

  }


  doInfinite(infiniteScroll) {
    if (this.posts && this.posts.length && null !== this.lastRequestDate) {
      this.postService.getUserPosts(this.profile.id, null, this.lastRequestDate).subscribe(
        (posts) => {
          for (let post of posts) {
            this.posts.push(post);
          }
          this.setLastRequestDate(posts);
          infiniteScroll.complete();
        },
        (errors) => {
          console.log(errors);
        }
      );
    } else {
      infiniteScroll.complete();
    }
  }

  setLastRequestDate(posts) {
    if (posts.length > 0) {
      const lastPostDate = posts[posts.length - 1].post.created_at;
      this.lastRequestDate = new Date(lastPostDate).getTime() / 1000;
    } else {
      this.lastRequestDate = null;
    }
  }

  getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

  public getAge(dateOfBirth) {
    if ('string' === typeof dateOfBirth) {
      dateOfBirth = new Date(dateOfBirth);
    }
    let ageDifMs = Date.now() - dateOfBirth.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  onConnectToUser() {

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();


    let data = {
      profile: {
        id: this.authUserProfile.id
      },
      following_profile: {
        id: this.profile.id
      }
    };

    this.userFollowService.createOne(data).subscribe(
      (userFollow) => {
        loading.dismiss();
        this.didFollow = true;

        // reload authenticated user data in order to update `following_profile_ids`
        this.profileProvider.loadData();

        let profileName = 'with ' + (new CapitalizePipe()).transform(this.profile.first_name);
        if(!this.profile.first_name) {
          profileName = '';
        }
        const alert = this.alertCtrl.create({
          title: '',
          message: 'You are now connected' + profileName,
          buttons: ['Ok']
        });

        alert.present();
        this.didFollow = true;
        this.loadData();
      },
      (errors) => {
        console.log(errors);
        loading.dismiss();
      }
    );

  }

  isFollowingUser() {
    if (this.authUserProfile && this.authUserProfile.hasOwnProperty('following_profile_ids') && this.authUserProfile.following_profile_ids.length > 0) {
      let index = this.authUserProfile.following_profile_ids.indexOf(this.profile.id);

      if (index !== -1) {
        return true;
      }
    }

    return false;
  }

  isApprovedPractitioner(profile): boolean {
    return (
      profile.is_practitioner
      && profile.hasOwnProperty('practitioner_account')
      && profile.practitioner_account.approved
    );
  }
}