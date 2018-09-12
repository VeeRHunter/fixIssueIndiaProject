import {Component, ViewChild} from '@angular/core';
import {
  IonicPage, NavController, NavParams, LoadingController, FabContainer, AlertController,
  PopoverController
} from 'ionic-angular';
import {Profile} from "../../../models/profile";
import {Profile as ProfileModel} from "../../../models/profile";
import {YoutubeVideoPlayer} from "@ionic-native/youtube-video-player";
import {PostsAdd} from "../add/posts-add";
import {Post} from "../../../models/post";
import {PostService} from "../../../service/post";
import {PostsFiltered} from "../filtered/posts";
import {HelperService} from "../../../service/helper";
import {KarmaPointService} from "../../../service/karma-point";
import {ImpactPointService} from "../../../service/impact-point";
import {ProfileView} from "../../profile/view/profile";
import {Notification} from "../../../models/notification";
import {PostMenu} from "../../post-menu/post-menu";
import {AwardKarmaComponent} from "../../../components/award-karma/award-karma";
import {PhotoViewer} from '@ionic-native/photo-viewer';

@IonicPage({name: "post-view", segment: "post-view" })
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostView {

  public dataLoading: boolean = true;
  public profile: Profile;
  //public authUserProfile: Profile;
  public post: any;
  public postNav: Post;
  public notification: Notification;

  public isLoaded_post: boolean = false;
  //public isLoaded_authUser: boolean = false;

  @ViewChild(AwardKarmaComponent) awardKarmaComponentComponent: AwardKarmaComponent;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController,
              private postService: PostService,
              private youtube: YoutubeVideoPlayer,
              private helperService: HelperService,
              private karmaPointService: KarmaPointService,
              private impactPointService: ImpactPointService,
              private photoViewer: PhotoViewer) {
    this.profile = this.navParams.get('profile');
    this.postNav = this.navParams.get('post');
    this.notification = this.navParams.get('notification');
  }

  ionViewWillEnter() {
    this.isLoaded_post = false;
    //this.isLoaded_authUser = false;
    this.loadData();
  }

  private isLoaded_all() {
    return (this.isLoaded_post); //this.isLoaded_authUser &&
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

    this.postService.getOne(this.postNav.id).subscribe(
      (post) => {
        this.post = post;
        this.dataLoading = false;
        this.isLoaded_post = true;
        if (this.isLoaded_all()) {
          loading.dismiss();
        }
      },
      (errors) => {
        loading.dismiss();
      }
    );
  }

  goBackPage() {
    this.navCtrl.pop();
  }

  onOpenVideo(videoId: string) {
    this.youtube.openVideo(videoId);
  }

  onPostComment(currentPost: Post) {
    this.navCtrl.push(PostsAdd, {
      profile: this.profile,//this.authUserProfile
      parentPost: currentPost
    })
  }

  getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }


  public getTimeDifference(startDate: any) {
    let startDateObj = new Date(startDate);
    let now = new Date();
    let difference = (now.getTime() - startDateObj.getTime()) / 1000;
    return Math.floor(difference);
  }

  public displayTimeDifference(startDate: any) {

    let seconds = this.getTimeDifference(startDate);

    if (seconds < 60) {
      return seconds + ' seconds ago';
    }

    let minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return minutes + ' minutes ago';
    }

    let hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return hours + ' hours ago';
    }

    let days = Math.floor(hours / 24);

    if (days < 365) {
      return days + ' days ago';
    }

    let years = days / 365;

    let remainingDays = days - (years * days);

    return years + ' years and ' + remainingDays + ' ago';

  }

  public onAddKarmaPoint(post, points: number, fab: FabContainer) {

    let data = {
      awarding_profile: {
        id: this.profile.id
      },
      target_profile: {
        id: post.post.profile.id
      },
      post: {
        id: post.post.id
      },
      points_awarded: points,
    };

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.karmaPointService.createOne(data).subscribe(
      (response) => {
        loading.dismiss();
        post.post.total_karma_points += points;
        post.awarded_karma_points = points;
        post.awarded_karma_id = response.id;
        fab.close();
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  public onUpdateKarmaPoint(post, points: number, fab: FabContainer) {

    let data = {
      points_awarded: points,
    };
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.karmaPointService.updateOne(post.awarded_karma_id, data).subscribe(
      (response) => {
        loading.dismiss();
        post.post.total_karma_points = response.post.total_karma_points;
        post.awarded_karma_points = points;
        post.awarded_karma_id = response.id;
        fab.close();
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  public onAddImpactPoint(post) {

    if (post.hasOwnProperty('awarded_impact_id')) {
      return;
    }

    let data = {
      awarding_profile: {
        id: this.profile.id
      },
      target_profile: {
        id: post.post.profile.id
      },
      post: {
        id: post.post.id
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

    this.impactPointService.createOne(data).subscribe(
      (response) => {
        loading.dismiss();
        post.awarded_impact_id = response.id;
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  public onRemoveImpactPoint(post) {

    if (!post.hasOwnProperty('awarded_impact_id')) {
      return;
    }

    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.impactPointService.deleteOne(post.awarded_impact_id).subscribe(
      (response) => {
        loading.dismiss();
        delete post.awarded_impact_id;
      },
      (errors) => {
        loading.dismiss();
        this.handleError(errors);
      }
    );
  }

  public onProfileView(profile: ProfileModel) {

    if (this.profile.id != profile.id) {
      let authUserProfile = this.profile;
      this.navCtrl.push(ProfileView, {authUserProfile, profile})
    }

  }

  onFilterPosts(hashtag: string) {
    this.navCtrl.push(PostsFiltered, {
      profile: this.profile,
      hashtag: hashtag
    });
  }

  isHashtag(word: string) {
    return this.helperService.isHashtag(word);
  }

  getWordFromHashtag(word: string) {
    return this.helperService.getWordFromHashtag(word);
  }

  /**
   * Split body of a post into an array of 'normal' elements and 'hashtag' elements
   */
  splitByHashtags(body: string): any {
    return this.helperService.splitByHashtags(body);
  }

  presentPopover(myEvent, post = null) {
    let popoverPost = (post) ? post : this.post.post;
    let popover = this.popoverCtrl.create(PostMenu, {post: popoverPost, profile: this.profile});
    popover.onDidDismiss((data) => {
      if (data &&
        data.hasOwnProperty('actionMade') &&
        (data.actionMade == 'reportPost' || data.actionMade == 'reportUser' || data.actionMade == 'unfollowUser')) {
        this.loadData();
        //this.isReloadNeeded.emit(true);
      }

    });
    popover.present({
      ev: myEvent
    });
  }

  onPhotoView(url: string) {
    this.photoViewer.show(url, 'Image', {share: false});
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

}