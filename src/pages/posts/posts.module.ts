import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {Posts} from "./posts";
import {PostComponentModule} from "../../components/post/post.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    Posts,
  ],
  imports: [
    IonicPageModule.forChild(Posts),
    PostComponentModule,
    ComponentsModule,
  ],
  exports: [
    Posts
  ]
})
export class PostsModule {
}
