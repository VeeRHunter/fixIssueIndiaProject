import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfileEditChangePassword} from "./change-password";

@NgModule({
  declarations: [
    ProfileEditChangePassword,
  ],
  imports: [
    IonicPageModule.forChild(ProfileEditChangePassword),
  ],
  exports: [
    ProfileEditChangePassword
  ]
})
export class ProfileEditChangePasswordModule {
}
