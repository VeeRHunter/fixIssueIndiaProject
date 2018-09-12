import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Profile as ProfileModel} from "../../models/profile";
import {NavController, LoadingController, AlertController, PopoverController} from "ionic-angular";
import {ProfileView} from "../../pages/profile/view/profile";
import {YoutubeVideoPlayer} from "@ionic-native/youtube-video-player";
import {PostsAdd} from "../../pages/posts/add/posts-add";
import {Post} from "../../models/post";
import {PostView} from "../../pages/posts/view/post";
import {ImpactPointService} from "../../service/impact-point";
import {PostsFiltered} from "../../pages/posts/filtered/posts";
import {HelperService} from "../../service/helper";
import {PostMenu} from "../../pages/post-menu/post-menu";
import {AwardKarmaComponent} from "../award-karma/award-karma";

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent {

  @Input() post: any;
  @Input() userProfile: any;
  @Input() karmaBarPosition: string = 'top';
  text: string;
  public timeDifference: string;

  @Output() isReloadNeeded = new EventEmitter();

  @ViewChild(AwardKarmaComponent) awardKarmaComponentComponent: AwardKarmaComponent;

  constructor(private navCtrl: NavController,
              private youtube: YoutubeVideoPlayer,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private impactPointService: ImpactPointService,
              private helperService: HelperService,
              private popoverCtrl: PopoverController) {
  }

  ngAfterViewInit() {
    // this.timeDifference = this.helperService.displayTimeDifference(this.post.post.created_at);
    setTimeout(() => {
      this.timeDifference = this.helperService.displayTimeDifference(this.post.post.created_at);
    }, 200);
  }

  getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

  public displayTimeDifference(startDate: any) {
    return this.helperService.displayTimeDifference(startDate);
  }

  public onProfileView(profile: ProfileModel) {

    if (this.userProfile.id != profile.id) {
      let authUserProfile = this.userProfile;
      this.navCtrl.push(ProfileView, {authUserProfile, profile})
    }

  }

  public onPostView(post: Post) {
    this.navCtrl.push(PostView, {
      profile: this.userProfile,
      post: post,
    });
  }

  public onOpenVideo(videoId: string) {
    this.youtube.openVideo(videoId);
  }

  public onPostComment(currentPost: Post) {
    this.navCtrl.push(PostsAdd, {
      profile: this.userProfile,
      parentPost: currentPost
    })
  }
  //
  // public onAddKarmaPoint(points: number, fab: FabContainer) {
  //
  //   let data = {
  //     awarding_profile: {
  //       id: this.userProfile.id
  //     },
  //     target_profile: {
  //       id: this.post.post.profile.id
  //     },
  //     post: {
  //       id: this.post.post.id
  //     },
  //     points_awarded: points,
  //   };
  //
  //   const loading = this.loadingCtrl.create({
  //     content: 'Awarding karma ...'
  //   });
  //   loading.present();
  //
  //   this.karmaPointService.createOne(data).subscribe(
  //     (response) => {
  //       loading.dismiss();
  //       this.post.post.total_karma_points += points;
  //       this.post.awarded_karma_points = points;
  //       this.post.awarded_karma_id = response.id;
  //       fab.close();
  //     },
  //     (errors) => {
  //       loading.dismiss();
  //       this.handleError(errors);
  //     }
  //   );
  // }
  //
  // public onUpdateKarmaPoint(points: number, fab: FabContainer) {
  //
  //   let data = {
  //     points_awarded: points,
  //   };
  //
  //   const loading = this.loadingCtrl.create({
  //     content: 'Awarding karma ...'
  //   });
  //   loading.present();
  //
  //   this.karmaPointService.updateOne(this.post.awarded_karma_id, data).subscribe(
  //     (response) => {
  //       loading.dismiss();
  //       this.post.post.total_karma_points = response.post.total_karma_points;
  //       this.post.awarded_karma_points = points;
  //       this.post.awarded_karma_id = response.id;
  //       fab.close();
  //     },
  //     (errors) => {
  //       loading.dismiss();
  //       this.handleError(errors);
  //     }
  //   );
  // }

  public onAddImpactPoint(post) {

    if (post.hasOwnProperty('awarded_impact_id')) {
      return;
    }

    let data = {
      awarding_profile: {
        id: this.userProfile.id
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

  onFilterPosts(hashtag: string) {
    this.navCtrl.push(PostsFiltered, {
      profile: this.userProfile,
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
    let popover = this.popoverCtrl.create(PostMenu, {post: popoverPost, profile: this.userProfile});
    popover.onDidDismiss((data) => {
      if (data &&
        data.hasOwnProperty('actionMade') &&
        (data.actionMade == 'reportPost' || data.actionMade == 'reportUser' || data.actionMade == 'unfollowUser')) {
        this.isReloadNeeded.emit(true);
      }

    });
    popover.present({
      ev: myEvent
    });
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
