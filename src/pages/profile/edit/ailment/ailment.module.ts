import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfileEditAilment} from "./ailment";
import {ComponentsModule} from "../../../../components/components.module";

@NgModule({
  declarations: [
    ProfileEditAilment,
  ],
  imports: [
    IonicPageModule.forChild(ProfileEditAilment),
    ComponentsModule
  ],
  exports: [
    ProfileEditAilment
  ]
})
export class ProfileEditAilmentModule {
}
