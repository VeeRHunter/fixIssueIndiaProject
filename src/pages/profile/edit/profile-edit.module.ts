import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ProfileEdit} from "./profile-edit";

@NgModule({
  declarations: [
    ProfileEdit,
  ],
  imports: [
    IonicPageModule.forChild(ProfileEdit),
  ],
  exports: [
    ProfileEdit
  ]
})
export class ProfileEditModule {}
