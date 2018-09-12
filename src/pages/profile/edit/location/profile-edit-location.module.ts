import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ProfileEditLocation} from "./profile-edit-location";
import {AngularGooglePlaceModule} from 'angular-google-place';

@NgModule({
  declarations: [
    ProfileEditLocation,
  ],
  imports: [
    IonicPageModule.forChild(ProfileEditLocation),
    AngularGooglePlaceModule
  ],
  exports: [
    ProfileEditLocation
  ]
})
export class ProfileEditLocationModule {}
