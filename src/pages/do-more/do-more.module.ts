import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DoMore} from "./do-more";

@NgModule({
  declarations: [
    DoMore,
  ],
  imports: [
    IonicPageModule.forChild(DoMore),
  ],
  exports: [
    DoMore
  ]
})
export class DoMoreModule {
}
