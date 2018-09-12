import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Profile} from "../../models/profile";
import {Profile as ProfileModel} from "../../models/profile";
import {PostService} from "../../service/post";
import {PostsAdd} from "./add/posts-add";
import {PostComponent} from "../../components/post/post";
import {NotificationService} from "../../service/notification";

@IonicPage({name: "posts-list", segment: "posts-list" })
@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
})
export class Posts {

  public dataLoading: boolean = true;
  public profile: Profile;
  public posts: any;
  //public nextPage: any;
  public lastRequestDate: any;

  @ViewChild(PostComponent) postComponent: PostComponent;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private postService: PostService,
              private notificationService: NotificationService) {
    this.profile = this.navParams.get('profile');
  }

  ionViewWillEnter() {
    this.loadData();
  }

  //reload listing if an action was made in child (post component)
  handleReload(isReloadNeeded) {
    if (true == isReloadNeeded) {
      this.loadData();
    }
  }

  private loadData() {
    this.posts = null;
    this.dataLoading = true;
    const loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
      <div class="custom-spinner-container">
        <img src="assets/customSpinner.svg">
      </div>`
    });
    loading.present();

    this.postService.getTreeOfLife().subscribe(
      (posts) => {
        this.posts = posts;
        this.setLastRequestDate(posts);

        this.notificationService.triggerNotificationCount().subscribe(
          (count) => {
            this.dataLoading = false;
            loading.dismiss();
          },
          () => {
            this.dataLoading = false;
            loading.dismiss();
          }
        );
      },
      (errors) => {
        loading.dismiss();
      }
    );
  }

  doInfinite(infiniteScroll) {
    if (null !== this.lastRequestDate) {
      this.postService.getTreeOfLife(null, this.lastRequestDate).subscribe(
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
      let lastPostDate = posts[posts.length - 1].post.created_at;
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

  onPostAdd() {
    this.navCtrl.push(PostsAdd, {
      profile: this.profile
    })
  }

  getUserProfileImage(profile: ProfileModel) {
    let profileImage = 'assets/images/no-person-image.jpg';

    if (profile.hasOwnProperty('profile_image') && profile.profile_image.small_url != null) {
      profileImage = profile.profile_image.small_url;
    }

    return profileImage;
  }

}