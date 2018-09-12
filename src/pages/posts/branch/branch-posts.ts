import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Profile} from "../../../models/profile";
import {Profile as ProfileModel} from "../../../models/profile";
import {PostService} from "../../../service/post";
import {PostsAdd} from "../add/posts-add";
import {PostComponent} from "../../../components/post/post";

@IonicPage({name: "branch-posts-view", segment: "branch-posts-view" })
@Component({
  selector: 'page-branch-posts',
  templateUrl: 'branch-posts.html',
})
export class BranchPosts {

  public dataLoading: boolean = true;
  public profile: Profile;
  public posts: any;
  public lastRequestDate: any;

  @ViewChild(PostComponent) postComponent: PostComponent;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private postService: PostService) {
    this.profile = this.navParams.get('profile');
  }


  ionViewWillEnter() {
    this.loadData();
  }

  handleReload(isReloadNeeded) {
    if (true == isReloadNeeded) {
      this.loadData();
    }
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

    this.postService.getBranchView().subscribe(
      (posts) => {
        this.posts = posts;
        this.dataLoading = false;
        loading.dismiss();
        this.setLastRequestDate(posts);
      },
      (errors) => {
        console.log(errors);
        loading.dismiss();
      }
    );
  }

  doInfinite(infiniteScroll) {
    if (null !== this.lastRequestDate) {
      this.postService.getBranchView(null, this.lastRequestDate).subscribe(
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
    this.navCtrl.pop();
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