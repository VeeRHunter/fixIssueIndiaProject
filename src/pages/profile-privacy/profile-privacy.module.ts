import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfilePrivacy} from "./profile-privacy";

@NgModule({
  declarations: [
    ProfilePrivacy,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePrivacy),
  ],
  exports: [
    ProfilePrivacy
  ]
})
export class ProfilePrivacyModule {
}
