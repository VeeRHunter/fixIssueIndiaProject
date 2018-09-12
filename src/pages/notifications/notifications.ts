import {Component} from "@angular/core";
import {IonicPage, LoadingController, AlertController, NavController, Events} from "ionic-angular";
import {NotificationService} from "../../service/notification";
import {PostView} from "../posts/view/post";
import {Post} from "../../models/post";
import {Profile as ProfileModel} from "../../models/profile";
import {HelperService} from "../../service/helper";
import {ProfileService} from "../../service/profile";
import {ProfileView} from "../profile/view/profile";
import {Notification} from "../../models/notification";

@IonicPage({name: "notifications", segment: "notifications"})
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class Notifications {

  public notifications: any;
  public dataLoading: boolean;
  public authUserProfile: any;
  public notificationsUnread: number;
  public lastRequestDate: any;

  constructor(private navCtrl: NavController,
              private notificationService: NotificationService,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private helperService: HelperService,
              private profileService: ProfileService,
              public events: Events) {

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

    //get authenticated Profile
    this.profileService.getCurrent().subscribe(
      (profile) => {
        this.authUserProfile = profile;

        this.notificationService.countNotifications().subscribe(
          (notificationsCount) => {
            this.notificationsUnread = notificationsCount;

            //update local storage with new notificationCount
            let storedUserProfile = JSON.parse(localStorage.getItem('userProfile'));
            storedUserProfile.notifications = this.notificationsUnread;
            localStorage.setItem('userProfile', JSON.stringify(storedUserProfile));
            this.events.publish('notification:counter:updated', notificationsCount);

            this.notificationService.getProfileNotifications().subscribe(
              (notifications) => {
                this.notifications = notifications;
                this.dataLoading = false;
                loading.dismiss();
                this.setLastRequestDate(notifications);
              },
              (errors) => {
                loading.dismiss();
                this.handleError(errors);
              }
            );
          },
          (errors) => {
            loading.dismiss();
            this.handleError(errors);
          }
        );
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  doInfinite(infiniteScroll) {
    if (null !== this.lastRequestDate) {
      this.notificationService.getProfileNotifications(null, this.lastRequestDate).subscribe(
        (notifications) => {
          for (let notification of notifications) {
            this.notifications.push(notification);
          }
          this.setLastRequestDate(notifications);
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

  setLastRequestDate(notifications) {
    if (notifications.length > 0) {
      let lastPostDate = notifications[notifications.length - 1].created_at;
      this.lastRequestDate = new Date(lastPostDate).getTime() / 1000;
    } else {
      this.lastRequestDate = null;
    }
  }

  goBackPage() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
  }

  public onPostView(post: Post) {
    this.navCtrl.push(PostView, {
      profile: this.authUserProfile,
      post: post
    });
  }

  public onProfileView(profile: ProfileModel) {

    if (this.authUserProfile.id != profile.id) {
      let authUserProfile = this.authUserProfile;
      this.navCtrl.push(ProfileView, {authUserProfile, profile});
    }

  }

  public displayTimeDifference(startDate: any) {
    return this.helperService.displayTimeDifference(startDate);
  }

  private handleError(errors: any) {
    let errorMessage = '';
    for (let error of errors) {
      if (error.message == 'something' && error.code == '401') {
        errorMessage += '<p>This is a custom error.</p>';
      } else {
        errorMessage += '<p>' + error.message + "</p>";
      }
    }

    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

  public getUserProfileImage(notification: Notification) {
    let profile = null;
    switch (notification.type) {
      case 'post.create':
        profile = notification.post.profile;
        break;
      case 'post.reply':
        profile = notification.reply_profile;
        break;
      case 'post.karma.award':
      case 'post.impact.award':
        profile = notification.awarding_profile;
        break;
      case 'profile.follow':
        profile = notification.follower_profile;
        break;
      default:
        profile = notification.post.profile;
        break;
    }
    return this.helperService.getUserProfileImage(profile);
  }

  public onNotificationFollow(notification: Notification) {

    if (true !== notification.is_read) {
      const loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
      });
      loading.present();
      let body = {
        id: notification.id
      };

      this.notificationService.markNotificationRead(body).subscribe(
        (marked) => {
          loading.dismiss();
          //decrease notification counter
          this.notificationsUnread--;
          this.events.publish('notification:counter:updated', this.notificationsUnread);
        },
        (errors) => {
          loading.dismiss();
          // console.log(errors);
          this.handleError(errors);
        }
      );
    }

    switch (notification.type) {
      case 'post.create':
      case 'post.reply':
        if (notification.post.parent_post) {
          this.onPostView(notification.post.parent_post);
        } else {
          this.onPostView(notification.post);
        }
        break;
      case 'post.karma.award':
      case 'post.impact.award':
        this.onPostView(notification.awarded_to_post);
        break;
      case 'profile.follow':
        this.onProfileView(notification.follower_profile);
        break;
    }
  }

  public onUserPictureFollow(notification: Notification) {
    switch (notification.type) {
      case 'post.create':
        this.onProfileView(notification.post.profile);
        break;
      case 'post.reply':
        this.onProfileView(notification.reply_profile);
        break;
      case 'post.karma.award':
      case 'post.impact.award':
        this.onProfileView(notification.awarding_profile);
        break;
      case 'profile.follow':
        this.onProfileView(notification.follower_profile);
        break;
    }
  }

}