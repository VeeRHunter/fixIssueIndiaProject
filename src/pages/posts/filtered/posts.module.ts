import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostsFiltered} from "./posts";
import {PostComponentModule} from "../../../components/post/post.module";

@NgModule({
  declarations: [
    PostsFiltered,
  ],
  imports: [
    IonicPageModule.forChild(PostsFiltered),
    PostComponentModule
  ],
  exports: [
    PostsFiltered
  ]
})
export class PostsFilteredModule {
}
