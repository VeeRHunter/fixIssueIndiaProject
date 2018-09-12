import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {Share} from "./share";

@NgModule({
  declarations: [
    Share,
  ],
  imports: [
    IonicPageModule.forChild(Share),
  ],
  exports: [
    Share
  ]
})
export class ShareModule {

}
