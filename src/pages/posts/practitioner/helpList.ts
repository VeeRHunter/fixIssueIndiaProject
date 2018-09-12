import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Profile} from "../../../models/profile";
import {PostService} from "../../../service/post";

@IonicPage({name: "help-list", segment: "help-list" })
@Component({
  selector: 'page-helpList',
  templateUrl: 'helpList.html',
})
export class HelpList {

  public dataLoading: boolean = true;
  public profile: Profile;
  public posts: any;
  public lastRequestDate: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private loadingCtrl: LoadingController,
              private postService: PostService) {
    this.profile = this.navParams.get('profile');
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

    this.postService.getPractitionerHelpList().subscribe(
      (posts) => {
        this.posts = posts;
        this.dataLoading = false;
        loading.dismiss();
        this.setLastRequestDate(posts);
      },
      (errors) => {
        loading.dismiss();
      }
    );
  }

  doInfinite(infiniteScroll) {
    if (null !== this.lastRequestDate) {
      this.postService.getPractitionerHelpList(null, this.lastRequestDate).subscribe(
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

}