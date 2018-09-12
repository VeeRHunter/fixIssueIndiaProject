import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostComponentModule} from "../../../components/post/post.module";
import {PostView} from "./post";
import {ProfileLeavesComponentModule} from "../../../components/profile-leaves/profile-leaves.module";
import {AwardKarmaComponentModule} from "../../../components/award-karma/award-karma.module";

@NgModule({
  declarations: [
    PostView,
  ],
  imports: [
    IonicPageModule.forChild(PostView),
    PostComponentModule,
    ProfileLeavesComponentModule,
    AwardKarmaComponentModule
  ],
  exports: [
    PostView
  ]
})
export class PostViewModule {
}
