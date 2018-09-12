import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {ProfileLeavesComponent} from "./profile-leaves";

@NgModule({
  declarations: [
    ProfileLeavesComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ProfileLeavesComponent
  ],
  entryComponents:[
    ProfileLeavesComponent
  ]
})
export class ProfileLeavesComponentModule {}
