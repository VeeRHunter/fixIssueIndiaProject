import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfileView} from './profile';
import {PostComponentModule} from "../../../components/post/post.module";
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [
    ProfileView,
  ],
  imports: [
    IonicPageModule.forChild(ProfileView),
    PostComponentModule,
    ComponentsModule
  ],
  exports: [
    ProfileView
  ]
})
export class ProfileViewModule {
}
