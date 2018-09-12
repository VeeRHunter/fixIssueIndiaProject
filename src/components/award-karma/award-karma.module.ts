import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {AwardKarmaComponent} from "./award-karma";

@NgModule({
  declarations: [
    AwardKarmaComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    AwardKarmaComponent
  ],
  entryComponents:[
    AwardKarmaComponent
  ]
})
export class AwardKarmaComponentModule {}
