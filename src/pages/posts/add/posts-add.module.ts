import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PostsAdd} from "./posts-add";
import {ProfileLeavesComponentModule} from "../../../components/profile-leaves/profile-leaves.module";
import {EmojiPickerModule} from '@ionic-tools/emoji-picker';;

@NgModule({
  declarations: [
    PostsAdd,
  ],
  imports: [
    IonicPageModule.forChild(PostsAdd),
    ProfileLeavesComponentModule,
    EmojiPickerModule
  ],
  exports: [
    PostsAdd
  ]
})
export class PostsAddModule {
}
