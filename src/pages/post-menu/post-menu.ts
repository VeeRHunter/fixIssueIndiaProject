import {Component} from '@angular/core';
import {ViewController, NavParams, LoadingController, AlertController} from "ionic-angular";
import {PostReportService} from "../../service/post-report";
import {ProfileReportService} from "../../service/profile-report";
import {UserFollowService} from "../../service/userFollow";
import {ProfileProvider} from "../../service/profile-provider";
import {Profile as ProfileModel} from "../../models/profile";

@Component({
  selector: 'page-post-menu',
  templateUrl: 'post-menu.html'
})
export class PostMenu {

  public post: any;
  public userProfile: any;
  public authUserProfile: ProfileModel;

  public displayMainMenu: boolean = true;
  public displayReportUserAction: boolean = false;
  public displayReportPostAction: boolean = false;
  public displayUnfollowUserAction: boolean = false;

  public displayReportUserResult: boolean = false;
  public displayReportPostResult: boolean = false;
  public displayUnfollowUserResult: boolean = false;

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public postReportService: PostReportService,
              public profileReportService: ProfileReportService,
              public userFollowService: UserFollowService,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public profileProvider: ProfileProvider) {

    this.post = this.navParams.get('post');
    this.authUserProfile = this.navParams.get('profile');
  }

  onReportPost() {

    let postReportData = {
      reporting_profile: {
        id: this.authUserProfile.id
      },
      post: {
        id: this.post.id
      }
    };

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.postReportService.createOne(postReportData).subscribe(
      (response) => {
        loading.dismiss();

        this.hideAll();
        this.displayReportPostResult = true;
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  onReportUser() {
    let profileReportData = {
      reporting_profile: {
        id: this.authUserProfile.id
      },
      profile: {
        id: this.post.profile.id
      }
    };

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.profileReportService.createOne(profileReportData).subscribe(
      (response) => {
        loading.dismiss();

        this.hideAll();
        this.displayReportUserResult = true;
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  onUnfollowUser() {
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.userFollowService.unfollowUser(this.post.profile.id).subscribe(
      (response) => {
        loading.dismiss();
        this.profileProvider.loadData();
        this.hideAll();
        this.displayUnfollowUserResult = true;
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  private hideAll() {
    this.displayMainMenu = false;
    this.displayReportPostAction = false;
    this.displayReportUserAction = false;
    this.displayUnfollowUserAction = false;
  }

  onDisplayReportPostAction() {
    this.hideAll();
    this.displayReportPostAction = true;
  }

  onDisplayReportUserAction() {
    this.hideAll();
    this.displayReportUserAction = true;
  }

  onDisplayUnfollowUserAction() {
    this.hideAll();
    this.displayUnfollowUserAction = true;
  }

  onReportPostDone() {
    this.viewCtrl.dismiss({actionMade: 'reportPost'});
  }

  onReportUserDone() {
    this.viewCtrl.dismiss({actionMade: 'reportUser'});
  }

  onUnfollowUserDone() {
    this.viewCtrl.dismiss({actionMade: 'unfollowUser'});
  }

  close() {
    this.viewCtrl.dismiss();
  }

  public isPostUserFollowed() {
    if (
      this.authUserProfile &&
      this.authUserProfile.hasOwnProperty('following_profile_ids')
    ) {
      for (let entry of this.authUserProfile.following_profile_ids) {
        if (entry == this.post.profile.id) {
          return true;
        }
      }
    }
    return false;
  }

  private handleError(errors: any) {
    let errorMessage = '';
    for (let error of errors) {
      if (error.hasOwnProperty('property_path') && error.property_path == 'reportingProfile') {
        errorMessage += "<p>Reporting profile shouldn't be null </p>";
      } else if (error.hasOwnProperty('property_path') && error.property_path == 'post') {
        errorMessage += "<p>Post shouldn't be null </p>";
      } else {
        errorMessage += "<p>" + error.message + " </p>";
      }
    }

    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}