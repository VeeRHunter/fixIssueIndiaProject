import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Profile} from "../../models/profile";
import {Posts} from "../posts/posts";
import {PostsAdd} from "../posts/add/posts-add";
import {BranchPosts} from "../posts/branch/branch-posts";
import {HelpList} from "../posts/practitioner/helpList";

@IonicPage({name: "do-more", segment: "do-more" })
@Component({
  selector: 'page-do-more',
  templateUrl: 'do-more.html',
})
export class DoMore {

  public profile: Profile;

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
    this.profile = this.navParams.get('profile');
  }


  goBackPage() {
    this.navCtrl.pop();
  }

  onBrowse() {
    this.navCtrl.push(Posts, {profile: this.profile});
  }
  onBrowseBranch() {
    this.navCtrl.push(BranchPosts, {profile: this.profile});
  }

  onShare() {
    this.navCtrl.push(PostsAdd, {profile: this.profile});
  }

  onPractitionerHelpList() {
    this.navCtrl.push(HelpList, {profile: this.profile});
  }

  onSomething() {
  }

}