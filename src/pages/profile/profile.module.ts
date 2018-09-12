import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Profile } from './profile';
import {PostComponentModule} from "../../components/post/post.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    Profile,
  ],
  imports: [
    IonicPageModule.forChild(Profile),
    PostComponentModule,
    ComponentsModule
  ],
  exports: [
    Profile
  ]
})
export class ProfileModule {}
