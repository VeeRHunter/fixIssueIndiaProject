import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PersonalizeBranch} from "./personalize-branch";

@NgModule({
  declarations: [
    PersonalizeBranch,
  ],
  imports: [
    IonicPageModule.forChild(PersonalizeBranch),
  ],
  exports: [
    PersonalizeBranch
  ]
})
export class PersonalizeBranchModule {
}
