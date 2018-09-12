import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Profile} from "../../../models/profile";
import {Profile as ProfileModel} from "../../../models/profile";
import {PostsAdd} from "../add/posts-add";
import {TagService} from "../../../service/tag";

@IonicPage({ name: "filtered-posts", segment: "filtered-posts" })
@Component({
  selector: 'page-posts-filtered',
  templateUrl: 'posts.html',
})
export class PostsFiltered {

  public dataLoading: boolean = true;
  public profile: Profile;
  public hashtag: string;
  public posts: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private tagService: TagService) {

    this.profile = this.navParams.get('profile');
    this.hashtag = this.navParams.get('hashtag');
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

    //get by Hashtag
    this.tagService.getByTag(this.hashtag).subscribe(
      (posts) => {
        this.posts = posts;
        this.dataLoading = false;
        loading.dismiss();
      },
      (errors) => {
        loading.dismiss();
      }
    );
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