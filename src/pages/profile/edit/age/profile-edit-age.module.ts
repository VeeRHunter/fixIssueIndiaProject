import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ProfileEditAge} from "./profile-edit-age";

@NgModule({
  declarations: [
    ProfileEditAge,
  ],
  imports: [
    IonicPageModule.forChild(ProfileEditAge),
  ],
  exports: [
    ProfileEditAge
  ]
})
export class ProfileEditAgeModule {}
