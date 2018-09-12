import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostComponentModule} from "../../../components/post/post.module";
import {BranchPosts} from "./branch-posts";

@NgModule({
  declarations: [
    BranchPosts,
  ],
  imports: [
    IonicPageModule.forChild(BranchPosts),
    PostComponentModule
  ],
  exports: [
    BranchPosts
  ]
})
export class BranchPostsModule {
}
